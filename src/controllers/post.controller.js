import Post from "../models/post.model.js";
import Community from "../models/community.model.js";
import { deleteImage, uploadImage } from "../utils/cloudinary.js";
import { redisClient } from "../utils/redis.js";

export const getPosts = async (req, res) => {
  try {
    const reply = await redisClient.get("posts");
    if (reply) return res.json(JSON.parse(reply));

    const posts = await Post.find()
      .populate("user", "username")
      .populate("community", "title")
      .sort({ createdAt: -1 });

    await redisClient.set("posts", JSON.stringify(posts));
    await redisClient.expire("posts".id, 15) 

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
    const reply = await redisClient.get(req.params.id);
    if (reply) return res.json(JSON.parse(reply));

    const posts = await Post.find({ community: req.params.id })
      .sort({
        createdAt: -1,
      })
      .populate("user", "username")
      .populate("community", "title");

    await redisClient.set(req.params.id, JSON.stringify(posts));
    await redisClient.expire(req.params.id, 15) 

    if (posts.length === 0)
      return res
        .status(200)
        .json({ message: "there are no posts published yet." });
    res.json(posts);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const reply = await redisClient.get(req.params.id);
    if (reply) return res.json(JSON.parse(reply));

    const post = await Post.findById(req.params.id)
      .populate("user", "username")
      .populate("community", "title");
    await redisClient.set(req.params.id, JSON.stringify(post));
    await redisClient.expire(req.params.id, 15)

    if (!post) return res.status(404).json({ message: "post not found" });
    res.json(post);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, text, category } = req.body;
    const communityFound = await Community.findById(req.params.id);
    if (!communityFound)
      return res
        .status(404)
        .json({ message: "community not found, can not post" });
    const newPost = new Post({
      title,
      text,
      user: req.user.id,
      category,
      community: communityFound.id,
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
          text: req.body.text,
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
      text: post.text,
      image: image.secure_url,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
