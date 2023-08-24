export const bannedUser = (req, res, next) => {
  if (req.user.banned === true)
    return res.status(401).json({ message: "you cant login, you are banned" });
  next();
};
