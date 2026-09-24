import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { authConfig } from "@/server/auth/config";
import { verifyJwtEdge } from "@/server/auth/token-verifier";
import type { AccessClaims } from "@/server/auth/service";

const protectedPaths = ["/studio", "/profile"];
const authOnlyPaths = ["/login", "/signup", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Direct any dashboard access back to the consumer/creator website homepage
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const accessCookie = request.cookies.get(authConfig.cookies.access)?.value;
  const hasRefreshCookie = request.cookies.has(authConfig.cookies.refresh);

  let isAuthenticated = false;

  const jwtSecret = process.env.AUTH_JWT_SECRET || "replace-with-a-long-random-secret";

  if (accessCookie) {
    const claims = await verifyJwtEdge<AccessClaims>(accessCookie, jwtSecret);
    if (claims && claims.type === "access") {
      isAuthenticated = true;
    }
  }

  // If access cookie expired but refresh token cookie exists, allow request through
  // so the client or route handler can trigger token refresh
  if (!isAuthenticated && hasRefreshCookie) {
    isAuthenticated = true;
  }

  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const isAuthOnly = authOnlyPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (isAuthOnly && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/studio/:path*",
    "/profile/:path*",
    "/login",
    "/signup",
    "/register",
  ],
};
