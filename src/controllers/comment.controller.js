import Comment from "../models/comments.model.js";

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId });
    res.json(comments);
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
    return res.status(404).json({ message: error.message });
  }
};

export const createReply = async (req, res) => {
  try {
    const text = req.body.text;
    const newReply = new Comment({
      text,
      user: req.user.id,
      post: req.params.postId,
      parentComment: req.params.commentId,
    });
    await newReply.save();
    const comment = await Comment.findById(req.params.commentId);
    comment.replies.push(newReply);
    await comment.save();
    res.json(newReply);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const deleteComments = async (req, res) => {
  try {
    if (req.user.superuser == true) {
      const comment = await Comment.findByIdAndDelete(req.params.commentId);
      if (!comment)
        return res.status(404).json({ message: "comment not found" });

      console.log("comment deleted successfully by superuser");
    } else {
      const match = await Comment.findById(req.params.commentId);
      if (match.user.id != req.user.id)
        return res.status(404).json({ message: "not authorized" });
      const comment = await Comment.findOneAndDelete({
        _id: req.params.commentId,
        user: req.user.id,
      });
      if (!comment)
        return res.status(404).json({ message: "comment not found" });

      console.log("comment deleted successfully by its author");
    }
  } catch (err) {
    return res.status(500).json({ message: error.message });
  }
};
export const updateComments = async (req, res) => {
  try {
    if (req.user.superuser == true) {
      const comment = await Comment.findByIdAndUpdate(
        req.params.commentId,
        { text: req.body.text, edited: true },
        { new: true }
      );
      if (!comment)
        return res.status(404).json({ message: "comment not found" });

      console.log("comment updated successfully by superuser");
    } else {
      const match = await Comment.findById(req.params.commentId);
      if (match.user.id != req.user.id)
        return res.status(404).json({ message: "not authorized" });
      const comment = await Comment.findOneAndUpdate(
        {
          _id: req.params.commentId,
          user: req.user.id,
        },
        { $set: { text: req.body.text, edited: true } },
        { new: true }
      );
      if (!comment)
        return res.status(404).json({ message: "comment not found" });
      console.log("comment updated successfully by its author");
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
