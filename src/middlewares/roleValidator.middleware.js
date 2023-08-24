import User from "../models/user.model.js";

export const adminRequired = async (req, res, next) => {
  try {
    if (req.user.role.title !== "admin")
      return res.status(403).json({ message: "not authorized" });
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const moderatorOrAdmin = async (req, res, next) => {
  try {
    if (req.user.role.title !== "moderator" && req.user.role.title !== "admin")
      return res.status(403).json({ message: "not authorized" });
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
