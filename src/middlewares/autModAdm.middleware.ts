import Post from "../models/post.model";
import Community from "../models/community.model";
import Comment from "../models/comments.model";
import User from "../models/user.model";
import { Response, Request, NextFunction } from "express";

export const postPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await Post.findById(req.params.id);
    if (
      post &&
      (post.user.toString() === req.user.id ||
        req.user.role.title === "moderator" ||
        req.user.role.title === "admin")
    ) {
      next();
    } else {
      return res.status(403).json({ message: "not authorized" });
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const communityPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community)
      return res.status(404).json({ message: "community not found" });
    if (
      community.user.toString() === req.user.id ||
      req.user.role.title === "moderator" ||
      req.user.role.title === "admin"
    ) {
      next();
    } else {
      return res.status(403).json({ message: "not authorized" });
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const commentPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentFound = await Comment.findById(req.params.id);
    if (!commentFound)
      return res.status(404).json({ message: "comment not found" });
    if (
      commentFound.user.toString() === req.user.id ||
      req.user.role.title === "moderator" ||
      req.user.role.title === "admin"
    ) {
      next();
    } else {
      return res.status(403).json({ message: "not authorized" });
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const profilePermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userFound = await User.findById(req.user.id);
    if (
      userFound ||
      req.user.role.title === "moderator" ||
      req.user.role.title === "admin"
    ) {
      next();
    } else {
      return res.status(403).json({ message: "not authorized" });
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
