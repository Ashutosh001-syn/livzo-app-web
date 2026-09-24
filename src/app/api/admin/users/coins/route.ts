import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { AuthService } from "@/server/auth/service";
import { getRequestCookieStore } from "@/server/auth/cookies";

export async function POST(req: Request) {
  try {
    const authService = new AuthService({ cookies: await getRequestCookieStore() });
    const user = await authService.getCurrentUser();

    if (!user || user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { userId, coins } = await req.json();

    if (!userId || typeof coins !== "number") {
      return new NextResponse("Invalid payload", { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { coins },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating coins:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
