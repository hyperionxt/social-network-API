import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config.js";

export const authRequired = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "no token, unauthorized" });
  } else {
    jwt.verify(token, JWT_SECRET_KEY, (err, userDecoded) => {
      if (err)
        return res.status(401).json({ message: "token invalid, unauthorized" });
      console.log(userDecoded);
      console.log("token approved by tokenValidator.middleware!");
      req.user = userDecoded;
      next();
    });
  }
};

export const superUserRequired = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "no token, unauthorized" });
  } else {
    jwt.verify(token, JWT_SECRET_KEY, (err, userDecoded) => {
      if (err)
        return res.status(401).json({ message: "token invalid, unauthorized" });
      console.log(userDecoded);
      req.user = userDecoded;
      if (req.user.superuser==false)
        return res.status(401).json({ message: "not authorized, you are not superuser" });
      next();
    });
  }
};
