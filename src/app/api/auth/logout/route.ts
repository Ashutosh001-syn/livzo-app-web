import { getRequestCookieStore } from "@/server/auth/cookies";
import { AuthService } from "@/server/auth/service";

import { handleError, noContent } from "../_route-utils";

export async function POST() {
  try {
    await new AuthService({ cookies: await getRequestCookieStore() }).logout();
    return noContent();
  } catch (error) {
    return handleError(error);
  }
}