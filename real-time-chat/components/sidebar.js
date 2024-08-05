"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Sidebar({
  setSelectedChat,
  searchTerm,
  fetchChats,
  chats,
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchChats();
    setLoading(false);
    const storedUserId = localStorage.getItem("user_id");
    setUserId(storedUserId);
  }, []);

  const filteredChats = chats.filter((chat) => {
    const name = chat.flag_group
      ? chat.recipient_group_id?.name
      : userId == chat.users[0]?._id
      ? chat.users[0]?.username
      : chat.users[1]?.username;

    return name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="sidebar">
      {loading && <p>Loading chats...</p>}
      {error && <p>{error}</p>}
      {filteredChats.map((chat) => (
        <div
          key={chat._id}
          className="chat"
          onClick={() => setSelectedChat(chat)}
        >
          {chat.flag_group
            ? chat.recipient_group_id?.name
            : chat.users[0]?._id == userId
            ? chat.users[1]?.username
            : chat.users[0]?.username}
        </div>
      ))}
    </div>
  );
}
