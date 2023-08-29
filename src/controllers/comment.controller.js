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
  try {
    const text = req.body.text;
    const newComment = new Comment({
      text,
      user: req.user.id,
      post: req.params.postId,
    });
    await newComment.save();
    res.json(newComment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createReply = async (req, res) => {
  try {
    const { text } = req.body;
    const newReply = new Comment({
      text,
      user: req.user.id,
      parentComment: req.params.commentId,
    });
    await newReply.save();
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "comment not found" });
    comment.replies.push(newReply);
    await comment.save();
    res.json(newReply);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteComments = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "comment not found" });
    return res.status(200).json({ messsage: "comment deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const updateComments = async (req, res) => {
  try {
    const comment = await Comment.findbyIdAndUpdate(
      req.params.commentId,

      { $set: { text: req.body.text, edited: true } },
      { new: true }
    );
    if (!comment) return res.status(404).json({ message: "comment not found" });
    console.log("comment updated successfully by its author");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
