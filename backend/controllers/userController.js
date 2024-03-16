import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

// User Signup
export const user_signup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });

  // Check if user exists
  if (user) {
    return res.status(400).json({ error: "Usuário já registrado." });
  }

  // Create password hash
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create User
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });
  await newUser.save();

  if (newUser) {
    // Handle the cookie
    generateTokenAndSetCookie(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });
  } else {
    return res.status(400).json({ error: "Dados inválidos." });
  }
});
