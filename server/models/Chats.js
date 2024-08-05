const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    flag_group: { type: Boolean, default: false },
    recipient_group_id: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chats", chatSchema);
