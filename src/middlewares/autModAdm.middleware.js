import Post from "../models/post.model.js";
import Community from "../models/community.model.js";
import Comment from "../models/comments.model.js";
import User from "../models/user.model.js";

export const postPermissions = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (
      post.user.toString() === req.user.id ||
      req.user.role.title === "moderator" ||
      req.user.role.title === "admin"
    ) {
      next();
    } else {
      return res.status(403).json({ message: "not authorized" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const communityPermissions = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);
    if (
      community.user.toString() === req.user.id ||
      req.user.role.title === "moderator" ||
      req.user.role.title === "admin"
    ) {
      next();
    } else {
      return res.status(403).json({ message: "not authorized" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const commentPermissions = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (
      comment.user.toString() === req.user.id ||
      req.user.role.title === "moderator" ||
      req.user.role.title === "admin"
    ) {
      next();
    } else {
      return res.status(403).json({ message: "not authorized" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const profilePermissions = async (req, res, next) => {
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
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
