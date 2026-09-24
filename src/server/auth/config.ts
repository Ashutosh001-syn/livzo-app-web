export const authConfig = {
  accessTokenTtlSeconds: 15 * 60,
  sessionTtlSeconds: 30 * 24 * 60 * 60,
  rememberMeSessionTtlSeconds: 90 * 24 * 60 * 60,
  emailVerificationTtlSeconds: 24 * 60 * 60,
  passwordResetTtlSeconds: 60 * 60,
  cookies: {
    access: "livzo_access",
    refresh: "livzo_refresh",
    csrf: "livzo_csrf",
  },
} as const;

export const requiredAuthEnv = [
  "DATABASE_URL",
  "AUTH_JWT_SECRET",
  "AUTH_REFRESH_SECRET",
  "APP_URL",
] as const;
