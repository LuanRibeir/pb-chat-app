import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

const authRoute = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;

  // Check if token exists
  if (!token) return res.status(401).json({ message: "Não autorizado." });

  // Verify if token is valid
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Find the user then pass if they exist
  const user = await User.findById(decoded.userId).select("-password");
  req.user = user;

  next();
});

export default authRoute;
