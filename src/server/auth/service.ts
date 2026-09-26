import { createHash, randomBytes, randomUUID } from "node:crypto";

import jwt, { type JwtPayload } from "jsonwebtoken";

import { authConfig } from "./config";
import type { CookieStore } from "./cookies";
import { prisma } from "@/server/db/prisma";
import { mailer } from "@/server/mail/mailer";
import { EmailVerificationRepository } from "./repositories/email-verification-repository";
import { PasswordResetRepository } from "./repositories/password-reset-repository";
import { SessionRepository, type SessionRecord } from "./repositories/session-repository";
import { UserRepository, type UserCredentials, type UserRecord } from "./repositories/user-repository";
import type { AuthResult, AuthenticatedUser } from "./types";
import type { UserRole } from "@/types/user";
import { defaultPasswordService, type PasswordService } from "./password";

export class AuthServiceError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "INVALID_INPUT"
      | "INVALID_CREDENTIALS"
      | "INVALID_TOKEN"
      | "FORBIDDEN"
      | "CONFLICT"
      | "NOT_FOUND",
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = "AuthServiceError";
  }
}

export interface SignupInput {
  email: string;
  displayName: string;
  handle: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
  userAgent?: string;
  ipHash?: string;
}

export interface RefreshInput {
  refreshToken?: string;
}

export interface ForgotPasswordResult {
  accepted: true;
  resetToken: string | null;
}

export interface AuthServiceDependencies {
  users?: UserRepository;
  sessions?: SessionRepository;
  emailVerificationTokens?: EmailVerificationRepository;
  passwordResetTokens?: PasswordResetRepository;
  cookies?: CookieStore;
  passwordService?: PasswordService;
  now?: () => Date;
}

interface RefreshClaims extends JwtPayload {
  sub: string;
  sessionId: string;
  tokenVersion: number;
  type: "refresh";
}

export interface AccessClaims {
  sub: string;
  role: UserRole;
  sessionId: string;
  type: "access";
}

type PersistedUser = UserRecord | UserCredentials;

export class AuthService {
  private readonly users: UserRepository;
  private readonly sessions: SessionRepository;
  private readonly emailVerificationTokens: EmailVerificationRepository;
  private readonly passwordResetTokens: PasswordResetRepository;
  private readonly cookieStore?: CookieStore;
  private readonly passwordService: PasswordService;
  private readonly now: () => Date;

  constructor(dependencies: AuthServiceDependencies = {}) {
    this.users = dependencies.users ?? new UserRepository();
    this.sessions = dependencies.sessions ?? new SessionRepository();
    this.emailVerificationTokens = dependencies.emailVerificationTokens ?? new EmailVerificationRepository();
    this.passwordResetTokens = dependencies.passwordResetTokens ?? new PasswordResetRepository();
    this.cookieStore = dependencies.cookies;
    this.passwordService = dependencies.passwordService ?? defaultPasswordService;
    this.now = dependencies.now ?? (() => new Date());
  }

  async signup(input: SignupInput): Promise<{ user: UserRecord; verificationToken: string; requiresVerification: boolean }> {
    const email = this.normalizeEmail(input.email);
    const handle = input.handle.trim().toLowerCase();
    this.validateSignup(input.displayName, handle, input.password);

    const user = await this.users.create({
      email,
      displayName: input.displayName.trim(),
      handle,
      passwordHash: await this.passwordService.hash(input.password),
    });
    const verificationToken = this.createOpaqueToken();

    await this.emailVerificationTokens.create({
      userId: user.id,
      tokenHash: this.hashOpaqueToken(verificationToken),
      expiresAt: this.addSeconds(this.now(), authConfig.emailVerificationTtlSeconds),
    });

    const requireVerification = process.env.REQUIRE_EMAIL_VERIFICATION === "true";
    let finalUser = user;
    if (!requireVerification) {
      finalUser = await this.users.markEmailVerified(user.id, this.now());
    }

    await mailer.sendVerificationEmail(user.email, verificationToken, user.handle);

    return { user: finalUser, verificationToken, requiresVerification: requireVerification };
  }

  async login(input: LoginInput): Promise<AuthResult> {
    // TEST BYPASS CREDENTIALS
    const isHostTest = input.email === "host@livzo.com" && input.password === "1234";
    const isViewerTest = input.email === "viewer@livzo.com" && input.password === "1234";
    const isAdminTest = input.email === "8888888888" && input.password === "1234";

    if (isHostTest || isViewerTest || isAdminTest) {
      const emailToUse = isAdminTest ? "admin@livzo.com" : input.email;
      let testUser = await this.users.findByEmail(emailToUse);
      
      if (!testUser) {
        testUser = await prisma.user.create({
          data: {
            email: emailToUse,
            phone: isAdminTest ? "8888888888" : isHostTest ? "host123" : "viewer123",
            displayName: isAdminTest ? "System Admin" : isHostTest ? "Test Host" : "Test Viewer",
            handle: isAdminTest ? "admin" : isHostTest ? "testhost" : "testviewer",
            passwordHash: await this.passwordService.hash("1234"),
            role: isAdminTest ? "admin" : isHostTest ? "host" : "user"
          }
        });
      }
      
      const sessionTtl = authConfig.sessionTtlSeconds;
      const expiresAt = this.addSeconds(this.now(), sessionTtl);
      const sessionId = randomUUID();
      const refreshToken = this.signRefreshToken(testUser.id, testUser.tokenVersion, expiresAt, sessionId);
      
      const session = await this.sessions.create({
        id: sessionId,
        userId: testUser.id,
        refreshTokenHash: this.hashOpaqueToken(refreshToken),
        userAgent: input.userAgent,
        ipHash: input.ipHash,
        expiresAt,
      });

      const authUser = this.toAuthenticatedUser(testUser, session.id);
      if (isAdminTest) authUser.role = "admin";
      if (isHostTest) authUser.role = "host";
      
      const accessToken = jwt.sign(
        { sub: testUser.id, role: authUser.role, sessionId, type: "access" },
        this.requireEnv("AUTH_JWT_SECRET"),
        { algorithm: "HS256", expiresIn: authConfig.accessTokenTtlSeconds },
      );

      const result = {
        user: authUser,
        accessToken,
        refreshToken,
        expiresAt: session.expiresAt,
      };

      this.writeAuthCookies(result, false);
      return result;
    }

    const credentials = await this.users.findCredentialsByEmail(this.normalizeEmail(input.email));
    if (!credentials || !(await this.passwordService.verify(credentials.passwordHash, input.password))) {
      throw new AuthServiceError("Invalid email or password", "INVALID_CREDENTIALS");
    }
    if (credentials.disabledAt) {
      throw new AuthServiceError("Invalid email or password", "INVALID_CREDENTIALS");
    }
    const requireVerification = process.env.REQUIRE_EMAIL_VERIFICATION === "true";
    if (requireVerification && !credentials.emailVerifiedAt) {
      throw new AuthServiceError("Email verification is required", "FORBIDDEN");
    }

    const sessionTtl = input.rememberMe
      ? authConfig.rememberMeSessionTtlSeconds
      : authConfig.sessionTtlSeconds;
    const expiresAt = this.addSeconds(this.now(), sessionTtl);
    const sessionId = randomUUID();
    const refreshToken = this.signRefreshToken(credentials.id, credentials.tokenVersion, expiresAt, sessionId);
    const session = await this.sessions.create({
      id: sessionId,
      userId: credentials.id,
      refreshTokenHash: this.hashOpaqueToken(refreshToken),
      userAgent: input.userAgent,
      ipHash: input.ipHash,
      expiresAt,
    });
    const result = this.createAuthResult(credentials, session, refreshToken);
    this.writeAuthCookies(result, input.rememberMe ?? false);
    return result;
  }

  async logout(refreshToken?: string): Promise<void> {
    try {
      const token = refreshToken ?? this.cookieStore?.get(authConfig.cookies.refresh);
      if (token) {
        const sessionId = this.verifyRefreshToken(token).sessionId;
        await this.sessions.revoke(sessionId, this.now());
      }
    } finally {
      this.clearAuthCookies();
    }
  }

  async refreshSession(input: RefreshInput = {}): Promise<AuthResult> {
    const refreshToken = input.refreshToken ?? this.cookieStore?.get(authConfig.cookies.refresh);
    if (!refreshToken) throw new AuthServiceError("Invalid refresh token", "INVALID_TOKEN");

    const claims = this.verifyRefreshToken(refreshToken);
    const session = await this.sessions.findActiveByRefreshTokenHash(this.hashOpaqueToken(refreshToken), this.now());
    if (!session || session.id !== claims.sessionId || session.userId !== claims.sub) {
      throw new AuthServiceError("Invalid refresh token", "INVALID_TOKEN");
    }

    const user = await this.users.findById(session.userId);
    if (!user || user.disabledAt || user.tokenVersion !== claims.tokenVersion) {
      await this.sessions.revoke(session.id, this.now());
      throw new AuthServiceError("Invalid refresh token", "INVALID_TOKEN");
    }

    const refreshTokenExpiresAt = session.expiresAt;
    const nextRefreshToken = this.signRefreshToken(user.id, user.tokenVersion, refreshTokenExpiresAt, session.id);
    const rotatedSession = await this.sessions.rotate(
      session.id,
      this.hashOpaqueToken(nextRefreshToken),
      refreshTokenExpiresAt,
      this.now(),
    );
    const result = this.createAuthResult(user, rotatedSession, nextRefreshToken);
    this.writeAuthCookies(result, refreshTokenExpiresAt.getTime() - this.now().getTime() > authConfig.sessionTtlSeconds * 1000);
    return result;
  }

  async verifyEmail(token: string): Promise<UserRecord> {
    const record = await this.emailVerificationTokens.findUsableByHash(this.hashOpaqueToken(token), this.now());
    if (!record || !(await this.emailVerificationTokens.consume(record.id, this.now(), this.now()))) {
      throw new AuthServiceError("Invalid or expired verification token", "INVALID_TOKEN");
    }
    return this.users.markEmailVerified(record.userId, this.now());
  }

  async forgotPassword(email: string): Promise<ForgotPasswordResult> {
    const user = await this.users.findByEmail(this.normalizeEmail(email));
    if (!user || user.disabledAt) return { accepted: true, resetToken: null };

    const resetToken = this.createOpaqueToken();
    await this.passwordResetTokens.invalidateOutstandingForUser(user.id, this.now());
    await this.passwordResetTokens.create({
      userId: user.id,
      tokenHash: this.hashOpaqueToken(resetToken),
      expiresAt: this.addSeconds(this.now(), authConfig.passwordResetTtlSeconds),
    });

    await mailer.sendPasswordResetEmail(user.email, resetToken);

    return { accepted: true, resetToken };
  }

  verifyAccessToken(token: string): AccessClaims {
    try {
      const payload = jwt.verify(token, this.requireEnv("AUTH_JWT_SECRET"), { algorithms: ["HS256"] });
      if (
        typeof payload === "string" ||
        payload.type !== "access" ||
        typeof payload.sub !== "string" ||
        typeof payload.sessionId !== "string" ||
        typeof payload.role !== "string"
      ) {
        throw new Error("Invalid access claims");
      }
      return payload as AccessClaims;
    } catch (error) {
      throw new AuthServiceError("Invalid access token", "INVALID_TOKEN", { cause: error });
    }
  }

  async getCurrentUser(): Promise<AuthenticatedUser | null> {
    const accessToken = this.cookieStore?.get(authConfig.cookies.access);
    if (accessToken) {
      try {
        const claims = this.verifyAccessToken(accessToken);
        const session = await this.sessions.findActiveById(claims.sessionId, this.now());
        if (session && session.userId === claims.sub) {
          const user = await this.users.findById(session.userId);
          if (user && !user.disabledAt) {
            return this.toAuthenticatedUser(user, session.id);
          }
        }
      } catch {
        // Fall through to refresh attempt
      }
    }

    const refreshToken = this.cookieStore?.get(authConfig.cookies.refresh);
    if (refreshToken) {
      try {
        const refreshed = await this.refreshSession({ refreshToken });
        return refreshed.user;
      } catch {
        this.clearAuthCookies();
        return null;
      }
    }

    return null;
  }

  async resendVerification(email: string): Promise<{ accepted: true }> {
    const normalized = this.normalizeEmail(email);
    const user = await this.users.findByEmail(normalized);
    if (!user || user.disabledAt || user.emailVerifiedAt) {
      return { accepted: true };
    }

    const verificationToken = this.createOpaqueToken();
    await this.emailVerificationTokens.invalidateOutstandingForUser(user.id, this.now());
    await this.emailVerificationTokens.create({
      userId: user.id,
      tokenHash: this.hashOpaqueToken(verificationToken),
      expiresAt: this.addSeconds(this.now(), authConfig.emailVerificationTtlSeconds),
    });

    await mailer.sendVerificationEmail(user.email, verificationToken, user.handle);
    return { accepted: true };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.users.findById(userId);
    if (!user || user.disabledAt) {
      throw new AuthServiceError("User not found", "NOT_FOUND");
    }
    const credentials = await this.users.findCredentialsByEmail(user.email);
    if (!credentials || !(await this.passwordService.verify(credentials.passwordHash, currentPassword))) {
      throw new AuthServiceError("Current password is incorrect", "INVALID_CREDENTIALS");
    }
    this.validatePassword(newPassword);
    const passwordHash = await this.passwordService.hash(newPassword);
    await this.users.updatePassword(userId, passwordHash);
    await this.sessions.revokeAllForUser(userId, this.now());
    this.clearAuthCookies();
  }

  async resetPassword(token: string, password: string): Promise<void> {
    this.validatePassword(password);
    const record = await this.passwordResetTokens.findUsableByHash(this.hashOpaqueToken(token), this.now());
    if (!record || !(await this.passwordResetTokens.consume(record.id, this.now(), this.now()))) {
      throw new AuthServiceError("Invalid or expired reset token", "INVALID_TOKEN");
    }

    const passwordHash = await this.passwordService.hash(password);
    await this.users.updatePassword(record.userId, passwordHash);
    await this.sessions.revokeAllForUser(record.userId, this.now());
    await this.passwordResetTokens.invalidateOutstandingForUser(record.userId, this.now());
    this.clearAuthCookies();
  }

  private createAuthResult(user: PersistedUser, session: SessionRecord, refreshToken: string): AuthResult {
    const accessToken = this.signAccessToken(user, session.id);
    return {
      user: this.toAuthenticatedUser(user, session.id),
      accessToken,
      refreshToken,
      expiresAt: session.expiresAt,
    };
  }

  private signAccessToken(user: PersistedUser, sessionId: string): string {
    return jwt.sign(
      { sub: user.id, role: this.toAppRole(user.role), sessionId, type: "access" } satisfies AccessClaims,
      this.requireEnv("AUTH_JWT_SECRET"),
      { algorithm: "HS256", expiresIn: authConfig.accessTokenTtlSeconds },
    );
  }

  private signRefreshToken(userId: string, tokenVersion: number, expiresAt: Date, sessionId: string): string {
    const seconds = Math.max(1, Math.floor((expiresAt.getTime() - this.now().getTime()) / 1000));
    return jwt.sign(
      { sub: userId, sessionId, tokenVersion, type: "refresh" },
      this.requireEnv("AUTH_REFRESH_SECRET"),
      { algorithm: "HS256", expiresIn: seconds },
    );
  }

  private verifyRefreshToken(token: string): RefreshClaims {
    try {
      const payload = jwt.verify(token, this.requireEnv("AUTH_REFRESH_SECRET"), { algorithms: ["HS256"] });
      if (
        typeof payload === "string" ||
        payload.type !== "refresh" ||
        typeof payload.sub !== "string" ||
        typeof payload.sessionId !== "string" ||
        typeof payload.tokenVersion !== "number"
      ) {
        throw new Error("Invalid claims");
      }
      return payload as RefreshClaims;
    } catch (error) {
      throw new AuthServiceError("Invalid refresh token", "INVALID_TOKEN", { cause: error });
    }
  }

  private writeAuthCookies(result: AuthResult, rememberMe: boolean): void {
    if (!this.cookieStore) return;
    try {
      const secure = process.env.NODE_ENV === "production";
      this.cookieStore.set(authConfig.cookies.access, result.accessToken, {
        httpOnly: true,
        secure,
        sameSite: "strict",
        path: "/",
        maxAge: authConfig.accessTokenTtlSeconds,
      });
      this.cookieStore.set(authConfig.cookies.refresh, result.refreshToken, {
        httpOnly: true,
        secure,
        sameSite: "strict",
        path: "/",
        maxAge: rememberMe ? authConfig.rememberMeSessionTtlSeconds : authConfig.sessionTtlSeconds,
      });
    } catch {
      // Ignore if called in read-only render context
    }
  }

  private clearAuthCookies(): void {
    try {
      this.cookieStore?.delete(authConfig.cookies.access);
      this.cookieStore?.delete(authConfig.cookies.refresh);
    } catch {
      // Ignore in read-only render context
    }
  }

  private toAuthenticatedUser(user: PersistedUser, sessionId: string): AuthenticatedUser {
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      handle: user.handle,
      role: this.toAppRole(user.role),
      emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
      sessionId,
    };
  }

  private toAppRole(role: PersistedUser["role"]): UserRole {
    return role.toLowerCase() as UserRole;
  }

  private createOpaqueToken(): string {
    return randomBytes(32).toString("base64url");
  }

  private hashOpaqueToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  private normalizeEmail(email: string): string {
    const normalized = email.trim().toLowerCase();
    if (!normalized || !normalized.includes("@")) {
      throw new AuthServiceError("A valid email is required", "INVALID_INPUT");
    }
    return normalized;
  }

  private validateSignup(displayName: string, handle: string, password: string): void {
    if (!displayName.trim() || !handle || !/^[a-z0-9_]{3,30}$/.test(handle)) {
      throw new AuthServiceError("Invalid signup details", "INVALID_INPUT");
    }
    this.validatePassword(password);
  }

  private validatePassword(password: string): void {
    if (password.length < 8 || password.length > 128) {
      throw new AuthServiceError("Password must be between 8 and 128 characters", "INVALID_INPUT");
    }
  }

  private addSeconds(date: Date, seconds: number): Date {
    return new Date(date.getTime() + seconds * 1000);
  }

  private requireEnv(name: "AUTH_JWT_SECRET" | "AUTH_REFRESH_SECRET"): string {
    const value = process.env[name];
    if (!value) throw new AuthServiceError(`Missing ${name}`, "INVALID_INPUT");
    return value;
  }
}