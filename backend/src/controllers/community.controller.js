import mongoose from "mongoose";
import { Post } from "../models/community.model.js";
import { uploadOnImageKit } from "../utils/imagekit.js";


// =====================================================
// CREATE POST
// POST /api/community
// =====================================================

const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post content is required",
      });
    }

    let imageUrl = "";

    // Upload image if provided
    if (req.file) {
      const imageUpload = await uploadOnImageKit(
        req.file.path
      );

      if (imageUpload) {
        imageUrl = imageUpload.url;
      }
    }

    const post = await Post.create({
      content: content.trim(),
      image_url: imageUrl,
      user_id: req.user._id,
    });

    const populatedPost = await Post.findById(post._id)
      .populate("user_id", "name profile_image")
      .populate("comments.user_id", "name profile_image");

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: populatedPost,
    });

  } catch (error) {
    console.error("Create Post Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create post",
      error: error.message,
    });
  }
};


// =====================================================
// GET ALL POSTS
// GET /api/community
// =====================================================

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user_id", "name profile_image")
      .populate("comments.user_id", "name profile_image")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: posts,
    });

  } catch (error) {
    console.error("Get Posts Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
};


// =====================================================
// DELETE POST
// DELETE /api/community/:id
// =====================================================

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check owner
    if (post.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post",
      });
    }

    await Post.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });

  } catch (error) {
    console.error("Delete Post Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete post",
      error: error.message,
    });
  }
};


// =====================================================
// TOGGLE LIKE
// POST /api/community/:id/like
// =====================================================

const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const likeIndex = post.likes.findIndex(
      (likeUserId) => likeUserId.toString() === userId.toString()
    );

    let liked;

    if (likeIndex === -1) {
      // Add like
      post.likes.push(userId);
      liked = true;
    } else {
      // Remove like
      post.likes.splice(likeIndex, 1);
      liked = false;
    }

    await post.save();

    return res.status(200).json({
      success: true,
      message: liked ? "Post liked" : "Post unliked",
      data: {
        liked,
        likesCount: post.likes.length,
      },
    });

  } catch (error) {
    console.error("Toggle Like Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to toggle like",
      error: error.message,
    });
  }
};


// =====================================================
// ADD COMMENT
// POST /api/community/:id/comments
// =====================================================

const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.comments.push({
      user_id: req.user._id,
      text: text.trim(),
    });

    await post.save();

    const updatedPost = await Post.findById(id)
      .populate("user_id", "name profile_image")
      .populate("comments.user_id", "name profile_image");

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: updatedPost,
    });

  } catch (error) {
    console.error("Add Comment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add comment",
      error: error.message,
    });
  }
};


// =====================================================
// DELETE COMMENT
// DELETE /api/community/:id/comments/:commentId
// =====================================================

const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(commentId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check if user is the comment author or post author
    if (
      comment.user_id.toString() !== req.user._id.toString() &&
      post.user_id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this comment",
      });
    }

    post.comments.pull({ _id: commentId });

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });

  } catch (error) {
    console.error("Delete Comment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete comment",
      error: error.message,
    });
  }
};


export {
  createPost,
  getAllPosts,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
};
