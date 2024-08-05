import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CreateChat({ onClose, fetchChats }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("user_id");
      const response = await axios.get("http://localhost:8086/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredUsers = response.data.filter((user) => user._id !== userId); // Filter out logged-in user
      setUsers(filteredUsers);
    };

    fetchUsers();
  }, []);

  const handleCreateChat = async () => {
    const token = localStorage.getItem("token");
    await axios.post(
      "http://localhost:8086/api/chats",
      {
        recipient_id: selectedUser,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchChats();
    onClose();
  };

  return (
    <div className="create-chat">
      <div className="popup">
        <h2>Create New Chat</h2>
        <div className="user-list">
          {users.map((user) => (
            <div key={user._id}>
              <input
                type="radio"
                name="chatUser"
                value={user._id}
                checked={selectedUser === user._id}
                onChange={() => setSelectedUser(user._id)}
              />
              {user.username}
            </div>
          ))}
        </div>
        <button onClick={handleCreateChat}>Create Chat</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
