import { cookies } from "next/headers";

export interface AuthCookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "strict" | "lax" | "none";
  path: string;
  maxAge: number;
}

export interface CookieStore {
  get(name: string): string | undefined;
  set(name: string, value: string, options: AuthCookieOptions): void;
  delete(name: string): void;
}

export async function getRequestCookieStore(): Promise<CookieStore> {
  const requestCookies = await cookies();

  return {
    get(name) {
      return requestCookies.get(name)?.value;
    },
    set(name, value, options) {
      requestCookies.set(name, value, options);
    },
    delete(name) {
      requestCookies.delete(name);
    },
  };
}