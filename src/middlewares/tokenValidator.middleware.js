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
      console.log("token approved by tokenValidator.middleware!");
      req.user = userDecoded;
      next();
    });
  }
};

export const passwordTokenRequired = (req, res, next) => {
  const { id, token } = req.params;
  if (!token) {
    return res.status(401).json({ message: "no password reset token, you cant reset your password" });
  } else {
    jwt.verify(token, JWT_SECRET_KEY, (err, userDecoded) => {
      if (err)
        return res.status(401).json({ message: "password token invalid, unauthorized" });
      console.log("password reset token approved");
      req.user = userDecoded;
      next();
    });
  }
};
