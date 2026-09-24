import { z } from "zod";

import { getRequestCookieStore } from "@/server/auth/cookies";
import { AuthService } from "@/server/auth/service";
import { UserRepository } from "@/server/auth/repositories/user-repository";
import { handleError, publicUser, readJson, response, validationError } from "../_route-utils";

const updateProfileSchema = z
  .object({
    displayName: z.string().trim().min(1, "Display name cannot be empty.").max(80, "Display name too long.").optional(),
    handle: z.string().trim().toLowerCase().regex(/^[a-z0-9_]{3,30}$/, "Handle must be 3-30 letters, numbers, or underscores.").optional(),
  })
  .strict();

export async function GET() {
  try {
    const cookieStore = await getRequestCookieStore();
    const authService = new AuthService({ cookies: cookieStore });
    
    // Skip the getCurrentUser abstraction and fetch directly from DB to avoid double-querying
    const accessToken = cookieStore.get("livzo.access");
    if (!accessToken) return response(null, null, 200);
    
    let userId;
    try {
      const claims = authService.verifyAccessToken(accessToken);
      userId = claims.sub;
    } catch {
      // Fallback if access token is invalid, authService will handle refresh
      const user = await authService.getCurrentUser();
      if (!user) return response(null, null, 200);
      userId = user.id;
    }

    const userRepository = new UserRepository();
    const fullUser = await userRepository.findById(userId);
    if (!fullUser || fullUser.disabledAt) {
      return response(null, null, 200);
    }

    return response({ user: publicUser(fullUser) }, null);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await getRequestCookieStore();
    const authService = new AuthService({ cookies: cookieStore });
    const authUser = await authService.getCurrentUser();

    if (!authUser) {
      return response(null, { code: "UNAUTHORIZED", message: "Sign in required." }, 401);
    }

    const parsed = updateProfileSchema.safeParse(await readJson(request));
    if (!parsed.success) return validationError(parsed.error);

    const userRepository = new UserRepository();
    const updated = await userRepository.updateProfile(authUser.id, parsed.data);

    return response({ user: publicUser(updated) }, null);
  } catch (error) {
    return handleError(error);
  }
}
