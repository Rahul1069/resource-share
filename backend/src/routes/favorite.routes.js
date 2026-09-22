import { Router } from "express";

import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../controllers/favorite.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/:resourceId", addFavorite);

router.delete("/:resourceId", removeFavorite);

router.get("/", getFavorites);

export default router;