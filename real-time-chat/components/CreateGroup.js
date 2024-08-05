import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CreateGroup({ onClose, fetchChats }) {
  const [groupName, setGroupName] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const userId = localStorage.getItem("user_id");
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8086/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredUsers = response.data.filter((user) => user._id !== userId); // Filter out logged-in user
      setUsers(filteredUsers);
    };

    fetchUsers();
  }, []);

  const handleCreateGroup = async () => {
    try {
      if (!groupName.trim()) {
        setError("Group name is required.");
        return;
      }

      if (selectedUsers.length === 0) {
        setError("At least one user must be selected.");
        return;
      }

      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8086/api/group",
        {
          name: groupName,
          members: selectedUsers,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchChats();
      onClose();
    } catch (err) {
      console.error("Failed to create group:", err);
      setError("Failed to create group. Please try again.");
    }
  };

  return (
    <div className="create-group">
      <div className="popup">
        <h2>Create Group</h2>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group Name"
        />
        {error && <p className="error">{error}</p>}
        <div className="user-list">
          {users.map((user) => (
            <div key={user._id}>
              <input
                type="checkbox"
                checked={selectedUsers.includes(user._id)}
                onChange={() =>
                  setSelectedUsers((prev) =>
                    prev.includes(user._id)
                      ? prev.filter((id) => id !== user._id)
                      : [...prev, user._id]
                  )
                }
              />
              {user.username}
            </div>
          ))}
        </div>
        <button onClick={handleCreateGroup}>Create Group</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
