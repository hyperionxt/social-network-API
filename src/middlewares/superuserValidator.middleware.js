export const superUserRequired = (req, res, next) => {
    if (req.user.superuser == false)
      return res
        .status(401)
        .json({ message: "not authorized, you are not superuser" });
    next();
  };
