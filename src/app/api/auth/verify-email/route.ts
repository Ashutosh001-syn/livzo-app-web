import { AuthService } from "@/server/auth/service";
import { verifyEmailSchema } from "@/server/auth/schemas/verify-email-schema";

import { handleError, publicUser, readJson, response, validationError } from "../_route-utils";

export async function POST(request: Request) {
  try {
    const parsed = verifyEmailSchema.safeParse(await readJson(request));
    if (!parsed.success) return validationError(parsed.error);

    const user = await new AuthService().verifyEmail(parsed.data.token);
    return response({ user: publicUser(user) }, null);
  } catch (error) {
    return handleError(error);
  }
}