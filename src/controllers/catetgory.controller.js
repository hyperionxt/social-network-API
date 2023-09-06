import mongoose from "mongoose";
import Category from "../models/category.model.js";
import Post from "../models/post.model.js";
import { redisClient } from "../utils/redis.js";

export const getCategories = async (req, res) => {
  try {
    const reply = await redisClient.get("categories");
    if (reply) return res.json(JSON.parse(reply));

    const categories = await Category.find();
    if (!categories)
      return res.status(404).json({ message: "No categories created yet" });
    await redisClient.set("categories", JSON.stringify(categories));
    await redisClient.expire("categories", 15);
    res.json(categories);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPostsByCategory = async (req, res) => {
  try {
    const reply = await redisClient.get(req.params.id);
    if (reply) return res.json(JSON.parse(reply));
    const postsFound = await Post.find({ category: req.params.id });
    if (!postsFound) return res.status(404).json({ message: "Not found" });
    await redisClient.set(req.params.id, JSON.stringify(postsFound));
    await redisClient.expire(req.params.id, 15);
    res.json(postsFound);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const createCategory = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { title } = req.body;
    const categoryFound = await Category.findOne({ title });
    if (categoryFound) {
      await session.abortTransaction();
      await session.endSession();

      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new Category({
      title,
      author: req.user.id,
    });
    await newCategory.save({ session });
    await session.commitTransaction();
    await session.endSession();

    res.json(newCategory);
  } catch (err) {
    await session.endSession();
    return res.status(500).json({ message: err.message });
  }
};
export const deleteCategory = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(404).json({ message: "Category not found" });
    }
    await session.commitTransaction();
    await session.endSession();
    return res.status(200).json({ message: "Category deleted" });
  } catch (err) {
    await session.endSession();
    return res.status(500).json({ message: err.message });
  }
};
export const updateCategory = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      session,
    });
    if (!category) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(404).json({ message: "Category not found" });
    }
    await session.commitTransaction();
    await session.endSession();
    return res.json({ message: "category updated!" });
  } catch (err) {
    await session.endSession();

    return res.status(500).json({ message: err.message });
  }
};
