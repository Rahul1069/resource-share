import mongoose from "mongoose";
import { Favorite } from "../models/favorite.model.js";
import { Resource } from "../models/resource.model.js";

// Add resource to favorites
const addFavorite = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID",
      });
    }

    const existingFavorite = await Favorite.findOne({
      user_id: userId,
      resource_id: resourceId,
    });

    if (existingFavorite) {
      return res.status(409).json({
        success: false,
        message: "Resource already added to favorites",
      });
    }

    const favorite = await Favorite.create({
      user_id: userId,
      resource_id: resourceId,
    });

    res.status(201).json({
      success: true,
      message: "Resource added to favorites",
      data: favorite,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add favorite",
      error: error.message,
    });
  }
};

// Remove resource from favorites
const removeFavorite = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID",
      });
    }

    const favorite = await Favorite.findOneAndDelete({
      user_id: userId,
      resource_id: resourceId,
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Resource removed from favorites",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove favorite",
      error: error.message,
    });
  }
};

// Get logged-in user's favorites
const getFavorites = async (req, res) => {
  try {
    const userId = req.user._id;

    const favorites = await Favorite.find({
      user_id: userId,
    })
      .populate({
        path: "resource_id",
        populate: {
          path: "category_id",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Favorites fetched successfully",
      data: favorites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch favorites",
      error: error.message,
    });
  }
};

export {
  addFavorite,
  removeFavorite,
  getFavorites,
};