import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    user: {
      type: String,

      required: true,
    },
    category: {
      type: String,

      required: true,
    },
    community: {
      type: String,

      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
