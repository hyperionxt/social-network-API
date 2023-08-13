import { createAccessToken, createPasswordToken } from "../libs/jwt.js";
import { RESEND_API_KEY, DOMAIN } from "../config.js";
import User from "../models/user.model.js";
//to encrypt the password
import bcryptjs from "bcryptjs";
import { uploadImage, deleteImage } from "../utils/cloudinary.js";
import fs from "fs-extra";
import { Resend } from "resend";

export const signUp = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    const emailFound = await User.findOne({ email });

    if (emailFound)
      return res.status(400).json({ message: "Email already exists" });

    const usernameFound = await User.findOne({ username });
    if (usernameFound)
      return res.status(400).json({ message: "Username already exists" });

    const passHash = await bcryptjs.hash(password, 10);

    const newUser = new User({
      email,
      password: passHash,
      username,
    });

    if (req.files?.image) {
      const result = await uploadImage(req.files.image.tempFilePath);
      newUser.image = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
      //delete temp files
      await fs.unlinkSync(req.files.image.tempFilePath);
    }

    const userCreated = await newUser.save();
    const token = await createAccessToken({
      id: userCreated._id,
      superuser: userCreated.superuser,
    });

    res.cookie("token", token);

    res.json({
      id: userCreated._id,
      username: userCreated.username,
      email: userCreated.email,
      image: userCreated.image,
      createdAt: userCreated.createdAt,
    });

    console.log("new user created successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = await User.findOne({ email });
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
    console.log({ message: error.message });
  }
};
export const signOut = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  console.log("Bye");
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);

  if (!userFound)
    return res.status(404).json({ message: "User does not exist" });

  return res.json({
    username: userFound.username,
    email: userFound.email,
    createdAt: userFound.createdAt,
    description: userFound.description,
    password: userFound.password,
    image: userFound.image,
  });
};

export const updateProfile = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        message: "Unauthorized. You can only modify your own profile.",
      });
    } else {
      const { password, username, email, description } = req.body;
      const userData = {};

      if (password) {
        const hashedPassword = await bcryptjs.hash(password, 10);
        userData.password = hashedPassword;
      }
      if (email) userData.email = email;

      if (description) userData.description = description;

      if (username) userData.username = username;

      const userFound = await User.findByIdAndUpdate(req.params.id, userData, {
        new: true,
      });

      if (!userFound)
        return res.status(500).json({ message: "User not found" });
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
    }
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
      from: 'Acme <onboarding@resend.dev>',
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
    const userFound = await User.findById(req.params.id);
    if (!userFound) return res.status(404).json({ message: "User not found" });
    const passHash = await bcryptjs.hash(password, 10);
    await User.updateOne({ id: id }, { $set: { password: passHash } });
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
