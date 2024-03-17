import express from "express";
import authRoute from "../middlewares/authRoute.js";

// Require controller modules
import {
  message_send,
  message_getMessages,
  message_getConversation,
} from "../controllers/messageController.js";

const router = express.Router();

// Get all the conversation from a user
router.get("/conversations", authRoute, message_getConversation);
// Get all messages from two users
router.get("/:receiverId", authRoute, message_getMessages);
// Send message
router.post("/", authRoute, message_send);

export default router;
