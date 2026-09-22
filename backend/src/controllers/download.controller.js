import mongoose from "mongoose";
import { Download } from "../models/download.model.js";
import { Resource } from "../models/resource.model.js";

// Download resource
const downloadResource = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Check resource ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID",
      });
    }

    // Check resource exists
    const resource = await Resource.findById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    // Record download
    const download = await Download.create({
      user_id: userId,
      resource_id: id,
    });

    // Increase download count
    await Resource.findByIdAndUpdate(
      id,
      {
        $inc: { downloads: 1 },
      }
    );

    res.status(201).json({
      success: true,
      message: "Resource download recorded",
      data: {
        file_url: resource.file_url,
        download_id: download._id,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to download resource",
      error: error.message,
    });
  }
};

// Get user's download history
const getUserDownloads = async (req, res) => {
  try {
    const userId = req.user._id;

    const downloads = await Download.find({
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
      message: "Download history fetched successfully",
      data: downloads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch download history",
      error: error.message,
    });
  }
};

export {
  downloadResource,
  getUserDownloads,
};