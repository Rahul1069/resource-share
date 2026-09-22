import { Resource } from "../models/resource.model.js";
import { Category } from "../models/category.model.js";
import { User } from "../models/user.model.js";
import { uploadOnImageKit } from "../utils/imagekit.js";


// =====================================================
// CREATE RESOURCE
// POST /api/resources
// =====================================================

const createResource = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const { title, description, category } = req.body;

    // Get uploaded files
    const resourceFile = req.files?.file?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    // Validate text fields
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, description and category are required",
      });
    }

    // Validate resource file
    if (!resourceFile) {
      return res.status(400).json({
        success: false,
        message: "Resource file is required",
      });
    }

    // Check category
    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Upload resource file
    const resourceUpload = await uploadOnImageKit(
      resourceFile.path
    );

    if (!resourceUpload) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload resource file",
      });
    }

    // Upload thumbnail
    let thumbnailUrl = "";

    if (thumbnailFile) {
      const thumbnailUpload = await uploadOnImageKit(
        thumbnailFile.path
      );

      if (thumbnailUpload) {
        thumbnailUrl = thumbnailUpload.url;
      }
    }

    // Create resource
    const resource = await Resource.create({
      title: title.trim(),
      description: description.trim(),

      file_url: resourceUpload.url,

      thumbnail_url: thumbnailUrl,

      category_id: category,

      user_id: req.user._id,

      downloads: 0,
    });

    return res.status(201).json({
      success: true,
      message: "Resource uploaded successfully",
      resource,
    });

  } catch (error) {
    console.error("Create Resource Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload resource",
      error: error.message,
    });
  }
};


// =====================================================
// GET ALL RESOURCES
// GET /api/resources
// =====================================================

const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find()
      .populate("category_id", "name description")
      .populate("user_id", "name email profile_image")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      resources,
    });

  } catch (error) {
    console.error("Get Resources Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resources",
      error: error.message,
    });
  }
};


// =====================================================
// GET RESOURCE BY ID
// GET /api/resources/:id
// =====================================================

const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate("category_id", "name description")
      .populate("user_id", "name email profile_image");

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    return res.status(200).json({
      success: true,
      resource,
    });

  } catch (error) {
    console.error("Get Resource Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resource",
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE RESOURCE
// PUT /api/resources/:id
// =====================================================

const updateResource = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const resourceFile = req.files?.file?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    // Check owner
    if (resource.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this resource",
      });
    }

    // Update category if provided
    if (category) {
      const categoryExists = await Category.findById(category);

      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      resource.category_id = category;
    }

    // Update title
    if (title) {
      resource.title = title.trim();
    }

    // Update description
    if (description) {
      resource.description = description.trim();
    }

    // Replace resource file if new file uploaded
    if (resourceFile) {
      const resourceUpload = await uploadOnImageKit(
        resourceFile.path
      );

      if (!resourceUpload) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload new resource file",
        });
      }

      resource.file_url = resourceUpload.url;
    }

    // Replace thumbnail if uploaded
    if (thumbnailFile) {
      const thumbnailUpload = await uploadOnImageKit(
        thumbnailFile.path
      );

      if (thumbnailUpload) {
        resource.thumbnail_url = thumbnailUpload.url;
      }
    }

    await resource.save();

    return res.status(200).json({
      success: true,
      message: "Resource updated successfully",
      resource,
    });

  } catch (error) {
    console.error("Update Resource Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update resource",
      error: error.message,
    });
  }
};


// =====================================================
// DELETE RESOURCE
// DELETE /api/resources/:id
// =====================================================

const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    // Check owner
    if (resource.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this resource",
      });
    }

    await Resource.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Resource deleted successfully",
    });

  } catch (error) {
    console.error("Delete Resource Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete resource",
      error: error.message,
    });
  }
};


// =====================================================
// SEARCH RESOURCES
// GET /api/resources/search?q=javascript
// =====================================================

const searchResources = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Find users whose name matches the query
    const matchingUsers = await User.find({
      name: { $regex: q, $options: "i" },
    }).select("_id");

    const matchingUserIds = matchingUsers.map((u) => u._id);

    const resources = await Resource.find({
      $or: [
        {
          title: {
            $regex: q,
            $options: "i",
          },
        },
        {
          description: {
            $regex: q,
            $options: "i",
          },
        },
        {
          user_id: { $in: matchingUserIds },
        },
      ],
    })
      .populate("category_id", "name description")
      .populate("user_id", "name email profile_image")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      resources,
    });

  } catch (error) {
    console.error("Search Resource Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to search resources",
      error: error.message,
    });
  }
};


export {
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource,
  searchResources,
};