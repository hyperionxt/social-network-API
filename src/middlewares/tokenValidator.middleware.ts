import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config";
import { Response, Request, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        username: string;
        role: {
          _id: string;
          title: string;
        };
      };
    }
  }
}

export const authRequired = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "no token, unauthorized" });
  } else {
    if (JWT_SECRET_KEY) {
      jwt.verify(token, JWT_SECRET_KEY, (err: any, userDecoded: any) => {
        if (err)
          return res
            .status(401)
            .json({ message: "token invalid, unauthorized" });
        console.log("authentication token approved!");
        req.user = userDecoded;
        next();
      });
    } else {
      throw new Error("JWT_SECRET_KEY is not defined");
    }
  }
};

export const passwordTokenRequired = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.params;
  if (!token) {
    return res.status(401).json({
      message: "no password reset token, you cant reset your password",
    });
  } else {
    if (JWT_SECRET_KEY) {
      jwt.verify(token, JWT_SECRET_KEY, (err) => {
        if (err) {
          return res
            .status(401)
            .json({ message: "invalid password reset token." });
        }
        console.log("password reset token approved.");
        next();
      });
    } else {
      throw new Error("JWT_SECRET_KEY is not defined");
    }
  }
};

export const emailTokenRequired = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.params;
  if (!token) {
    return res.status(401).json({
      message: "no token, you can not complete your register",
    });
  } else {
    if (JWT_SECRET_KEY) {
      jwt.verify(token, JWT_SECRET_KEY, (err: any, userDecoded: any) => {
        if (err) {
          return res.status(401).json({ message: "invalid email token." });
        }
        console.log("email token approved.");
        req.user = userDecoded;
        next();
      });
    } else {
      throw new Error("JWT_SECRET_KEY is not defined");
    }
  }
};
