const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const Message = require("./models/Messages"); // assuming you have a Message model
const Group = require("./models/Groups"); // assuming you have a Group model
const Chats = require("./models/Chats");
const User = require("./models/Users");
const authRoutes = require("./routes/auth");
const groupRoutes = require("./routes/group");
const chatRoutes = require("./routes/chats");
const userRoutes = require("./routes/users");

dotenv.config(); // Load environment variables from .env file

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust this as necessary
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

app.use(
  cors({
    origin: "*", // Change this to your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/users", userRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const connectedUsers = {}; // To track connected users by user ID

// Middleware to verify token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return false;
  }
};

io.on("connection", (socket) => {
  console.log("New client connected");

  // Handle user connection
  socket.on("authenticate", ({ token }) => {
    try {
      const decoded = verifyToken(token);

      if (decoded != false) {
        const userId = decoded.userId;
        connectedUsers[userId] = socket.id;

        socket.userId = userId;
        console.log(`User ${userId} connected`);
        socket.emit("authenticated", { token });
      } else {
        socket.disconnect();
      }
    } catch (error) {
      console.error("Authentication error:", error);
      socket.disconnect();
    }
  });

  // Handle sendMessage event
  socket.on("sendMessage", async ({ token, content, to, isGroup }) => {
    try {
      const decoded = verifyToken(token);
      const senderId = decoded.userId;
      const sender = await User.findById(senderId);

      if (isGroup) {
        // Sending to a group
        const group = await Group.findById(to);
        if (!group) throw new Error("Group not found");

        const existingChat = await Chats.findOne({
          recipient_group_id: to,
          flag_group: true,
        });

        let chat_id;
        if (existingChat) chat_id = existingChat._id;

        const message = new Message({
          sender,
          content,
          recipient: to,
          chat_id,
        });
        await message.save();

        // Emit message to all group members
        group.members.forEach((memberId) => {
          const memberSocketId = connectedUsers[memberId];
          if (memberSocketId && memberId.toString() !== senderId) {
            io.to(memberSocketId).emit("receiveMessage", {
              sender: senderId,
              content,
              groupId: to,
              chat_id: { _id: chat_id },
            });
          }
        });
      } else {
        // Sending to an individual user
        const recipientSocketId = connectedUsers[to];

        let chat_id;

        const existingChat = await Chats.findOne({
          users: { $all: [senderId, to] },
          flag_group: false,
        });

        if (!existingChat) {
          const chat = await Chats.create({
            user_id: senderId,
            recipient_id: to,
          });

          chat_id = chat._id;
        } else {
          chat_id = existingChat._id;
        }

        const message = new Message({
          chat_id,
          content,
          sender: senderId,
        });
        await message.save();

        if (recipientSocketId) {
          io.to(recipientSocketId).emit("receiveMessage", {
            sender,
            content,
            recipient: to,
            chat_id: { _id: chat_id },
          });
        }
      }

      // Optionally, send a confirmation back to the sender
      socket.emit("messageSent", { success: true });
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("messageSent", {
        success: false,
        error: "Failed to send message",
      });
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    if (socket.userId) {
      delete connectedUsers[socket.userId];
      console.log(`User ${socket.userId} disconnected`);
    }
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = { app, io };
