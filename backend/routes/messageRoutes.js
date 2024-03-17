import express from "express";
import authRoute from "../middlewares/authRoute.js";

// Require controller modules
import { message_send } from "../controllers/messageController.js";

const router = express.Router();

router.post("/", authRoute, message_send);

export default router;
