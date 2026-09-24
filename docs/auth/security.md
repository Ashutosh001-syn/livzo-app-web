# Security Architecture

- Passwords: Argon2id with a calibrated memory/time cost; never log or return hashes.
- JWTs: sign with `jose`; use an asymmetric key pair in production where possible, explicit issuer/audience, `sub`, `sessionId`, role, token type, `iat`, and `exp`; reject algorithm confusion.
- Refresh sessions: store only a SHA-256/HMAC hash of a cryptographically random token; rotate and detect reuse.
- Cookies: `HttpOnly`, `Secure` outside local development, explicit `SameSite`, narrow path/domain, and expiration aligned to session policy.
- CSRF: double-submit token or origin-bound protection for cookie-authenticated state changes.
- OAuth: authorization code + PKCE, state, nonce, issuer/audience validation, verified email policy, and strict redirect URI allowlist.
- Rate limits: IP plus account key for login/reset/verification; exponential backoff and provider abuse controls.
- Enumeration resistance: generic login, signup, verification resend, and reset responses.
- Data minimization: hash IP addresses with a rotating server salt; limit user-agent retention; redact tokens and authorization headers.
- Headers: CSP, HSTS in production, frame protection, referrer policy, content-type sniffing protection, and strict origin policy.
- Operations: audit authentication events, alert on refresh-token reuse and repeated failures, rotate secrets, and provide session revocation.
