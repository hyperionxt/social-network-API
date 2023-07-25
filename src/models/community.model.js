import mongoose from "mongoose";

const communitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        red: "Category",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Community", communitySchema);
