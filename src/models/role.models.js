import { mongoose } from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
  },

  { versionKey: false }
);

export default mongoose.model("Role", roleSchema);
