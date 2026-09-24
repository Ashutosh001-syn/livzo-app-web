import { createHash } from "node:crypto";

import { AuthService } from "@/server/auth/service";
import { getRequestCookieStore } from "@/server/auth/cookies";
import { loginSchema } from "@/server/auth/schemas/login-schema";

import { handleError, readJson, response, validationError } from "../_route-utils";

export async function POST(request: Request) {
  try {
    const parsed = loginSchema.safeParse(await readJson(request));
    if (!parsed.success) return validationError(parsed.error);

    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      undefined;
    const ipHash = clientIp ? createHash("sha256").update(clientIp).digest("hex") : undefined;

    const result = await new AuthService({ cookies: await getRequestCookieStore() }).login({
      ...parsed.data,
      userAgent: request.headers.get("user-agent") ?? undefined,
      ipHash,
    });
    return response({ user: result.user, expiresAt: result.expiresAt.toISOString() }, null);
  } catch (error) {
    return handleError(error);
  }
}