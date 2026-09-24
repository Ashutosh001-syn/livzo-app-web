POST /api/auth/reset-password

Validate and consume a PasswordResetToken transactionally, replace the Argon2id password hash, revoke sessions, and increment tokenVersion.
