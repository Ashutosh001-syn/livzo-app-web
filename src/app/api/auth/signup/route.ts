import { NextResponse } from "next/server";

import { AuthService } from "@/server/auth/service";
import { signupSchema } from "@/server/auth/schemas/signup-schema";

import { handleError, publicUser, readJson, validationError } from "../_route-utils";

export async function POST(request: Request) {
  try {
    const parsed = signupSchema.safeParse(await readJson(request));
    if (!parsed.success) return validationError(parsed.error);

    const result = await new AuthService().signup(parsed.data);
    return NextResponse.json(
      {
        data: {
          user: publicUser(result.user),
          requiresVerification: result.requiresVerification,
        },
        error: null,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error);
  }
}