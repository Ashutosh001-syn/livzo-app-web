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

    const { name, cost, icon, color, bg } = await req.json();

    if (!name || typeof cost !== "number") {
      return new NextResponse("Invalid payload", { status: 400 });
    }

    const gift = await prisma.gift.create({
      data: { name, cost, icon, color, bg },
    });

    return NextResponse.json(gift);
  } catch (error) {
    console.error("Error creating gift:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
