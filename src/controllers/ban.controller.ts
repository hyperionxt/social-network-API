import mongoose from "mongoose";
import Ban from "../models/ban.model";
import User from "../models/user.model";
import { Request, Response } from "express";

export const getBannedUsers = async (req: Request, res: Response) => {
  try {
    const users = Ban.find().populate("user");
    if (!users)
      return res.status(200).json({ message: "No banned users" });
    res.json({
      id: users._id,
      username: users.username,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getBannedUser = async (req: Request, res: Response) => {
  try {
    const user = Ban.findById(req.params.id).populate("user");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const createBannedUser = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const reason = req.body;
    const userFound = await User.findById(req.params.id);
    if (!userFound) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(404).json({ message: "user not found" });
    }
    if (userFound.banned) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(400).json({ message: "user already banned" });
    }

    userFound.banned = true;
    const userBanned = new Ban({
      user: userFound._id,
      reason: reason,
    });
    await userBanned.save({ session });
    await userFound.save({ session });
    await session.commitTransaction();
    await session.endSession();
    res.json({ message: "user banned" });
  } catch (error: any) {
    await session.endSession();
    return res.status(500).json({ message: error.message });
  }
};
export const unBanUser = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const userFound = await User.findById(req.params.id);
    if (!userFound) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(404).json({ message: "user not found" });
    }
    await Ban.findByIdAndDelete({ user: userFound._id });
    userFound.banned = false;
    await userFound.save();
    res.json(userFound);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
export const updateBannedUser = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const reason = req.body;
    const userBanned = await Ban.findOneAndUpdate(
      { user: req.params.id },
      reason,
      {
        new: true,
        session,
      }
    );
    if (!userBanned) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(404).json({ message: "user not found" });
    }
    await session.commitTransaction();
    await session.endSession();
    res.json(userBanned);
  } catch (error: any) {
    await session.endSession();
    return res.status(500).json({ message: error.message });
  }
};
