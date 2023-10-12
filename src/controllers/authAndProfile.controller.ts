import { Response, Request } from "express";
import {
  createAccessToken,
  createEmailToken,
  createPasswordToken,
} from "../libs/jwt";
import User from "../models/user.model";
import Role from "../models/role.models";
import bcryptjs from "bcryptjs";
import { uploadImage, deleteImage } from "../utils/cloudinary";
import fs from "fs-extra";
import { emailService } from "../utils/resend";
import { redisClient } from "../utils/redis";
import mongoose from "mongoose";

export const signUp = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const { email, password, username } = req.body;

    const emailFound = await User.findOne({ email });

    if (emailFound)
      return res.status(400).json({ message: "Email already in use" });

    const usernameFound = await User.findOne({ username });
    if (usernameFound)
      return res.status(400).json({ message: "Username already in use" });
    const roleFound = await Role.findOne({ title: "regular" });
    if (!roleFound)
      return res
        .status(404)
        .json({ message: "Role 'regular' is required on database" });
    const passHash = await bcryptjs.hash(password, 10);

    const newUser = new User({
      email,
      password: passHash,
      username,
      role: roleFound,
    });

    const userCreated = await newUser.save({ session });
    const token = await createEmailToken({
      id: userCreated._id,
      role: userCreated.role,
    });
    const subject = "Email confirmaation";
    const url = `http://localhost:3000/api/user-verified/${token}`;

    await emailService(email, url, subject);

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({ message: "Email sent" });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({ message: error.message });
  }
};

export const userVerified = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();

  try {
    const newUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: { verified: true },
      },
      { new: true, session }
    ).populate("role");
    if (!newUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User does not exist" });
    }
    if (req.files?.image && "tempFilePath" in req.files.image) {
      const result = await uploadImage(req.files.image.tempFilePath);
      newUser.image = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
      await fs.unlinkSync(req.files.image.tempFilePath);
    }
    const token = await createAccessToken({
      id: newUser._id,
      role: newUser.role,
    });
    res.cookie("token", token);
    res.json({
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      image: newUser.image.secure_url,
    });

    await session.commitTransaction();
    session.endSession();
  } catch (error: any) {
    session.endSession();
    return res.status(500).json({ message: error.message });
  }
};

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const userFound = await User.findOne({ email }).populate("role");
    if (!userFound) return res.status(400).json({ message: "User not found" });
    if (userFound.verified === false)
      return res.status(400).json({
        message:
          "email not verified, check your inbox and use the confirmation link",
      });
    if (userFound.banned === true)
      return res.status(400).json({ message: "Cant login, you are banned" });
    const match = await bcryptjs.compare(password, userFound.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = await createAccessToken({
      id: userFound._id,
      role: userFound.role,
      banned: userFound.banned,
    });
    res.cookie("token", token);
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      role: userFound.role,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export const signOut = (req: Request, res: Response) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  console.log("Bye");
  return res.sendStatus(200);
};

export const myProfile = async (req: Request, res: Response) => {
  try {
    const reply = await redisClient.get(req.user.id);
    if (reply) return res.json(JSON.parse(reply));

    const userFound = await User.findById(req.user.id);
    await redisClient.set(req.user.id, JSON.stringify(userFound));
    await redisClient.expire(req.user.id, 15);
    if (!userFound)
      return res.status(404).json({ message: "User does not exist" });

    return res.json({
      username: userFound.username,
      email: userFound.email,
      description: userFound.description,
      created: userFound.createdAt,
      image: userFound.image.secure_url,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const otherUserProfile = async (req: Request, res: Response) => {
  try {
    const reply = await redisClient.get(req.params.id);
    if (reply) return res.json(JSON.parse(reply));
    const userFound = await User.findById(req.params.id);
    await redisClient.set(req.params.id, JSON.stringify(userFound));
    await redisClient.expire(req.params.id, 15);

    if (!userFound)
      return res.status(404).json({ message: "User does not exist" });

    return res.json({
      username: userFound.username,
      description: userFound.description,
      image: userFound.image.secure_url,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const { oldPassword, password, username, email, description } = req.body;
    const userFound = await User.findById(req.user.id).sesion(session);
    if (!userFound) {
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({ message: "User not found" });
    }

    if (oldPassword) {
      const match = await bcryptjs.compare(oldPassword, userFound.password);
      if (!match) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: "Invalid password" });
      }

      const hashedPassword = await bcryptjs.hash(password, 10);
      userFound.password = hashedPassword;
    }

    if (email) {
      const emailFound = await User.findOne({ email }).session(session);
      if (emailFound) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: "Email already in use" });
      }

      userFound.email = email;
    }
    if (description) userFound.description = description;

    if (username) {
      const usernameFound = await User.findOne({ username });
      if (usernameFound) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: "Username already in use" });
      }
      userFound.username = username;
    }
    const updatedUser = await userFound.save({ session });

    if (req.files?.image && "tempFilePath" in req.files.image) {
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
    await session.commitTransaction();
    session.endSession();
    res.json({
      username: updatedUser.username,
      email: updatedUser.email,
      description: updatedUser.description,
      verified: updatedUser.verified,
      image: updatedUser.image.secure_url,
    });
    console.log("Profile updated successfully");
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    return res.status(404).json({ message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(404).json({ message: "User not found" });

    const token = await createPasswordToken({
      email: userFound.email,
      id: userFound._id,
    });
    const subject = "Reset Password";
    const url = `http://localhost:3000/api/reset-password/${userFound._id}/${token}`;

    await emailService(email, url, subject);
    res.status(200).json({ message: "Email sent, please check your inbox" });
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const newPassword = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { password } = req.body;
    const passHash = await bcryptjs.hash(password, 10);
    const userFound = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { password: passHash } },
      { new: true, session }
    );
    if (!userFound) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();

    return res.status(404).json({ message: err.message });
  }
};
