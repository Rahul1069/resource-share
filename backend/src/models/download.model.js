import mongoose from "mongoose";

const downloadSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resource_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Download = mongoose.model("Download", downloadSchema);
