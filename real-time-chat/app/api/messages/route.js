import { NextResponse } from "next/server";

export async function POST(request) {
  const { token, content, to, isGroup } = await request.json();

  // Verify token, save message to database, and handle sending to individual or group

  return NextResponse.json({ success: true });
}
