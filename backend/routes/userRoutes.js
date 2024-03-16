import express from "express";

// Require controller modules
import { user_signup } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", user_signup);

export default router;
