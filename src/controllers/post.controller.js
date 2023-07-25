import Post from "../models/post.model.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const task = await Post.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const createPost = async (req, res) => {
  try {

    const {title, description, } = req.body;

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const deletePost = async (req, res) => {};
export const updatePost = async (req, res) => {};
