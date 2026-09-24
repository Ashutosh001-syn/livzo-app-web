POST /api/auth/forgot-password

Always return a generic success response. If the account exists, create a hashed single-use PasswordResetToken and send the reset email.
