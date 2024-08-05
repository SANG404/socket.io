"use client";

import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Sidebar from "../../components/sidebar";
import ChatScreen from "../../components/chatScreen";
import UserSearch from "../../components/UserSearch";
import CreateGroup from "../../components/CreateGroup";
import CreateChat from "../../components/NewChat.js"; // Import the CreateChat component
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ChatApp() {
  const [socket, setSocket] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreateChat, setShowCreateChat] = useState(false);
  const [userName, setUserName] = useState("");
  const [chats, setChats] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    }
    const userName = localStorage.getItem("user_name");
    setUserName(userName);
    const newSocket = io("http://localhost:8086", {
      query: { token },
    });
    setSocket(newSocket);

    // Authenticate the user
    newSocket.emit("authenticate", { token });

    newSocket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => newSocket.close();
  }, []);

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8086/api/chats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.message === "Invalid token") {
        window.location.href = "/login";
      } else {
        setChats(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch chats:", err);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedChat) {
        try {
          const token = localStorage.getItem("token");
          const userId = localStorage.getItem("user_id");
          const response = await axios.get(
            `http://localhost:8086/api/chats/${selectedChat._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const messages = response.data.map((message) => {
            if (message.sender._id == userId) {
              message.flagSender = true;
            }
            return message;
          });

          setMessages(messages);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    fetchMessages();
  }, [selectedChat]);

  const sendMessage = (recipientId, isGroup = false, content) => {
    if (socket) {
      const token = localStorage.getItem("token");
      socket.emit("sendMessage", {
        token,
        content,
        to: recipientId,
        isGroup,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    router.push("/");
  };

  return (
    <div className="chat-app">
      <header>
        <h1>Chat Application</h1>
        <h2>Welcome {userName}</h2>
        <div className="header-buttons">
          <button onClick={() => setShowCreateGroup(true)}>Create Group</button>
          <button onClick={() => setShowCreateChat(true)}>
            Create New Chat
          </button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <UserSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="chat-container">
        <Sidebar
          setSelectedChat={setSelectedChat}
          searchTerm={searchTerm}
          fetchChats={fetchChats}
          chats={chats}
        />
        {selectedChat && (
          <ChatScreen
            selectedChat={selectedChat}
            messages={messages}
            sendMessage={sendMessage}
            setMessages={setMessages}
          />
        )}
      </div>
      {showCreateGroup && (
        <CreateGroup
          onClose={() => setShowCreateGroup(false)}
          fetchChats={fetchChats}
        />
      )}
      {showCreateChat && (
        <CreateChat
          onClose={() => setShowCreateChat(false)}
          fetchChats={fetchChats}
        />
      )}
    </div>
  );
}
