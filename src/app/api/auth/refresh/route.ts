import { AuthService } from "@/server/auth/service";
import { getRequestCookieStore } from "@/server/auth/cookies";
import { handleError, response } from "../_route-utils";

export async function POST() {
  try {
    const cookieStore = await getRequestCookieStore();
    const result = await new AuthService({ cookies: cookieStore }).refreshSession();

    return response(
      {
        user: result.user,
        expiresAt: result.expiresAt.toISOString(),
      },
      null,
    );
  } catch (error) {
    return handleError(error);
  }
}
