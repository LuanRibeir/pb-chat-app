import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.SchemaTypes.ObjectId, ref: "User" }],
    lastMessage: {
      text: String,
      sender: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
