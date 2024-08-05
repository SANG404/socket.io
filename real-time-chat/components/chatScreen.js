import React, { useState, useEffect } from "react";

export default function ChatScreen({
  selectedChat,
  messages,
  sendMessage,
  setMessages,
}) {
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // This code runs only on the client side
    const storedUserId = localStorage.getItem("user_id");
    setUserId(storedUserId);
  }, []);

  const handleSendMessage = () => {
    if (message.trim() === "") return; // Prevent sending empty messages

    const username = localStorage.getItem("user_name");
    const userId = localStorage.getItem("user_id");

    const recipientUser =
      userId == selectedChat.users[0]?._id
        ? selectedChat.users[1]?._id
        : selectedChat.users[0]?._id;

    const recipientId = selectedChat.flag_group
      ? selectedChat.recipient_group_id?._id
      : recipientUser;

    sendMessage(recipientId, selectedChat.flag_group, message);
    setMessage("");
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: { _id: recipientId, username },
        chat_id: { _id: selectedChat._id },
        content: message,
        groupId: "",
        flagSender: true,
      },
    ]);
  };
  console.log("selectedChat", selectedChat._id);
  console.log("messages", messages);

  // Filter messages based on whether the chat is individual or group
  const filteredMessages = messages.filter((msg) => {
    if (selectedChat.flag_group) {
      return msg.chat_id._id === selectedChat._id;
    } else {
      return selectedChat.users.some((user) => user._id === userId);
    }
  });

  //console.log("filteredMessages", filteredMessages);

  return (
    <div className="chat-screen">
      <div className="messages">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg, index) => (
            <div key={index}>
              <div className="sender-username">{msg.sender.username}</div>
              <div
                key={index}
                className={`message ${msg.flagSender ? "sent" : ""}`}
              >
                {msg.content}
              </div>
            </div>
          ))
        ) : (
          <div className="no-messages">No messages yet</div>
        )}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}
