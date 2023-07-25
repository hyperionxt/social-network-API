import { config } from "dotenv";
import multer from "multer";
config();

export const PORT = 3000;

export const JWT_SECRET_KEY = process.env.SECRET_KEY;
