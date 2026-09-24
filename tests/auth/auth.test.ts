import { test, describe, before } from "node:test";
import assert from "node:assert/strict";

// Configure test environment secrets
process.env.AUTH_JWT_SECRET = "test-jwt-secret-for-integration-tests-at-least-32-chars";
process.env.AUTH_REFRESH_SECRET = "test-refresh-secret-for-integration-tests-32-chars";
process.env.APP_URL = "http://localhost:3000";

import { AuthService, AuthServiceError } from "../../src/server/auth/service";
import { verifyJwtEdge } from "../../src/server/auth/token-verifier";
import type { CookieStore } from "../../src/server/auth/cookies";

describe("Production Authentication System Integration Tests", () => {
  let mockCookies: Map<string, string>;
  let cookieStore: CookieStore;
  let authService: AuthService;

  before(() => {
    mockCookies = new Map();
    cookieStore = {
      get(name) {
        return mockCookies.get(name);
      },
      set(name, value) {
        mockCookies.set(name, value);
      },
      delete(name) {
        mockCookies.delete(name);
      },
    };
    authService = new AuthService({ cookies: cookieStore });
  });

  const testUser = {
    displayName: "Luna Streamer",
    handle: "lunastream",
    email: "luna@livzo.test",
    password: "Password123!",
  };

  test("1. Signup creates user, hashes password, and returns verification token", async () => {
    const result = await authService.signup(testUser);

    assert.ok(result.user.id, "User ID should be defined");
    assert.equal(result.user.email, testUser.email);
    assert.equal(result.user.handle, testUser.handle);
    assert.equal(result.user.displayName, testUser.displayName);
    assert.ok(result.verificationToken, "Verification token should be generated");
  });

  test("2. Signup rejects duplicate email and handle", async () => {
    await assert.rejects(
      async () => {
        await authService.signup({
          ...testUser,
          handle: "different_handle",
        });
      },
      (err: unknown) => {
        assert.ok(err instanceof Error);
        return true;
      },
    );

    await assert.rejects(
      async () => {
        await authService.signup({
          ...testUser,
          email: "different@livzo.test",
        });
      },
      (err: unknown) => {
        assert.ok(err instanceof Error);
        return true;
      },
    );
  });

  test("3. Login rejects invalid password and succeeds with correct credentials", async () => {
    await assert.rejects(
      async () => {
        await authService.login({
          email: testUser.email,
          password: "WrongPassword999!",
        });
      },
      (err: unknown) => {
        assert.ok(err instanceof AuthServiceError);
        assert.equal(err.code, "INVALID_CREDENTIALS");
        return true;
      },
    );

    const loginResult = await authService.login({
      email: testUser.email,
      password: testUser.password,
      rememberMe: true,
      userAgent: "TestRunner/1.0",
      ipHash: "hash-of-127.0.0.1",
    });

    assert.ok(loginResult.accessToken, "Should return access token");
    assert.ok(loginResult.refreshToken, "Should return refresh token");
    assert.equal(loginResult.user.email, testUser.email);
    assert.equal(loginResult.user.role, "user");

    assert.ok(mockCookies.has("livzo_access"), "Access cookie should be set");
    assert.ok(mockCookies.has("livzo_refresh"), "Refresh cookie should be set");
  });

  test("4. Edge token verifier correctly verifies access JWT", async () => {
    const accessToken = mockCookies.get("livzo_access")!;
    const claims = await verifyJwtEdge<{ sub: string; role: string; type: string }>(
      accessToken,
      process.env.AUTH_JWT_SECRET!,
    );

    assert.ok(claims, "Claims should be decoded and verified");
    assert.equal(claims.type, "access");
    assert.equal(claims.role, "user");
  });

  test("5. getCurrentUser fetches user identity from cookies", async () => {
    const current = await authService.getCurrentUser();
    assert.ok(current, "Current user should be returned");
    assert.equal(current.email, testUser.email);
    assert.equal(current.handle, testUser.handle);
  });

  test("6. Refresh session rotates refresh token and issues new access token", async () => {
    const oldRefresh = mockCookies.get("livzo_refresh")!;
    const refreshResult = await authService.refreshSession();

    assert.ok(refreshResult.accessToken);
    assert.ok(refreshResult.refreshToken);
    assert.notEqual(refreshResult.refreshToken, oldRefresh, "Refresh token should rotate");
  });

  test("7. Email verification consumes token and marks user verified", async () => {
    const signupTwo = await authService.signup({
      displayName: "Verifier Test",
      handle: "verify_me",
      email: "verify@livzo.test",
      password: "ComplexPassword123!",
    });

    const verifiedUser = await authService.verifyEmail(signupTwo.verificationToken);
    assert.ok(verifiedUser.emailVerifiedAt, "emailVerifiedAt should be set");

    // Reusing the same token should fail
    await assert.rejects(
      async () => {
        await authService.verifyEmail(signupTwo.verificationToken);
      },
      (err: unknown) => {
        assert.ok(err instanceof AuthServiceError);
        assert.equal(err.code, "INVALID_TOKEN");
        return true;
      },
    );
  });

  test("8. Forgot password and reset password flow", async () => {
    const forgotResult = await authService.forgotPassword(testUser.email);
    assert.equal(forgotResult.accepted, true);
    assert.ok(forgotResult.resetToken, "Reset token should be returned in test mode");

    const newPassword = "BrandNewPassword2026!";
    await authService.resetPassword(forgotResult.resetToken!, newPassword);

    // Old password should fail
    await assert.rejects(
      async () => {
        await authService.login({
          email: testUser.email,
          password: testUser.password,
        });
      },
      (err: unknown) => {
        assert.ok(err instanceof AuthServiceError);
        assert.equal(err.code, "INVALID_CREDENTIALS");
        return true;
      },
    );

    // New password should succeed
    const newLogin = await authService.login({
      email: testUser.email,
      password: newPassword,
    });
    assert.ok(newLogin.accessToken);
  });

  test("9. Change password updates credentials for authenticated user", async () => {
    const current = await authService.getCurrentUser();
    assert.ok(current);

    const replacementPassword = "ChangedSecurePassword1!";
    await authService.changePassword(current.id, "BrandNewPassword2026!", replacementPassword);

    const loginAfterChange = await authService.login({
      email: testUser.email,
      password: replacementPassword,
    });
    assert.ok(loginAfterChange.accessToken);
  });

  test("10. Logout revokes session and clears cookies", async () => {
    await authService.logout();
    assert.equal(mockCookies.has("livzo_access"), false, "Access cookie should be removed");
    assert.equal(mockCookies.has("livzo_refresh"), false, "Refresh cookie should be removed");
  });
});
