import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Cloudinary API
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middlewares
app.use(express.json()); // To parse JSON data in the request body
app.use(express.urlencoded({ extended: true })); // To parse form data in the request body
app.use(cookieParser()); // To get cookie in the request and set in the response

// Routes
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, () =>
  console.log(`Server started at http//localhost:${PORT}`)
);
