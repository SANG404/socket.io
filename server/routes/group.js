const express = require("express");
const jwt = require("jsonwebtoken");
const Group = require("../models/Groups");
const User = require("../models/Users");
const Chats = require("../models/Chats");

const router = express.Router();

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

// Create group
router.post("/", verifyToken, async (req, res) => {
  const { name, members } = req.body;
  if (!name || !members) {
    return res.status(400).json({ message: "Missing group details" });
  }
  try {
    const group = new Group({ name, members: [...members, req.user.userId] });
    await group.save();

    // Check if the recipient exists

    const existingChat = await Chats.findOne({
      recipient_group_id: group._id,
      flag_group: true,
    });

    if (!existingChat) {
      // Create a new chat document
      await Chats.create({
        recipient_group_id: group._id,
        flag_group: true,
      });
    }

    res.status(201).json({ message: "Group created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add member
router.post("/:groupId/add", verifyToken, async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;
  if (!groupId || !userId) {
    return res.status(400).json({ message: "Missing group or member details" });
  }
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    group.members.push(userId);
    await group.save();

    res.status(200).json({ message: "Member added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Remove member
router.post("/:groupId/remove", verifyToken, async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    group.members = group.members.filter(
      (member) => member.toString() !== userId
    );
    await group.save();

    res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
