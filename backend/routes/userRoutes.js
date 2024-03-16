import express from "express";

// Require controller modules
import {
  user_signup,
  user_login,
  user_logout,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", user_signup);
router.post("/login", user_login);
router.post("/logout", user_logout);

export default router;
