import { z } from "zod";

import { AuthService } from "@/server/auth/service";
import { emailField } from "@/server/auth/schemas/fields";
import { handleError, readJson, response, validationError } from "../_route-utils";

const resendVerificationSchema = z
  .object({
    email: emailField,
  })
  .strict();

export async function POST(request: Request) {
  try {
    const parsed = resendVerificationSchema.safeParse(await readJson(request));
    if (!parsed.success) return validationError(parsed.error);

    const result = await new AuthService().resendVerification(parsed.data.email);
    return response(result, null);
  } catch (error) {
    return handleError(error);
  }
}
