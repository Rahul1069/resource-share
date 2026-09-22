import { Router } from "express";

import {
  createPost,
  getAllPosts,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
} from "../controllers/community.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public routes
router.get("/", getAllPosts);

// Protected routes
router.post(
  "/",
  verifyJWT,
  upload.single("image"),
  createPost
);

router.delete("/:id", verifyJWT, deletePost);

router.post("/:id/like", verifyJWT, toggleLike);

router.post("/:id/comments", verifyJWT, addComment);

router.delete(
  "/:id/comments/:commentId",
  verifyJWT,
  deleteComment
);

export default router;
