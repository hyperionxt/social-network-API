import mongoose from "mongoose";

const suscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Suscription", suscriptionSchema);
