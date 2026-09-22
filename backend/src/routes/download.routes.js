import { Router } from "express";

import {
  downloadResource,
  getUserDownloads,
} from "../controllers/download.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

// POST /api/resources/:id/download
router.post("/resources/:id/download", downloadResource);

// GET /api/users/downloads
router.get("/users/downloads", getUserDownloads);

export default router;