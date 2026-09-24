# LivZo Authentication Architecture

## Identity model

- `users` is the canonical identity record.
- Email/password is the initial identity provider. Social providers remain a future extension and are intentionally outside this architecture pass.
- `sessions` stores hashed rotating refresh tokens and device metadata.
- Access tokens are short-lived JWTs; refresh tokens are opaque random values rotated against a database session. The database stores only a hash.
- Roles are `user`, `host`, and `admin`.

## Browser token strategy

- Access token: `HttpOnly`, `Secure` in production, `SameSite=Lax`, short TTL.
- Refresh token: `HttpOnly`, `Secure` in production, `SameSite=Strict`, path scoped to `/api/auth` where practical, rotated on every refresh.
- CSRF token: non-HttpOnly cookie paired with an `X-CSRF-Token` header on cookie-authenticated mutations.
- Do not store credentials or JWTs in `localStorage` or `sessionStorage`.

See [flows.md](flows.md), [api.md](api.md), and [security.md](security.md).

The service layer must enforce that a password account has a password hash and an OAuth-only account has a linked provider record; this cross-table invariant is intentionally not represented as an invalid PostgreSQL `CHECK` subquery.
