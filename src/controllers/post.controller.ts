import Post from "../models/post.model";
import Community from "../models/community.model";
import { deleteImage, uploadImage } from "../utils/cloudinary";
import { redisClient } from "../utils/redis";
import mongoose from "mongoose";
import fs from "fs-extra";
import { Response, Request } from "express";

export const getPosts = async (req: Request, res: Response) => {
  try {
    const reply = await redisClient.get("posts");
    if (reply) return res.json(JSON.parse(reply));

    const posts = await Post.find()
      .populate("user", "username")
      .populate("community", "title")
      .sort({ createdAt: -1 });

    await redisClient.set("posts", JSON.stringify(posts));
    await redisClient.expire("posts", 15);

    if (posts.length === 0)
      return res
        .status(200)
        .json({ message: "there are no posts published yet." });

    res.json(posts);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const getPostByCommunity = async (req: Request, res: Response) => {
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
    await redisClient.expire(req.params.id, 15);

    if (posts.length === 0)
      return res
        .status(200)
        .json({ message: "there are no posts published yet." });
    res.json(posts);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const reply = await redisClient.get(req.params.id);
    if (reply) return res.json(JSON.parse(reply));

    const post = await Post.findById(req.params.id)
      .populate("user", "username")
      .populate("community", "title");
    await redisClient.set(req.params.id, JSON.stringify(post));
    await redisClient.expire(req.params.id, 15);

    if (!post) return res.status(404).json({ message: "post not found" });
    res.json(post);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const createPost = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { title, text, category } = req.body;
    const communityFound = await Community.findById(req.params.id);
    if (!communityFound) {
      await session.abortTransaction();
      await session.endSession();
      return res
        .status(404)
        .json({ message: "community not found, can not post" });
    }
    const newPost = new Post({
      title,
      text,
      user: req.user.id,
      category,
      community: communityFound.id,
    });

    if (req.files?.image && "tempFilePath" in req.files.image) {
      const result = await uploadImage(req.files.image.tempFilePath);
      newPost.image = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };

      await fs.unlinkSync(req.files.image.tempFilePath);
    }
    await newPost.save({ session });
    await session.commitTransaction();
    await session.endSession();
    res.json({
      title: newPost.title,
      text: newPost.text,
      user: newPost.user,
      category: newPost.category,
      image: newPost.image,
    });
  } catch (err: any) {
    await session.endSession();
    return res.status(500).json({ message: err.message });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "post not found" });
    if (post.image?.public_id) {
      await deleteImage(post.image.public_id);
    }
    res.status(204).json({ message: "post deleted successfully" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          text: req.body.text,
          edited: true,
        },
      },
      { new: true, session }
    );

    if (!post) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(404).json({ message: "post not found" });
    }
    if (req.files?.image && "tempFilePath" in req.files.image) {
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

    if (isObjectChanged) {
      await session.abortTransaction();
      await session.endSession();

      return res
        .status(409)
        .json({ message: "Some error occured, please try again" });
    }
    await session.commitTransaction();
    await session.endSession();
    res.json({
      title: post.title,
      text: post.text,
      image: post.image,
    });
  } catch (err: any) {
    await session.endSession();
    return res.status(500).json({ message: err.message });
  }
};
