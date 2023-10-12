import { JWT_SECRET_KEY } from "../config";
import jwt from "jsonwebtoken";

export function createAccessToken(payload:any) {
  return new Promise((resolve, reject) => {
    if (JWT_SECRET_KEY) {
      jwt.sign(
        payload,
        JWT_SECRET_KEY,
        {
          expiresIn: "1d", // 24 hours
        },
        (err, token) => {
          if (err) {
            reject(err);
          } else {
            resolve(token);
          }
        }
      );
    } else {
      reject(new Error("JWT_SECRET_KEY not defined"));
    }
  });
}

export function createPasswordToken(payload:any) {
  return new Promise((resolve, reject) => {
    if (JWT_SECRET_KEY) {
      jwt.sign(
        payload,
        JWT_SECRET_KEY,
        {
          expiresIn: "10m", //10 minutes
        },
        (err, token) => {
          if (err) {
            reject(err);
          } else {
            resolve(token);
          }
        }
      );
    } else {
      reject(new Error("JWT_SECRET_KEY not defined"));
    }
  });
}

export function createEmailToken(payload:any) {
  return new Promise((resolve, reject) => {
    if (JWT_SECRET_KEY) {
      jwt.sign(
        payload,
        JWT_SECRET_KEY,
        {
          expiresIn: "1h", //1 hour,
        },
        (err, token) => {
          if (err) {
            reject(err);
          } else {
            resolve(token);
          }
        }
      );
    } else {
      reject(new Error("JWT_SECRET_KEY not defined"));
    }
  });
}
