import { Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

import {
  downloadResource,
  getUserDownloads,
} from "../controllers/download.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

const optionalVerifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (token) {
      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
      );
      const user = await User.findById(decodedToken._id).select(
        "-password -refreshToken"
      );
      if (user) {
        req.user = user;
      }
    }
  } catch {
    // Continue as guest
  }
  next();
};

// POST /api/resources/:id/download (public or authenticated)
router.post("/resources/:id/download", optionalVerifyJWT, downloadResource);

// GET /api/users/downloads (protected)
router.get("/users/downloads", verifyJWT, getUserDownloads);

export default router;