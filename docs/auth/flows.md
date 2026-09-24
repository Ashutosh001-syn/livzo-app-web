# Authentication Flows

## Email signup

1. Validate email, display name, handle, password, and consent with a shared server schema.
2. Normalize email and handle; reject duplicates without leaking whether an account exists.
3. Hash the password with Argon2id.
4. Create the user and password account in one transaction.
5. Create a single-use hashed email-verification token and enqueue email delivery.
6. Create a session only after the requested product policy allows unverified access.
7. Set secure cookies and return the minimal user/session response.

## Email login

1. Rate-limit by IP and normalized account identifier.
2. Find the password account and verify Argon2id hash.
3. Return the same generic failure for unknown email and invalid password.
4. Create a session with a 30-day default TTL or 90-day `rememberMe` TTL.
5. Issue a short-lived access token and rotating refresh token.
6. Audit success and failure without storing secrets.

## Refresh and logout

- Refresh validates the session, token hash, expiry, revocation state, and user token version.
- Rotate the refresh token atomically and revoke the old session token.
- Logout revokes the current session and clears all auth cookies.
- Password change, reset, account disable, and suspicious-login response increment `token_version` and revoke active sessions.

## Password reset and verification

All emailed tokens are random, single-use, hashed at rest, short-lived, and consumed transactionally. Responses must not reveal whether an email exists.
