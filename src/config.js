import { config } from "dotenv";
config();

export const PORT = process.env.PORT
export const JWT_SECRET_KEY = process.env.SECRET_KEY;

export const USER = process.env.USER
export const PASSWORD = process.env.PASSWORD
