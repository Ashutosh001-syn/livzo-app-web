import { Prisma, PrismaClient } from "@prisma/client";

import { prisma as defaultPrisma } from "@/server/db/prisma";

import { RepositoryError } from "./repository-error";

const tokenSelect = {
  id: true,
  userId: true,
  expiresAt: true,
  consumedAt: true,
  createdAt: true,
} satisfies Prisma.PasswordResetTokenSelect;

export type PasswordResetRecord = Prisma.PasswordResetTokenGetPayload<{
  select: typeof tokenSelect;
}>;

export interface CreatePasswordResetInput {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}

import { devFallbackStore, isDbConnectionError } from "./dev-fallback-store";

export class PasswordResetRepository {
  constructor(private readonly client: PrismaClient = defaultPrisma) {}

  async create(input: CreatePasswordResetInput): Promise<PasswordResetRecord> {
    try {
      return await this.client.passwordResetToken.create({ data: input, select: tokenSelect });
    } catch (error) {
      if (isDbConnectionError(error)) {
        return devFallbackStore.passwordResetTokens.create(input);
      }
      throw this.mapError(error, "Unable to create password reset token");
    }
  }

  async findUsableByHash(tokenHash: string, now = new Date()): Promise<PasswordResetRecord | null> {
    try {
      return await this.client.passwordResetToken.findFirst({
        where: { tokenHash, consumedAt: null, expiresAt: { gt: now } },
        select: tokenSelect,
      });
    } catch (error) {
      if (isDbConnectionError(error)) {
        return devFallbackStore.passwordResetTokens.findUsableByHash(tokenHash, now);
      }
      throw this.mapError(error, "Unable to find password reset token");
    }
  }

  async consume(id: string, consumedAt = new Date(), now = new Date()): Promise<boolean> {
    try {
      const result = await this.client.passwordResetToken.updateMany({
        where: { id, consumedAt: null, expiresAt: { gt: now } },
        data: { consumedAt },
      });
      return result.count === 1;
    } catch (error) {
      if (isDbConnectionError(error)) {
        return devFallbackStore.passwordResetTokens.consume(id, consumedAt, now);
      }
      throw this.mapError(error, "Unable to consume password reset token");
    }
  }

  async invalidateOutstandingForUser(userId: string, invalidatedAt = new Date()): Promise<void> {
    try {
      await this.client.passwordResetToken.updateMany({
        where: { userId, consumedAt: null },
        data: { consumedAt: invalidatedAt },
      });
    } catch (error) {
      if (isDbConnectionError(error)) {
        devFallbackStore.passwordResetTokens.invalidateOutstandingForUser(userId, invalidatedAt);
        return;
      }
      throw this.mapError(error, "Unable to invalidate password reset tokens");
    }
  }

  private mapError(error: unknown, message: string): RepositoryError {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") return new RepositoryError(message, "CONFLICT", { cause: error });
      if (error.code === "P2025") return new RepositoryError(message, "NOT_FOUND", { cause: error });
    }
    return new RepositoryError(message, "UNKNOWN", { cause: error });
  }
}