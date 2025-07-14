import express from "express";
import Chat from "../models/chat.js";
import User from "../models/user.js";
export const postMessage = async (req, res) => {
   try {
    const { sender, text, timestamp, userId } = req.body;

    if (!sender || !text || !userId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const saved = await Chat.create({
      text,
      sender,
      timestamp,
      author: userId,
    });

    const populated = await saved.populate("author", "UserName");
    res.status(201).json({ message: "Message saved", saved: populated });
  } catch (error) {
    res.status(500).json({ message: "Failed to save message", error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Chat.find().populate("author","UserName").sort({ timestamp: 1 }); // sort by oldest first
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load messages",
      error: error.message
    });
  }
};

