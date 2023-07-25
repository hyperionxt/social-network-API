import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost/blog_db");
    console.log(">>>> db connection established");
  } catch (error) {
    console.log(error);
  }
};
