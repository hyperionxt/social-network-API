import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: false,
      unique: true,
      trim: true, //no spaces.
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
    googleId: {
      type: String,
      default: "",
      unique:true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
