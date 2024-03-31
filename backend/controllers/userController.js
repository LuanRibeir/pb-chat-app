import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from "cloudinary";

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
      about: newUser.about,
      profilePicture: newUser.profilePicture,
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
    about: user.about,
    profilePicture: user.profilePicture,
  });
});

const user_logout = asyncHandler(async (req, res, next) => {
  res.cookie("jwt", "", { maxAge: 1 }); // Clean cookie
  res.status(200).json({ message: "Usuário encerrou sua sessão com sucesso." });
});

const user_update = asyncHandler(async (req, res, next) => {
  const { name, email, password, about } = req.body;
  let { profilePicture } = req.body;

  const userId = req.user._id;
  // Find user after the auth by the middleware
  let user = await User.findById(userId);

  if (!user) {
    return res.status(400).json({ error: "Usuário não foi encontrado." });
  }

  // For the check to work we need to convert the object into a string
  if (req.params.id !== userId.toString()) {
    return res
      .status(400)
      .json({ error: "Você não pode atualizar outros usuários." });
  }

  if (password) {
    // Create password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
  }

  // Check if email exists
  let emailExist = await User.findOne({ email });
  if (user.email !== email && emailExist) {
    return res.status(400).json({ error: "Email já registrado." });
  }

  // Cloudinary response object handler
  if (profilePicture) {
    // Get the profile picture ID from the secure URL and destroy it
    if (user.profilePicture) {
      await cloudinary.uploader.destroy(
        user.profilePicture.split("/").pop().split(".")[0]
      );
    }

    const uploadedResponse = await cloudinary.uploader.upload(profilePicture);
    profilePicture = uploadedResponse.secure_url;
  }

  user.name = name || user.name;
  user.email = email || user.email;
  user.profilePicture = profilePicture || user.profilePicture;
  user.about = about || user.about;

  user = await user.save();

  // to show null as password response
  user.password = null;

  res.status(200).json(user);
});

const user_profile = asyncHandler(async (req, res, next) => {
  const { email } = req.params;

  const user = await User.findOne({ email })
    .select("-password")
    .select("-updatedAt")
    .select("-friends");

  if (!user) {
    return res.status(400).json({ error: "Usuário não encontrado." });
  }

  res.status(200).json(user);
});

const user_addFriend = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const friendFound = await User.findById(id);
  // Find user after the auth by the middleware
  const currentUser = await User.findById(req.user._id);

  // For the check to work we need to convert the object into a string
  if (id == req.user._id.toString()) {
    return res
      .status(400)
      .json({ message: "Você não pode adicionar você mesmo" });
  }

  if (!friendFound || !currentUser) {
    return res.status(400).json({ message: "Usúario não encontrado." });
  }

  const isFriend = currentUser.friends.includes(id);
  if (isFriend) {
    // Remove friend
    // Modify currentUser friends, modify friends from friendFound
    await User.findByIdAndUpdate(req.user._id, { $pull: { friends: id } });
    await User.findByIdAndUpdate(id, { $pull: { friends: req.user._id } });
    res.status(200).json({ message: "Amigo removido com sucesso." });
  } else {
    // Add Friend
    await User.findByIdAndUpdate(req.user._id, { $push: { friends: id } });
    await User.findByIdAndUpdate(id, { $push: { friends: req.user._id } });
    res.status(200).json({ message: "Amigo adicionado com sucesso." });
  }
});

export {
  user_signup,
  user_login,
  user_logout,
  user_addFriend,
  user_profile,
  user_update,
};
