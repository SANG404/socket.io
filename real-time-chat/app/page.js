"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8086/api/auth/login",
        {
          username,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user_id", response.data.user._id);
      localStorage.setItem("user_name", response.data.user.username);
      router.push("/chat");
    } catch (error) {
      console.error("Login error", error);
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <div className="login-button">
            <button type="submit">Login</button>
            <button type="submit" onClick={() => router.push("/register")}>
              Register
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
