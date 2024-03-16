import express from "express";

// Require controller modules
import { user_signup, user_login } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", user_signup);
router.post("/login", user_login);

export default router;
