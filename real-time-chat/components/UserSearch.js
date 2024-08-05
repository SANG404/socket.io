import React from "react";

export default function UserSearch({ searchTerm, setSearchTerm }) {
  return (
    <div className="user-search">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users..."
      />
    </div>
  );
}
