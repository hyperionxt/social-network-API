import { JWT_SECRET_KEY } from "../config.js";
import jwt from "jsonwebtoken";
//Payload is the data saved in the token.

export function createAccessToken(payload) {
  return new Promise((resolve, reject) => {
    
    jwt.sign(payload,JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
}