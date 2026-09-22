import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

/*
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
*/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// import routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import resourceRoutes from "./routes/resource.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import favoriteRoutes from "./routes/favorite.routes.js";
import downloadRoutes from "./routes/download.routes.js";
import communityRoutes from "./routes/community.routes.js";

// declare routes

// auth routes
app.use("/api/auth", authRoutes);
// user profile routes
app.use("/api/users", userRoutes);
// resource routes
app.use("/api/resources", resourceRoutes);
// category routes
app.use("/api/categories", categoryRoutes);
// favorite routes
app.use("/api/favorites", favoriteRoutes);
// community routes
app.use("/api/community", communityRoutes);
// download routes (must be after /api/community since download uses app.use("/api") with global verifyJWT)
app.use("/api", downloadRoutes);

export default app;