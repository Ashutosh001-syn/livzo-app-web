export const authFlow = {
  signup: ["validate input", "hash password", "create USER transactionally", "issue verification token", "send verification email"],
  login: ["validate credentials", "create session", "issue access token", "set secure cookies"],
  forgotPassword: ["accept email", "create single-use token when account exists", "send email", "return generic response"],
  resetPassword: ["validate token", "hash replacement password", "consume token", "revoke sessions", "increment token version"],
  verifyEmail: ["validate token", "mark email verified", "consume token"],
} as const;
