import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
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

favoriteSchema.index(
  { user_id: 1, resource_id: 1 },
  { unique: true }
);

export const Favorite = mongoose.model("Favorite", favoriteSchema);
