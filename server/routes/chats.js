const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const Chats = require("../models/Chats");
const Groups = require("../models/Groups");
const Messages = require("../models/Messages");

// Middleware to verify token
const verifyToken = (req, res, next) => {
  if (req.header("Authorization")) {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Access denied" });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid token" });
    }
  } else {
    res.status(401).json({ message: "Access denied" });
  }
};

// Get chats for the authenticated user
router.get("/", verifyToken, async (req, res) => {
  try {
    if (!req.user.userId) {
      return res.status(400).send("Missing user details");
    }

    const userId = req.user.userId;

    // Fetch individual chats
    const chats = await Chats.find({
      users: { $all: [userId] },
      flag_group: false,
    })
      .populate({
        path: "users",
        select: "-password",
      })
      .populate({
        path: "recipient_group_id",
      });

    // Fetch group chats
    const groupChats = await Chats.find({
      flag_group: true,
    }).populate({
      path: "recipient_group_id",
    });

    // Combine individual and group chats

    // Remove the current user from the list of users in each chat
    // const filteredChats = chats.map((chat) => {
    //   // Filter out the current user from the users array
    //   chat.users = chat.users.filter((user) => user._id.toString() !== userId);
    //   return chat;
    // });

    const allChats = [...chats, ...groupChats];

    res.send(allChats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).send(error.message);
  }
});

// Post route to create a new chat
router.post("/", verifyToken, async (req, res) => {
  try {
    const { recipient_id, isGroup } = req.body; // Assuming you pass recipientId and isGroup in the request body

    const flagGroup = isGroup ?? false;

    if (!req.user.userId) {
      return res.status(500).send("Missing user details");
    }

    const userId = req.user.userId;

    let chat;

    const user = await User.findById(recipient_id);
    if (!user) return res.status(404).send("User not found");

    const existingChat = await Chats.findOne({
      users: { $all: [recipient_id, userId] },
      flag_group: false,
    });

    chat = existingChat;

    if (!existingChat) {
      // Create a new chat document
      const newchat = await Chats.create({
        users: [userId, recipient_id],
      });

      chat = newchat;
    }

    res.status(201).send(chat);
  } catch (error) {
    console.log(error);

    res.status(500).send(error);
  }
});

router.get("/:chat_id", verifyToken, async (req, res) => {
  const { chat_id } = req.params;
  if (!chat_id) {
    return res.status(404).json({ message: "Invalid chat id" });
  }

  try {
    const chat = await Messages.find({ chat_id })
      .populate("chat_id")
      .populate("sender")
      .sort({ createdAt: 1 });

    if (!chat) {
      return res.status(404).json({ message: "No results" });
    }
    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
