import { AuthService } from "@/server/auth/service";
import { resetPasswordSchema } from "@/server/auth/schemas/reset-password-schema";
import { getRequestCookieStore } from "@/server/auth/cookies";

import { handleError, noContent, readJson, validationError } from "../_route-utils";

export async function POST(request: Request) {
  try {
    const parsed = resetPasswordSchema.safeParse(await readJson(request));
    if (!parsed.success) return validationError(parsed.error);

    await new AuthService({ cookies: await getRequestCookieStore() }).resetPassword(
      parsed.data.token,
      parsed.data.password,
    );
    return noContent();
  } catch (error) {
    return handleError(error);
  }
}