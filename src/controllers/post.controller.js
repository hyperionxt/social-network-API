import Post from "../models/post.model.js";
import { deleteImage, uploadImage } from "../utils/cloudinary.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    if (posts.length === 0)
      return res
        .status(200)
        .json({ message: "there are no posts published yet." });
    res.json(posts);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getPostByCommunity = async (req, res) => {
  try {
    const post = await Post.find({ community: req.params.communityId }).sort({
      createdAt: -1,
    });
    if (post.length === 0)
      return res
        .status(200)
        .json({ message: "there are no posts published yet." });
    res.json(post);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "post not found" });
    res.json(post);
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

    if (req.files?.image) {
      const result = await uploadImage(req.files.image.tempFilePath);
      newPost.image = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };

      await fs.unlinkSync(req.files.image.tempFilePath);
    }
    await newPost.save();
    res.json(newPost);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "post not found" });
    if (post.image?.public_id) {
      await deleteImage(post.image.public_id);
    }
    res.status(204).json({ message: "post deleted successfully" });
  } catch (err) {
    return res.stauts(500).json({ message: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          edited: true,
        },
      },
      { new: true }
    );

    if (!post) return res.status(404).json({ message: "post not found" });
    if (req.files?.image) {
      if (post.image?.public_id) {
        await deleteImage(post.image.public_id);
      }
      const result = await uploadImage(req.files.image.tempFilePath);
      post.image = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
      await fs.unlinkSync(req.files.image.tempFilePath);
    }
    const isObjectChanged = await Post.exists({ _id: post._id, __v: post.__v });

    if (isObjectChanged)
      return res
        .status(409)
        .json({ message: "Post was edited by another user" });

    res.json({
      title: post.title,
      description: post.description,
      image: image.secure_url,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
