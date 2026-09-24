import type { UserRole } from "@/types/user";

export interface AccessTokenClaims {
  sub: string;
  role: UserRole;
  sessionId: string;
  type: "access";
  iat: number;
  exp: number;
}

export interface RefreshTokenClaims {
  sub: string;
  sessionId: string;
  tokenVersion: number;
  type: "refresh";
  iat: number;
  exp: number;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  displayName: string;
  handle: string;
  role: UserRole;
  emailVerifiedAt: string | null;
  sessionId: string;
}

export interface AuthResult {
  user: AuthenticatedUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}
