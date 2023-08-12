import { config } from "dotenv";
config();
export const PORT = process.env.PORT;
//MONGODB CONNECTION STRING
export const MONGODB_URI = process.env.MONGODB_URI;
//SECRET KEY JWT
export const JWT_SECRET_KEY = process.env.SECRET_KEY;
//NODEMAILER
export const USER = process.env.USER;
export const PASSWORD = process.env.PASSWORD;
//CLOUDINARY CONFIG
export const CLOUD_NAME = process.env.CLOUD_NAME;
export const API_KEY = process.env.API_KEY;
export const API_SECRET = process.env.API_SECRET;
          
