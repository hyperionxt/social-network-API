import User from "../models/user.model";
import Post, { PostSchema } from "../models/post.model";
import Community, { CommunitySchema } from "../models/community.model";
import Comment, { CommentSchema } from "../models/comments.model";
import Report from "../models/report.model";
import mongoose from "mongoose";
import { Request, Response } from "express";

export const getReports = async (req: Request, res: Response) => {
  try {
    const reportsFound = await Report.find();
    if (!reportsFound)
      return res.status(200).json({ message: "no reports yet" });
    res.json(reportsFound);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getReportsById = async (req: Request, res: Response) => {
  try {
    const reportsFound = await Report.findById(req.params.id);
    if (!reportsFound)
      return res.status(200).json({ message: "this user has not reports" });
    res.json(reportsFound);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
export const createReport = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { context } = req.body;
    const userFound = await User.findById(req.params.userId);
    if (!userFound || userFound.verified === false) {
      await session.endSession();
      await session.abortTransaction();
      return res.status(400).json({ message: "Not found or invalid" });
    }

    let elementFound;
    elementFound = await Post.findById(req.params.elementId);

    if (!elementFound) {
      elementFound = await Comment.findById(req.params.elementId);
    }
    if (!elementFound) {
      elementFound = await Community.findById(req.params.elementId);
    }

    if (!elementFound) {
      await session.endSession();
      await session.abortTransaction();
      return res.status(404).json({ message: "Object not found or invalid" });
    }
    const newReport = new Report({
      userReported: { username: userFound.username, id: userFound._id },
      reportedBy: req.user.id,
      context,
      elementsReported: {
        id: elementFound._id,
        text: elementFound.text,
      }, //saving text or title in cases when user deletes the prof and admin cant find it.
    });
    await newReport.save({ session });

    await session.commitTransaction();
    await session.endSession();
    return res.status(200).json(newReport);
  } catch (error: any) {
    await session.endSession();
    return res.status(500).json({ message: error.message });
  }
};

export const deleteOneReport = async (req: Request, res: Response) => {
  try {
    const reportFound = await Report.findByIdAndDelete(req.params.id);
    if (!reportFound)
      return res.status(404).json({ message: "report not found or invalid" });
    return res.status(200).json({ message: "report deleted" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAllReportsByUserId = async (req: Request, res: Response) => {
  try {
    const reportsFound = await Report.deleteMany({
      userReported: req.params.id,
    });
    if (!reportsFound)
      return res.status(404).json({ message: "this user has not reports" });
    return res.status(200).json({ message: "all reports deleted" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
