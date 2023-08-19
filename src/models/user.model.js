import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
      required: function () {
        return !this.googleId;
      },
    },
    description: {
      type: String,
      required: false,
      default: "",
    },
    superuser: {
      type: Boolean,
      default: false,
    },
    confirmed:{
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      default: null,
    },
    image: {
      public_id: String,
      secure_url: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
