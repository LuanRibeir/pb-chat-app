import express from "express";
import authRoute from "../middlewares/authRoute.js";

// Require controller modules
import {
  user_signup,
  user_login,
  user_logout,
  user_update,
  user_profile,
  user_addFriend,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", user_signup);
router.post("/login", user_login);
router.post("/logout", user_logout);
router.put("/update/:id", authRoute, user_update);
router.get("/profile/:email", user_profile);
router.post("/addFriend/:id", authRoute, user_addFriend);

export default router;
