import mongoose from "mongoose";
import Comment from "../models/comments.model.js";
import { redisClient } from "../utils/redis.js";

export const getCommentsByPost = async (req, res) => {
  try {
    const reply = await redisClient.get(req.params.postId);
    if (reply) return res.json(JSON.parse(reply));

    const comments = await Comment.find({ post: req.params.postId })
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select: "username",
        },
      })
      .populate("user", "username");
    await redisClient.set(req.params.postId, JSON.stringify(comments));
    await redisClient.expire(req.params.postId, 15);
    if (comments.length === 0)
      return res.status(200).json({ message: "there are no comments" });
    res.json(comments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCommentOrReply = async (req, res) => {
  try {
    const reply = await redisClient.get(req.params.commentId);
    if (reply) return res.json(JSON.parse(reply));

    const comment = await Comment.findById(req.params.commentId).populate(
      "user",
      "username"
    );
    if (!comment) return res.status(404).json({ message: "comment not found" });
    await redisClient.set(req.params.commentId, JSON.stringify(comment));
    await redisClient.expire(req.params.commentId, 15);
    res.json(comment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createComments = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const text = req.body.text;
    const postFound = await Post.findById(req.params.postId);
    if (!postFound) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(404).json({ message: "post not found" });
    }
    const newComment = new Comment({
      text,
      user: req.user.id,
      post: req.params.postId,
    });

    await newComment.save({ session });
    await session.commitTransaction();
    await session.endSession();
    res.json(newComment);
  } catch (error) {
    await session.endSession();
    return res.status(500).json({ message: error.message });
  }
};

export const createReply = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { text } = req.body;
    const commentFound = await Comment.findById(req.params.commentId);
    if (!commentFound) {
      await session.abortTransaction();
      await session.endSession();

      return res.status(404).json({ message: "comment not found" });
    }
    const newReply = new Comment({
      text,
      user: req.user.id,
      parentComment: commentFound._id,
    });
    await newReply.save({ session });
    commentFound.replies.push(newReply);
    await commentFound.save({ session });
    await session.commitTransaction();
    await session.endSession();
    res.json(newReply);
  } catch (error) {
    await session.endSession();

    return res.status(500).json({ message: error.message });
  }
};

export const deleteComments = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const comment = await Comment.findByIdAndDelete(req.params.commentId);
    if (!comment) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(404).json({ message: "comment not found" });
    }
    await session.commitTransaction();
    await session.endSession();
    return res.status(200).json({ messsage: "comment deleted successfully" });
  } catch (err) {
    await session.endSession();

    return res.status(500).json({ message: err.message });
  }
};
export const updateComments = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const comment = await Comment.findByIdAndUpdate(
      req.params.commentId,

      { $set: { text: req.body.text, edited: true } },
      { new: true, session }
    );
    if (!comment) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(404).json({ message: "comment not found" });
    }
    await session.commitTransaction();
    await session.endSession();
    return res.json({ message: "comment updated!" });
  } catch (error) {
    await session.endSession();

    return res.status(500).json({ message: error.message });
  }
};
