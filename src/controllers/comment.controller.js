import Comment from "../models/comments.model.js";
import Community from "../models/community.model.js";

export const getComments = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    const comment = await Comment.findOne(community);
    res.json(comment);
  } catch (err) {
    return res.status(500).json({ message: "something went wrong" });
  }
};
export const createComments = async (req, res) => {
  try {
    const text = req.body;
    const newComment = new Comment({
      text,
      user: req.user.id,
      community: req.params.id,
    });
    await newComment.save();
    res.json(newComment);
  } catch (err) {
    return res.status(404).json({ message: "something went wrong" });
  }
};
export const deleteComments = async (req, res) => {
  try {
    if (req.user.superuser == true) {
      const comment = await Comment.findByIdAndDelete(req.params.id);
      if (!comment)
        return res.status(404).json({ message: "comment not found" });
      console.log("comment deleted successfully by superuser");
    } else {
      const comment = await Comment.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id,
      });
      if (!comment)
        return res.status(404).json({ message: "comment not found" });
      console.log("comment deleted successfully by its author");
      res.json(comment);
    }
  } catch (err) {
    return res.status(500).json({ message: "something went wrong" });
  }
};
export const updateComments = async (req, res) => {
  try {
    if (req.user.superuser == true) {
      const comment = await Comment.findByIdAndUpdate(
        req.params.id,
        { ...req.body, edited: true },
        { new: true }
      );
      if (!comment)
        return res.status(404).json({ message: "comment not found" });
      console.log("comment updated successfully by superuser");
    } else {
      const comment = await Comment.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user.id,
        },
        { $set: { text: req.body, edited: true } }
      );
      if (!comment)
        return res.status(404).json({ message: "comment not found" });
      console.log("comment updated successfully by its author");
    }
  } catch (err) {
    return res.status(500).json({ message: "something went wrong" });
  }
};
