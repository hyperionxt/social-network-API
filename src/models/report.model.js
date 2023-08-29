import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    context: {
      type: String,
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userReported: {
      username: String,
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    elementsReported: {
      id: String,
      text: String,
      title: String,
    },
  },
  { timestamps: true },
  { versionKey: false },
  { updatedAt: false }
);

export default mongoose.model("Report", reportSchema);
