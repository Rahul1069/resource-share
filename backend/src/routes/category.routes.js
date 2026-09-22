import { Router } from "express";

import {
  createCategory,
  updateCategory,
  getAllCategories,
  getCategoryById,
  getResourcesByCategory,
} from "../controllers/category.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


// Public routes
router.get("/", getAllCategories);

router.get("/:id/resources", getResourcesByCategory);

router.get("/:id", getCategoryById);


// Protected routes
router.post("/", verifyJWT, createCategory);

router.put("/:id", verifyJWT, updateCategory);


export default router;