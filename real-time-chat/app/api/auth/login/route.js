import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  const { username, password } = await request.json();
  console.log("username", username);

  try {
    // Make a request to your backend server's login route
    const response = await axios.post("http://localhost:8086/api/auth/login", {
      username,
      password,
    });

    // Return the token received from the backend server
    return NextResponse.json({ token: response.data.token });
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json({ error: "Login failed" }, { status: 401 });
  }
}
