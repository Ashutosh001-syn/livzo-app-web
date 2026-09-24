# Authentication Server Boundary

This folder owns authentication use cases and must remain server-only.

## Planned modules

- `password.ts`: Argon2id hashing and password verification.
- `tokens.ts`: Short-lived JWT access tokens and rotating refresh tokens using `jose`.
- `sessions.ts`: Session creation, rotation, revocation, and device metadata.
- `verification.ts`: Single-use email verification tokens.
- `password-reset.ts`: Single-use password reset tokens.
- `guards.ts`: Authenticated-user and role authorization helpers.
- `cookies.ts`: Secure cookie serialization and clearing.
- `service.ts`: Use-case orchestration; route handlers should call this layer.

Never import this boundary into a client component. Never return password hashes, token hashes, or provider secrets from it.
