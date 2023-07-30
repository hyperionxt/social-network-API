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
    const { title, description, category, community } = req.body;
    const newPost = new Post({
      title,
      description,
      user: req.user.id,
      category,
      community,
    });
    await newPost.save();
    res.json(newPost);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(204).json({ message: "Post deleted successfully" });
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

//Normal user only are allowed to update title and description of their posts..
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          edited: true,
        },
      },
      { new: true }
    );

    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};
