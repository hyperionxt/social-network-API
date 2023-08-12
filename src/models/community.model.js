import mongoose from "mongoose";

const communitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    edited: {
      type: Boolean,
      default: false,
    },
    image: {
      public_id: String,
      secure_url: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Community", communitySchema);
