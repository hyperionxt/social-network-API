import Category from "../models/category.model.js";
import Community from "../models/community.model.js";

export const getPostsByCategory = async (req, res) => {
  try {
    const categoryMatch = await Category.findById(req.params.id);
    if (!categoryMatch)
      return res.status(404).json({ message: "Category not found" });
    const community = await Community.find({ category: categoryMatch._id });
    if (!community)
      return res.status(404).json({ message: "Community not found" });
    res.json(community);
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
