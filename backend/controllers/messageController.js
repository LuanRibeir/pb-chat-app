import asyncHandler from "express-async-handler";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";

const message_send = asyncHandler(async (req, res, next) => {
  // get the recipientId and message comming from the client
  const { recipientId, message } = req.body;
  // get the sender id
  const senderId = req.user._id;

  // Find a conversation between the sender and recipient
  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, recipientId] },
  });

  // Create a conversation if not exist
  if (!conversation) {
    conversation = new Conversation({
      participants: [senderId, recipientId],
      lastMessage: { text: message, sender: senderId },
    });
    await conversation.save();
  }

  // Create new message
  const newMessage = new Message({
    conversationId: conversation._id,
    sender: senderId,
    text: message,
  });

  // Save the new message and update the conversation
  await Promise.all([
    newMessage.save(),
    conversation.updateOne({
      lastMessage: {
        text: message,
        sender: senderId,
      },
    }),
  ]);

  res.status(201).json({ newMessage });
});

const message_getMessages = asyncHandler(async (req, res, next) => {
  const { receiverId } = req.params;
  const userId = req.user._id;

  // Get the conversations between the two parties
  const conversation = await Conversation.findOne({
    participants: { $all: [userId, receiverId] },
  });

  if (!conversation) {
    return res.status(404).json({ error: "Conversa não existe." });
  }

  // Get all the messages in the conversation
  const message = await Message.find({ conversationId: conversation._id }).sort(
    { createdAt: 1 }
  );

  res.status(200).json(message);
});
