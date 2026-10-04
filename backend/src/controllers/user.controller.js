import { User } from "../models/user.model.js";
import { uploadOnImageKit } from "../utils/imagekit.js";
import fs from "fs";

// GET /api/users/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};


// PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update name
    if (name) {
      user.name = name.trim();
    }

    // Update email
    if (email) {
      const existingUser = await User.findOne({
        email: email.toLowerCase().trim(),
        _id: { $ne: req.user._id },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already in use",
        });
      }

      user.email = email.toLowerCase().trim();
    }

    // Remove profile image if requested
    if (
      req.body.remove_image === "true" ||
      req.body.removeImage === "true" ||
      req.body.remove_image === true ||
      req.body.removeImage === true
    ) {
      user.profile_image = "";
    }

    // Update profile image
    if (req.file) {
      const cloudinaryResponse = await uploadOnImageKit(
        req.file.path
      );

      if (!cloudinaryResponse) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload profile image",
        });
      }

      user.profile_image = cloudinaryResponse.url;

      // Delete temporary file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// GET /api/users/:id - Public user profile with resources
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Also get resources uploaded by this user
    const { Resource } = await import("../models/resource.model.js");
    const resources = await Resource.find({ user_id: id })
      .populate("category_id", "name description")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      user,
      resources,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
      error: error.message,
    });
  }
};

export {
  getProfile,
  updateProfile,
  getUserById,
};