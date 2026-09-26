import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getRequestCookieStore } from "@/server/auth/cookies";
import { AuthService } from "@/server/auth/service";

const prisma = new PrismaClient();

// GET all active streams
export async function GET() {
  try {
    const streams = await prisma.stream.findMany({
      where: { isLive: true },
      include: {
        user: {
          select: {
            id: true,
            handle: true,
            displayName: true,
          }
        }
      },
      orderBy: { viewerCount: "desc" },
    });

    // Map to the LiveStream format expected by frontend
    const mappedStreams = streams.map(s => ({
      id: s.id,
      slug: s.id, // using id as slug for now
      title: s.title,
      category: s.category,
      viewerCount: s.viewerCount,
      isLive: s.isLive,
      hostId: s.user.handle, // For the reel view
      tags: [],
      creator: {
        id: s.user.id,
        handle: s.user.handle,
        displayName: s.user.displayName,
      }
    }));

    return NextResponse.json({ streams: mappedStreams });
  } catch (error) {
    console.error("Failed to fetch streams:", error);
    return NextResponse.json({ error: "Failed to fetch streams" }, { status: 500 });
  }
}

// POST to create or update a stream to be LIVE
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await getRequestCookieStore();
    const authService = new AuthService({ cookies: cookieStore });
    const user = await authService.getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, category, isLive } = body;

    // Find if user already has an active stream
    let stream = await prisma.stream.findFirst({
      where: { userId: user.id },
    });

    if (stream) {
      // Update existing stream
      stream = await prisma.stream.update({
        where: { id: stream.id },
        data: {
          title: title || stream.title,
          category: category || stream.category,
          isLive: isLive !== undefined ? isLive : true,
          startedAt: isLive ? new Date() : stream.startedAt,
          endedAt: !isLive ? new Date() : null,
        }
      });
    } else {
      // Create new stream
      stream = await prisma.stream.create({
        data: {
          userId: user.id,
          title: title || `${user.displayName}'s Live Stream`,
          category: category || "creative",
          isLive: isLive !== undefined ? isLive : true,
          startedAt: new Date(),
        }
      });
    }

    return NextResponse.json({ stream });
  } catch (error) {
    console.error("Failed to update stream:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
