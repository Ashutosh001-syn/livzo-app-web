import { AuthService } from "@/server/auth/service";
import { forgotPasswordSchema } from "@/server/auth/schemas/forgot-password-schema";

import { handleError, readJson, response, validationError } from "../_route-utils";

export async function POST(request: Request) {
  try {
    const parsed = forgotPasswordSchema.safeParse(await readJson(request));
    if (!parsed.success) return validationError(parsed.error);

    await new AuthService().forgotPassword(parsed.data.email);
    return response({ accepted: true }, null);
  } catch (error) {
    return handleError(error);
  }
}