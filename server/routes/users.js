const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/Users");

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
    if (!req?.user?.userId) {
      res.status(401).send("Missing user details");
    }

    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
