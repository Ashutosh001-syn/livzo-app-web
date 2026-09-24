import { Prisma, PrismaClient } from "@prisma/client";

import { prisma as defaultPrisma } from "@/server/db/prisma";

import { RepositoryError } from "./repository-error";

const sessionSelect = {
  id: true,
  userId: true,
  userAgent: true,
  ipHash: true,
  expiresAt: true,
  revokedAt: true,
  lastSeenAt: true,
  createdAt: true,
} satisfies Prisma.SessionSelect;

export type SessionRecord = Prisma.SessionGetPayload<{ select: typeof sessionSelect }>;

export interface CreateSessionInput {
  id?: string;
  userId: string;
  refreshTokenHash: string;
  userAgent?: string;
  ipHash?: string;
  expiresAt: Date;
}

import { devFallbackStore, isDbConnectionError } from "./dev-fallback-store";

export class SessionRepository {
  constructor(private readonly client: PrismaClient = defaultPrisma) {}

  async create(input: CreateSessionInput): Promise<SessionRecord> {
    try {
      return await this.client.session.create({ data: input, select: sessionSelect });
    } catch (error) {
      if (isDbConnectionError(error)) {
        return devFallbackStore.sessions.create(input);
      }
      throw this.mapError(error, "Unable to create session");
    }
  }

  async findActiveById(id: string, now = new Date()): Promise<SessionRecord | null> {
    try {
      return await this.client.session.findFirst({
        where: { id, revokedAt: null, expiresAt: { gt: now } },
        select: sessionSelect,
      });
    } catch (error) {
      if (isDbConnectionError(error)) {
        return devFallbackStore.sessions.findActiveById(id, now);
      }
      throw this.mapError(error, "Unable to find session");
    }
  }

  async findActiveByRefreshTokenHash(hash: string, now = new Date()): Promise<SessionRecord | null> {
    try {
      return await this.client.session.findFirst({
        where: { refreshTokenHash: hash, revokedAt: null, expiresAt: { gt: now } },
        select: sessionSelect,
      });
    } catch (error) {
      if (isDbConnectionError(error)) {
        return devFallbackStore.sessions.findActiveByRefreshTokenHash(hash, now);
      }
      throw this.mapError(error, "Unable to find session");
    }
  }

  async rotate(id: string, refreshTokenHash: string, expiresAt: Date, now = new Date()): Promise<SessionRecord> {
    try {
      return await this.client.session.update({
        where: { id, revokedAt: null },
        data: { refreshTokenHash, expiresAt, lastSeenAt: now },
        select: sessionSelect,
      });
    } catch (error) {
      if (isDbConnectionError(error)) {
        return devFallbackStore.sessions.rotate(id, refreshTokenHash, expiresAt, now);
      }
      throw this.mapError(error, "Unable to rotate session");
    }
  }

  async touch(id: string, lastSeenAt = new Date()): Promise<void> {
    try {
      await this.client.session.updateMany({
        where: { id, revokedAt: null, expiresAt: { gt: lastSeenAt } },
        data: { lastSeenAt },
      });
    } catch (error) {
      if (isDbConnectionError(error)) {
        devFallbackStore.sessions.touch(id, lastSeenAt);
        return;
      }
      throw this.mapError(error, "Unable to update session activity");
    }
  }

  async revoke(id: string, revokedAt = new Date()): Promise<void> {
    try {
      await this.client.session.updateMany({ where: { id, revokedAt: null }, data: { revokedAt } });
    } catch (error) {
      if (isDbConnectionError(error)) {
        devFallbackStore.sessions.revoke(id, revokedAt);
        return;
      }
      throw this.mapError(error, "Unable to revoke session");
    }
  }

  async revokeAllForUser(userId: string, revokedAt = new Date()): Promise<void> {
    try {
      await this.client.session.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt } });
    } catch (error) {
      if (isDbConnectionError(error)) {
        devFallbackStore.sessions.revokeAllForUser(userId, revokedAt);
        return;
      }
      throw this.mapError(error, "Unable to revoke user sessions");
    }
  }

  private mapError(error: unknown, message: string): RepositoryError {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return new RepositoryError(message, "NOT_FOUND", { cause: error });
    }
    return new RepositoryError(message, "UNKNOWN", { cause: error });
  }
}