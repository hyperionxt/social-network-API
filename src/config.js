import { config } from "dotenv";
config();
//BACKEND PORT
export const DOCKER_PORT = process.env.DOCKER_PORT;
export const LOCAL_PORT = process.env.LOCAL_PORT;
//CLIENT DOMAIN
export const CLIENT = process.env.CLIENT;
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
//REDIS CONFIG
export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT;
export const REDIS_PASS = process.env.REDIS_PASS;
