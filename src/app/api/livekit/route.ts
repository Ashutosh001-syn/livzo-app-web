import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get("room");
  const username = req.nextUrl.searchParams.get("username");

  if (!room || !username) {
    return NextResponse.json(
      { error: 'Missing "room" or "username" parameter' },
      { status: 400 }
    );
  }

  // Define API keys directly for demo (normally these go in .env)
  const apiKey = process.env.LIVEKIT_API_KEY || "devkey";
  const apiSecret = process.env.LIVEKIT_API_SECRET || "secret";

  try {
    const at = new AccessToken(apiKey, apiSecret, {
      identity: username,
      // Optional: add metadata or user roles here
    });

    at.addGrant({
      roomJoin: true,
      room: room,
      canPublish: true,      // They can publish chat messages
      canSubscribe: true,    // They can subscribe to the video
    });

    const token = await at.toJwt();
    return NextResponse.json({ token });
  } catch (error) {
    console.error("Token generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
