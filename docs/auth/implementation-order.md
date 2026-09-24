# Implementation Order

1. Install Prisma and generate the client.
2. Set `DATABASE_URL` and apply the first migration against PostgreSQL.
3. Add server-only Prisma repositories for users, sessions, and auth tokens.
4. Add request schemas and normalization for signup, login, forgot password, reset password, and verification.
5. Implement Argon2id password hashing and generic authentication errors.
6. Implement session creation, secure cookie serialization, JWT access tokens, refresh rotation, and revocation.
7. Implement email delivery adapters and single-use verification/reset tokens.
8. Implement the five route handlers under `src/app/api/auth`.
9. Add integration tests for duplicate signup, invalid credentials, token expiry/reuse, session rotation, role guards, and cookie flags.
10. Add observability, rate limiting, secret management, and deployment migration checks.

Do not build dashboard, wallet, gifts, or streaming modules until this boundary is tested and stable.
