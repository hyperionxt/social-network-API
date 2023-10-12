import mongoose from "mongoose";
import { MONGODB_URI } from "../config";

export const connectDB = async () => {
  try {
    if (!MONGODB_URI) throw new Error("MONGODB_URI is undefined");

    const db = await mongoose.connect(MONGODB_URI);
    console.log(
      `>>>> Connection established to ${db.connection.db.databaseName} database on MongoDb Atlas (4/4)`
    );
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
  }
};
