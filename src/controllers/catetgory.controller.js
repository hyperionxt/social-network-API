import Category from "../models/category.model.js";
import Post from "../models/post.model.js";

export const getPostsByCategory = async (req, res) => {
  try {
    const categoryMatch = await Category.findById(req.params.id);
    if (!categoryMatch)
      return res.status(404).json({ message: "Category not found" });
    const post = await Post.find({ category: categoryMatch._id });
    if (!post)
      return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { title } = req.body;
    const newCategory = new Category({
      title,
      author: req.user.id,
    });
    await newCategory.save();
    res.json(newCategory);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!category)
      return res.status(404).json({ message: "Category not found" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
