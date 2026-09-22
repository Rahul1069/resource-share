import { Router } from "express";

import {
  getProfile,
  updateProfile,
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();


// GET profile
router.get(
  "/profile",
  verifyJWT,
  getProfile
);


// UPDATE profile
router.put(
  "/profile",
  verifyJWT,
  upload.single("profile_image"),
  updateProfile
);


export default router;