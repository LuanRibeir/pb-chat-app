import express from "express";
import authRoute from "../middlewares/authRoute.js";

// Require controller modules
import {
  user_signup,
  user_login,
  user_logout,
  user_update,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", user_signup);
router.post("/login", user_login);
router.post("/logout", user_logout);
router.post("/update/:id", authRoute, user_update);

export default router;
