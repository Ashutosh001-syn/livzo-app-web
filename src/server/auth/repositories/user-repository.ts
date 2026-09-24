import { Prisma, PrismaClient, UserRole } from "@prisma/client";

import { prisma as defaultPrisma } from "@/server/db/prisma";

import { RepositoryError } from "./repository-error";

const publicUserSelect = {
  id: true,
  email: true,
  displayName: true,
  handle: true,
  role: true,
  emailVerifiedAt: true,
  tokenVersion: true,
  disabledAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export type UserRecord = Prisma.UserGetPayload<{
  select: typeof publicUserSelect;
}>;

export type UserCredentials = Pick<
  Prisma.UserGetPayload<{
    select: typeof publicUserSelect;
  }>,
  "id" | "email" | "displayName" | "handle" | "role" | "emailVerifiedAt" | "tokenVersion" | "disabledAt"
> & { passwordHash: string };

export interface CreateUserInput {
  email: string;
  displayName: string;
  handle: string;
  passwordHash: string;
  role?: UserRole;
}

import { devFallbackStore, isDbConnectionError } from "./dev-fallback-store";

export class UserRepository {
  constructor(private readonly client: PrismaClient = defaultPrisma) {}

  async create(input: CreateUserInput): Promise<UserRecord> {
    try {
      return await this.client.user.create({ data: input, select: publicUserSelect });
    } catch (error) {
      if (isDbConnectionError(error)) {
        return devFallbackStore.users.create(input);
      }
      throw this.mapError(error, "Unable to create user");
    }
  }

  async findById(id: string): Promise<UserRecord | null> {
    try {
      return await this.client.user.findUnique({ where: { id }, select: publicUserSelect });
    } catch (error) {
      if (isDbConnectionError(error)) {
        return devFallbackStore.users.findById(id);
      }
      throw this.mapError(error, "Unable to find user");
    }
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    try {
      return await this.client.user.findUnique({ where: { email }, select: publicUserSelect });
    } catch (error) {
      if (isDbConnectionError(error)) {
        return devFallbackStore.users.findByEmail(email);
      }
      throw this.mapError(error, "Unable to find user");
    }
  }

  async findCredentialsByEmail(email: string): Promise<UserCredentials | null> {
    try {
      return await this.client.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          displayName: true,
          handle: true,
          role: true,
          emailVerifiedAt: true,
          tokenVersion: true,
          disabledAt: true,
          passwordHash: true,
        },
      });
    } catch (error) {
      if (isDbConnectionError(error)) {
        return devFallbackStore.users.findCredentialsByEmail(email);
      }
      throw this.mapError(error, "Unable to find user credentials");
    }
  }

  async markEmailVerified(id: string, verifiedAt = new Date()): Promise<UserRecord> {
    try {
      return await this.client.user.update({
        where: { id },
        data: { emailVerifiedAt: verifiedAt },
        select: publicUserSelect,
      });
    } catch (error) {
      if (isDbConnectionError(error)) {
        return devFallbackStore.users.markEmailVerified(id, verifiedAt);
      }
      throw this.mapError(error, "Unable to verify user email");
    }
  }

  async updatePassword(id: string, passwordHash: string): Promise<UserRecord> {
    try {
      return await this.client.user.update({
        where: { id },
        data: { passwordHash, tokenVersion: { increment: 1 } },
        select: publicUserSelect,
      });
    } catch (error) {
      if (isDbConnectionError(error)) {
        return devFallbackStore.users.updatePassword(id, passwordHash);
      }
      throw this.mapError(error, "Unable to update user password");
    }
  }

  async incrementTokenVersion(id: string): Promise<UserRecord> {
    try {
      return await this.client.user.update({
        where: { id },
        data: { tokenVersion: { increment: 1 } },
        select: publicUserSelect,
      });
    } catch (error) {
      if (isDbConnectionError(error)) {
        return devFallbackStore.users.incrementTokenVersion(id);
      }
      throw this.mapError(error, "Unable to invalidate user tokens");
    }
  }

  async updateProfile(id: string, data: { displayName?: string; handle?: string }): Promise<UserRecord> {
    try {
      return await this.client.user.update({
        where: { id },
        data,
        select: publicUserSelect,
      });
    } catch (error) {
      if (isDbConnectionError(error)) {
        return devFallbackStore.users.updateProfile(id, data);
      }
      throw this.mapError(error, "Unable to update user profile");
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