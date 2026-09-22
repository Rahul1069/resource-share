import { Router } from "express";

import {
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource,
  searchResources,
} from "../controllers/resource.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public routes
router.get("/", getAllResources);

router.get("/search", searchResources);

router.get("/:id", getResourceById);

// Protected routes
router.post(
  "/",
  verifyJWT,
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  createResource
);

router.put(
  "/:id",
  verifyJWT,
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  updateResource
);

router.delete("/:id", verifyJWT, deleteResource);

export default router;