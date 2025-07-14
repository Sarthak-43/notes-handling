// models/Chat.js
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  author :{type:mongoose.Schema.Types.ObjectId,ref:"User"},
  sender: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Chat", chatSchema);
