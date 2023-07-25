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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    community:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
