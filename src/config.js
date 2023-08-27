import { config } from "dotenv";
config();
//BACKEND PORT
export const PORT = process.env.PORT;
//CLIENT DOMAIN
export const CLIENT = process.env.CLIENT
//MONGODB CONNECTION STRING
export const MONGODB_URI = process.env.MONGODB_URI;
//SECRET KEY JWT
export const JWT_SECRET_KEY = process.env.SECRET_KEY;
//RESEND CONFIG
export const RESEND_API_KEY = process.env.RESEND_API_KEY;
export const DOMAIN = process.env.DOMAIN;
//CLOUDINARY CONFIG
export const CLOUD_NAME = process.env.CLOUD_NAME;
export const API_KEY = process.env.API_KEY;
export const API_SECRET = process.env.API_SECRET;
