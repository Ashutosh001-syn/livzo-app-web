import { NextResponse } from "next/server";
import { z } from "zod";

import { AuthServiceError } from "@/server/auth/service";
import { RepositoryError } from "@/server/auth/repositories/repository-error";
import type { UserRecord } from "@/server/auth/repositories/user-repository";

import type { AuthRouteResponse } from "./_route-contract";

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new AuthServiceError("Request body must be valid JSON.", "INVALID_INPUT");
  }
}

export function validationError(error: z.ZodError): NextResponse<AuthRouteResponse<null>> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !fields[field]) fields[field] = issue.message;
  }
  return response(null, { code: "VALIDATION_ERROR", message: "Check the highlighted fields.", fields }, 400);
}

export function handleError(error: unknown): NextResponse<AuthRouteResponse<null>> {
  if (error instanceof AuthServiceError) {
    const status =
      error.code === "INVALID_CREDENTIALS" || error.code === "INVALID_TOKEN"
        ? 401
        : error.code === "FORBIDDEN"
          ? 403
          : error.code === "CONFLICT"
            ? 409
            : error.code === "NOT_FOUND"
              ? 404
              : 400;
    return response(null, { code: error.code, message: error.message }, status);
  }

  if (error instanceof RepositoryError) {
    if (error.code === "CONFLICT") {
      return response(null, { code: "CONFLICT", message: "The request conflicts with an existing account." }, 409);
    }
    if (error.code === "NOT_FOUND") {
      return response(null, { code: "NOT_FOUND", message: "The requested resource was not found." }, 404);
    }
  }

  return response(null, { code: "INTERNAL_ERROR", message: "An internal error occurred." }, 500);
}

export function publicUser(user: UserRecord) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    handle: user.handle,
    role: user.role.toLowerCase(),
    emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export function response<T>(
  data: T | null,
  error: AuthRouteResponse<null>["error"],
  status = 200,
): NextResponse<AuthRouteResponse<T>> {
  return NextResponse.json({ data, error }, { status });
}

export function noContent(): NextResponse<null> {
  return new NextResponse(null, { status: 204 });
}