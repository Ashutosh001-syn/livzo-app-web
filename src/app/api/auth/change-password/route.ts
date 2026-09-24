import { z } from "zod";

import { AuthService } from "@/server/auth/service";
import { getRequestCookieStore } from "@/server/auth/cookies";
import { passwordField } from "@/server/auth/schemas/fields";
import { handleError, noContent, readJson, response, validationError } from "../_route-utils";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: passwordField,
  })
  .strict();

export async function POST(request: Request) {
  try {
    const cookieStore = await getRequestCookieStore();
    const authService = new AuthService({ cookies: cookieStore });
    const user = await authService.getCurrentUser();

    if (!user) {
      return response(null, { code: "UNAUTHORIZED", message: "Sign in required." }, 401);
    }

    const parsed = changePasswordSchema.safeParse(await readJson(request));
    if (!parsed.success) return validationError(parsed.error);

    await authService.changePassword(user.id, parsed.data.currentPassword, parsed.data.newPassword);
    return noContent();
  } catch (error) {
    return handleError(error);
  }
}
