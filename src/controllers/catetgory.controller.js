import mongoose from "mongoose";
import Category from "../models/category.model.js";
import Post from "../models/post.model.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    if (!categories)
      return res.status(404).json({ message: "No categories created yet" });

    res.json(categories);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPostsByCategory = async (req, res) => {
  try {
    const categoryMatch = await Category.findById(req.params.id);
    if (!categoryMatch)
      return res.status(404).json({ message: "Category not found" });
    const post = await Post.find({ category: categoryMatch._id });
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
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
