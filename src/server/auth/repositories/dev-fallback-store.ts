import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import type { UserRecord, UserCredentials, CreateUserInput } from "./user-repository";
import type { SessionRecord, CreateSessionInput } from "./session-repository";
import type { EmailVerificationRecord, CreateEmailVerificationInput } from "./email-verification-repository";
import type { PasswordResetRecord, CreatePasswordResetInput } from "./password-reset-repository";
import { RepositoryError } from "./repository-error";

export function isDbConnectionError(error: unknown): boolean {
  if (!error) return false;
  if (error instanceof Prisma.PrismaClientInitializationError) return true;
  if (error instanceof Prisma.PrismaClientKnownRequestError && (error.code === "P1001" || error.code === "P1000")) {
    return true;
  }
  const err = error as { code?: string; message?: string };
  if (err.code === "P1001" || err.code === "P1000") return true;
  if (typeof err.message === "string" && err.message.includes("Can't reach database server")) return true;
  return false;
}

interface StoredToken {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  consumedAt: Date | null;
  createdAt: Date;
}

interface DevMemoryState {
  users: (UserCredentials & { displayName: string; handle: string; createdAt: Date; updatedAt: Date })[];
  sessions: (SessionRecord & { refreshTokenHash: string })[];
  emailVerificationTokens: StoredToken[];
  passwordResetTokens: StoredToken[];
}

const globalForDevStore = globalThis as unknown as { __livzo_dev_store__?: DevMemoryState };

if (!globalForDevStore.__livzo_dev_store__) {
  globalForDevStore.__livzo_dev_store__ = {
    users: [],
    sessions: [],
    emailVerificationTokens: [],
    passwordResetTokens: [],
  };
}

const state = globalForDevStore.__livzo_dev_store__;

export const devFallbackStore = {
  users: {
    create(input: CreateUserInput): UserRecord {
      const emailLower = input.email.toLowerCase().trim();
      const handleLower = input.handle.toLowerCase().trim();

      if (state.users.some((u) => u.email.toLowerCase() === emailLower)) {
        throw new RepositoryError("Email already exists", "CONFLICT");
      }
      if (state.users.some((u) => u.handle.toLowerCase() === handleLower)) {
        throw new RepositoryError("Handle already exists", "CONFLICT");
      }

      const now = new Date();
      const user = {
        id: randomUUID(),
        email: input.email,
        displayName: input.displayName,
        handle: input.handle,
        passwordHash: input.passwordHash,
        role: input.role ?? ("USER" as const),
        emailVerifiedAt: null,
        tokenVersion: 0,
        disabledAt: null,
        createdAt: now,
        updatedAt: now,
      };

      state.users.push(user);
      return {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        handle: user.handle,
        role: user.role,
        emailVerifiedAt: user.emailVerifiedAt,
        tokenVersion: user.tokenVersion,
        disabledAt: user.disabledAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    },

    findById(id: string): UserRecord | null {
      const u = state.users.find((user) => user.id === id);
      if (!u) return null;
      return {
        id: u.id,
        email: u.email,
        displayName: u.displayName,
        handle: u.handle,
        role: u.role,
        emailVerifiedAt: u.emailVerifiedAt,
        tokenVersion: u.tokenVersion,
        disabledAt: u.disabledAt,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      };
    },

    findByEmail(email: string): UserRecord | null {
      const lower = email.toLowerCase().trim();
      const u = state.users.find((user) => user.email.toLowerCase() === lower);
      if (!u) return null;
      return {
        id: u.id,
        email: u.email,
        displayName: u.displayName,
        handle: u.handle,
        role: u.role,
        emailVerifiedAt: u.emailVerifiedAt,
        tokenVersion: u.tokenVersion,
        disabledAt: u.disabledAt,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      };
    },

    findCredentialsByEmail(email: string): UserCredentials | null {
      const lower = email.toLowerCase().trim();
      const u = state.users.find((user) => user.email.toLowerCase() === lower);
      if (!u) return null;
      return {
        id: u.id,
        email: u.email,
        displayName: u.displayName,
        handle: u.handle,
        role: u.role,
        emailVerifiedAt: u.emailVerifiedAt,
        tokenVersion: u.tokenVersion,
        disabledAt: u.disabledAt,
        passwordHash: u.passwordHash,
      };
    },

    markEmailVerified(id: string, verifiedAt = new Date()): UserRecord {
      const u = state.users.find((user) => user.id === id);
      if (!u) throw new RepositoryError("User not found", "NOT_FOUND");
      u.emailVerifiedAt = verifiedAt;
      u.updatedAt = new Date();
      return {
        id: u.id,
        email: u.email,
        displayName: u.displayName,
        handle: u.handle,
        role: u.role,
        emailVerifiedAt: u.emailVerifiedAt,
        tokenVersion: u.tokenVersion,
        disabledAt: u.disabledAt,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      };
    },

    updatePassword(id: string, passwordHash: string): UserRecord {
      const u = state.users.find((user) => user.id === id);
      if (!u) throw new RepositoryError("User not found", "NOT_FOUND");
      u.passwordHash = passwordHash;
      u.tokenVersion += 1;
      u.updatedAt = new Date();
      return {
        id: u.id,
        email: u.email,
        displayName: u.displayName,
        handle: u.handle,
        role: u.role,
        emailVerifiedAt: u.emailVerifiedAt,
        tokenVersion: u.tokenVersion,
        disabledAt: u.disabledAt,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      };
    },

    incrementTokenVersion(id: string): UserRecord {
      const u = state.users.find((user) => user.id === id);
      if (!u) throw new RepositoryError("User not found", "NOT_FOUND");
      u.tokenVersion += 1;
      u.updatedAt = new Date();
      return {
        id: u.id,
        email: u.email,
        displayName: u.displayName,
        handle: u.handle,
        role: u.role,
        emailVerifiedAt: u.emailVerifiedAt,
        tokenVersion: u.tokenVersion,
        disabledAt: u.disabledAt,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      };
    },

    updateProfile(id: string, data: { displayName?: string; handle?: string }): UserRecord {
      const u = state.users.find((user) => user.id === id);
      if (!u) throw new RepositoryError("User not found", "NOT_FOUND");

      if (data.handle) {
        const handleLower = data.handle.toLowerCase().trim();
        const existing = state.users.find(
          (other) => other.id !== id && other.handle.toLowerCase() === handleLower,
        );
        if (existing) {
          throw new RepositoryError("Handle already in use", "CONFLICT");
        }
        u.handle = data.handle.trim();
      }

      if (data.displayName) {
        u.displayName = data.displayName.trim();
      }

      u.updatedAt = new Date();
      return {
        id: u.id,
        email: u.email,
        displayName: u.displayName,
        handle: u.handle,
        role: u.role,
        emailVerifiedAt: u.emailVerifiedAt,
        tokenVersion: u.tokenVersion,
        disabledAt: u.disabledAt,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      };
    },
  },

  sessions: {
    create(input: CreateSessionInput): SessionRecord {
      const now = new Date();
      const session: SessionRecord & { refreshTokenHash: string } = {
        id: input.id ?? randomUUID(),
        userId: input.userId,
        refreshTokenHash: input.refreshTokenHash,
        userAgent: input.userAgent ?? null,
        ipHash: input.ipHash ?? null,
        expiresAt: input.expiresAt,
        revokedAt: null,
        lastSeenAt: now,
        createdAt: now,
      };
      state.sessions.push(session);
      return {
        id: session.id,
        userId: session.userId,
        userAgent: session.userAgent,
        ipHash: session.ipHash,
        expiresAt: session.expiresAt,
        revokedAt: session.revokedAt,
        lastSeenAt: session.lastSeenAt,
        createdAt: session.createdAt,
      };
    },

    findActiveById(id: string, now = new Date()): SessionRecord | null {
      const s = state.sessions.find(
        (session) => session.id === id && session.revokedAt === null && session.expiresAt > now,
      );
      if (!s) return null;
      return {
        id: s.id,
        userId: s.userId,
        userAgent: s.userAgent,
        ipHash: s.ipHash,
        expiresAt: s.expiresAt,
        revokedAt: s.revokedAt,
        lastSeenAt: s.lastSeenAt,
        createdAt: s.createdAt,
      };
    },

    findActiveByRefreshTokenHash(hash: string, now = new Date()): SessionRecord | null {
      const s = state.sessions.find(
        (session) =>
          session.refreshTokenHash === hash && session.revokedAt === null && session.expiresAt > now,
      );
      if (!s) return null;
      return {
        id: s.id,
        userId: s.userId,
        userAgent: s.userAgent,
        ipHash: s.ipHash,
        expiresAt: s.expiresAt,
        revokedAt: s.revokedAt,
        lastSeenAt: s.lastSeenAt,
        createdAt: s.createdAt,
      };
    },

    rotate(id: string, refreshTokenHash: string, expiresAt: Date, now = new Date()): SessionRecord {
      const s = state.sessions.find((session) => session.id === id && session.revokedAt === null);
      if (!s) throw new RepositoryError("Session not found", "NOT_FOUND");
      s.refreshTokenHash = refreshTokenHash;
      s.expiresAt = expiresAt;
      s.lastSeenAt = now;
      return {
        id: s.id,
        userId: s.userId,
        userAgent: s.userAgent,
        ipHash: s.ipHash,
        expiresAt: s.expiresAt,
        revokedAt: s.revokedAt,
        lastSeenAt: s.lastSeenAt,
        createdAt: s.createdAt,
      };
    },

    touch(id: string, lastSeenAt = new Date()): void {
      const s = state.sessions.find((session) => session.id === id && session.revokedAt === null);
      if (s) {
        s.lastSeenAt = lastSeenAt;
      }
    },

    revoke(id: string, revokedAt = new Date()): void {
      const s = state.sessions.find((session) => session.id === id);
      if (s) {
        s.revokedAt = revokedAt;
      }
    },

    revokeAllForUser(userId: string, revokedAt = new Date()): void {
      for (const s of state.sessions) {
        if (s.userId === userId && s.revokedAt === null) {
          s.revokedAt = revokedAt;
        }
      }
    },
  },

  emailVerificationTokens: {
    create(input: CreateEmailVerificationInput): EmailVerificationRecord {
      const now = new Date();
      const token: StoredToken = {
        id: randomUUID(),
        userId: input.userId,
        tokenHash: input.tokenHash,
        expiresAt: input.expiresAt,
        consumedAt: null,
        createdAt: now,
      };
      state.emailVerificationTokens.push(token);
      return {
        id: token.id,
        userId: token.userId,
        expiresAt: token.expiresAt,
        consumedAt: token.consumedAt,
        createdAt: token.createdAt,
      };
    },

    findUsableByHash(tokenHash: string, now = new Date()): EmailVerificationRecord | null {
      const t = state.emailVerificationTokens.find(
        (token) => token.tokenHash === tokenHash && token.consumedAt === null && token.expiresAt > now,
      );
      if (!t) return null;
      return {
        id: t.id,
        userId: t.userId,
        expiresAt: t.expiresAt,
        consumedAt: t.consumedAt,
        createdAt: t.createdAt,
      };
    },

    consume(id: string, consumedAt = new Date(), now = new Date()): boolean {
      const token = state.emailVerificationTokens.find(
        (t) => t.id === id && t.consumedAt === null && t.expiresAt > now,
      );
      if (!token) return false;
      token.consumedAt = consumedAt;
      return true;
    },

    invalidateOutstandingForUser(userId: string, invalidatedAt = new Date()): void {
      for (const t of state.emailVerificationTokens) {
        if (t.userId === userId && t.consumedAt === null) {
          t.consumedAt = invalidatedAt;
        }
      }
    },
  },

  passwordResetTokens: {
    create(input: CreatePasswordResetInput): PasswordResetRecord {
      const now = new Date();
      const token: StoredToken = {
        id: randomUUID(),
        userId: input.userId,
        tokenHash: input.tokenHash,
        expiresAt: input.expiresAt,
        consumedAt: null,
        createdAt: now,
      };
      state.passwordResetTokens.push(token);
      return {
        id: token.id,
        userId: token.userId,
        expiresAt: token.expiresAt,
        consumedAt: token.consumedAt,
        createdAt: token.createdAt,
      };
    },

    findUsableByHash(tokenHash: string, now = new Date()): PasswordResetRecord | null {
      const t = state.passwordResetTokens.find(
        (token) => token.tokenHash === tokenHash && token.consumedAt === null && token.expiresAt > now,
      );
      if (!t) return null;
      return {
        id: t.id,
        userId: t.userId,
        expiresAt: t.expiresAt,
        consumedAt: t.consumedAt,
        createdAt: t.createdAt,
      };
    },

    consume(id: string, consumedAt = new Date(), now = new Date()): boolean {
      const token = state.passwordResetTokens.find(
        (t) => t.id === id && t.consumedAt === null && t.expiresAt > now,
      );
      if (!token) return false;
      token.consumedAt = consumedAt;
      return true;
    },

    invalidateOutstandingForUser(userId: string, invalidatedAt = new Date()): void {
      for (const t of state.passwordResetTokens) {
        if (t.userId === userId && t.consumedAt === null) {
          t.consumedAt = invalidatedAt;
        }
      }
    },
  },
};
