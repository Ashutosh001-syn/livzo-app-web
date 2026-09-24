import { Prisma, PrismaClient } from "@prisma/client";

import { prisma as defaultPrisma } from "@/server/db/prisma";

import { RepositoryError } from "./repository-error";

const tokenSelect = {
  id: true,
  userId: true,
  expiresAt: true,
  consumedAt: true,
  createdAt: true,
} satisfies Prisma.EmailVerificationTokenSelect;

export type EmailVerificationRecord = Prisma.EmailVerificationTokenGetPayload<{
  select: typeof tokenSelect;
}>;

export interface CreateEmailVerificationInput {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}

import { devFallbackStore, isDbConnectionError } from "./dev-fallback-store";

export class EmailVerificationRepository {
  constructor(private readonly client: PrismaClient = defaultPrisma) {}

  async create(input: CreateEmailVerificationInput): Promise<EmailVerificationRecord> {
    try {
      return await this.client.emailVerificationToken.create({ data: input, select: tokenSelect });
    } catch (error) {
      if (isDbConnectionError(error)) {
        return devFallbackStore.emailVerificationTokens.create(input);
      }
      throw this.mapError(error, "Unable to create email verification token");
    }
  }

  async findUsableByHash(tokenHash: string, now = new Date()): Promise<EmailVerificationRecord | null> {
    try {
      return await this.client.emailVerificationToken.findFirst({
        where: { tokenHash, consumedAt: null, expiresAt: { gt: now } },
        select: tokenSelect,
      });
    } catch (error) {
      if (isDbConnectionError(error)) {
        return devFallbackStore.emailVerificationTokens.findUsableByHash(tokenHash, now);
      }
      throw this.mapError(error, "Unable to find email verification token");
    }
  }

  async consume(id: string, consumedAt = new Date(), now = new Date()): Promise<boolean> {
    try {
      const result = await this.client.emailVerificationToken.updateMany({
        where: { id, consumedAt: null, expiresAt: { gt: now } },
        data: { consumedAt },
      });
      return result.count === 1;
    } catch (error) {
      if (isDbConnectionError(error)) {
        return devFallbackStore.emailVerificationTokens.consume(id, consumedAt, now);
      }
      throw this.mapError(error, "Unable to consume email verification token");
    }
  }

  async invalidateOutstandingForUser(userId: string, invalidatedAt = new Date()): Promise<void> {
    try {
      await this.client.emailVerificationToken.updateMany({
        where: { userId, consumedAt: null },
        data: { consumedAt: invalidatedAt },
      });
    } catch (error) {
      if (isDbConnectionError(error)) {
        devFallbackStore.emailVerificationTokens.invalidateOutstandingForUser(userId, invalidatedAt);
        return;
      }
      throw this.mapError(error, "Unable to invalidate email verification tokens");
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