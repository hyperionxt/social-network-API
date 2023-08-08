import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
