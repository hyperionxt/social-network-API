import User from "../models/user.model.js";

export const adminRequired = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("role");
    if (user.role.title !== "admin")
      return res.status(403).json({ message: "not authorized" });
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const moderatorOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("role");
    if (user.role.title !== "moderator" && user.role.title !== "admin")
      return res.status(403).json({ message: "not authorized" });
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};