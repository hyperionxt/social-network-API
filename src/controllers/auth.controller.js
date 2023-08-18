import {
  createAccessToken,
  createEmailToken,
  createPasswordToken,
} from "../libs/jwt.js";
import { RESEND_API_KEY, DOMAIN } from "../config.js";
import User from "../models/user.model.js";
//to encrypt the password
import bcryptjs from "bcryptjs";
import { uploadImage, deleteImage } from "../utils/cloudinary.js";
import fs from "fs-extra";
import { Resend } from "resend";
import { emailConfirmation } from "../services/resend.js";

export const signUp = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    const emailFound = await User.findOne({ email });

    if (emailFound)
      return res.status(400).json({ message: "Email already in use" });

    const usernameFound = await User.findOne({ username });
    if (usernameFound)
      return res.status(400).json({ message: "Username already in use" });

    const passHash = await bcryptjs.hash(password, 10);

    const newUser = new User({
      email,
      password: passHash,
      username,
    });

    const userCreated = await newUser.save();
    const token = await createEmailToken({
      id: userCreated._id,
      superuser: userCreated.superuser,
    });

    const url = `http://localhost:3000/api/user-confirmed/${userCreated._id}/${token}`;

    await emailConfirmation(email, url);

    res.json({
      id: userCreated._id,
      username: userCreated.username,
      email: userCreated.email,
      image: userCreated.image,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const userConfirmed = async (req, res) => {
  try {
    const newUser = await User.findByIdAndUpdate(req.params.id, {
      $set: { confirmed: true },
    });
    if (!newUser)
      return res.status(404).json({ message: "User does not exist" });
    if (req.files?.image) {
      const result = await uploadImage(req.files.image.tempFilePath);
      newUser.image = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
      await fs.unlinkSync(req.files.image.tempFilePath);
    }
    const token = await createAccessToken({
      id: newUser._id,
      superuser: newUser.superuser,
    });
    res.cookie("token", token);
    res.json({
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      image: newUser.image.secure_url,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = await User.findOne({ email });
    if (userFound.confirmed === false)
      return res.status(400).json({
        message:
          "email not confirmed, check your inbox for the confirmation link",
      });
    if (!userFound) return res.status(400).json({ message: "User not found" });

    const match = await bcryptjs.compare(password, userFound.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = await createAccessToken({
      id: userFound._id,
      superuser: userFound.superuser,
    });
    res.cookie("token", token);
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      superuser: userFound.superuser,
    });
    console.log("Welcome, " + userFound.username);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const signOut = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  console.log("Bye");
  return res.sendStatus(200);
};

export const myProfile = async (req, res) => {
  try {
    const userFound = await User.findById(req.user.id);

    if (!userFound)
      return res.status(404).json({ message: "User does not exist" });

    return res.json({
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      description: userFound.description,
      password: userFound.password,
      image: userFound.image.secure_url,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const otherUserProfile = async (req, res) => {
  try {
    const userFound = await User.findById(req.params.id);

    if (!userFound)
      return res.status(404).json({ message: "User does not exist" });

    return res.json({
      username: userFound.username,
      description: userFound.description,
      image: userFound.image.secure_url,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { password, username, email, description } = req.body;
    const userData = {};

    if (password) {
      const hashedPassword = await bcryptjs.hash(password, 10);
      userData.password = hashedPassword;
    }
    if (email) userData.email = email;

    if (description) userData.description = description;

    if (username) userData.username = username;

    const userFound = await User.findByIdAndUpdate(req.user.id, userData, {
      new: true,
    });

    if (!userFound) return res.status(500).json({ message: "User not found" });
    if (req.files?.image) {
      if (userFound.image?.public_id) {
        await deleteImage(userFound.image.public_id);
      }
      const result = await uploadImage(req.files.image.tempFilePath);
      userFound.image = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
      await fs.unlinkSync(req.files.image.tempFilePath);
    }
    res.json(userFound);
    console.log("Profile updated successfully");
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(404).json({ message: "User not found" });

    const token = await createPasswordToken({
      email: userFound.email,
      id: userFound._id,
    });
    const url = `http://localhost:3000/api/reset-password/${userFound._id}/${token}`;

    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
      from: DOMAIN,
      to: email,
      subject: "recovery password request",
      text: url,
    });
    res.status(200).json({ message: "Email sent, please check your inbox" });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const newPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const passHash = await bcryptjs.hash(password, 10);
    const userFound = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { password: passHash } },
      { new: true }
    );
    if (!userFound) return res.status(404).json({ message: "User not found" });

    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};
