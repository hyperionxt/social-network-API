import mongoose from "mongoose";
import { MONGODB_URI } from "../config.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(">>>> MongoDb Atlas connection established (4/4)");
  } catch (error) {
    console.log(error);
  }
};
