import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

const user_signup = asyncHandler(async (req, res, next) => {
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

const user_login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const isPasswordMatch = await bcrypt.compare(password, user?.password || "");

  if (!user || !isPasswordMatch) {
    return res.status(400).json({ error: "Senha ou Email inválido." });
  }

  generateTokenAndSetCookie(user._id, res);

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
});

const user_logout = asyncHandler(async (req, res, next) => {
  res.cookie("jwt", "", { maxAge: 1 }); // Clean cookie
  res.status(200).json({ message: "Usuário encerrou sua sessão com sucesso." });
});

const user_update = asyncHandler(async (req, res, next) => {
  const { name, email, password, profilePicture, about } = req.body;
  const userId = req.user._id;

  // Find user after the auth by the middleware
  let user = await User.findById(userId);

  if (!user) {
    return res.status(400).json({ message: "Usuário não foi encontrado." });
  }

  // For the check to work we need to convert the object into a string
  if (req.params.id !== userId.toString()) {
    return res
      .status(400)
      .json({ message: "Você não pode atualizar outros usuários." });
  }

  if (password) {
    // Create password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
  }

  user.name = name || user.name;
  user.email = email || user.email;
  user.profilePicture = profilePicture || user.profilePicture;
  user.about = about || user.about;

  user = await user.save();

  res.status(200).json({ message: "Usuário atualizado com sucesso.", user });
});

const user_profile = asyncHandler(async (req, res, next) => {
  const { email } = req.params;

  const user = await User.findOne({ email })
    .select("-password")
    .select("-updatedAt")
    .select("-friends");

  if (!user) {
    return res.status(400).json({ message: "Usuário não encontrado." });
  }

  res.status(200).json(user);
});
export { user_signup, user_login, user_logout, user_profile, user_update };
