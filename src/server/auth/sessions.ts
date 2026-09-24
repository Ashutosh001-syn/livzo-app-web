import type { UserRole } from "@/types/user";

export interface SessionStore {
  create(input: { userId: string; rememberMe: boolean; userAgent?: string; ipHash?: string }): Promise<{ sessionId: string; refreshToken: string; expiresAt: Date }>;
  rotate(sessionId: string, refreshToken: string): Promise<{ refreshToken: string; expiresAt: Date }>;
  revoke(sessionId: string): Promise<void>;
}

export interface SessionPrincipal {
  userId: string;
  sessionId: string;
  role: UserRole;
}
