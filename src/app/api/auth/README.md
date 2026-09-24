# Authentication Route Handlers

Route handlers are transport adapters only. They validate input, enforce request limits, call `src/server/auth`, set cookies, and return an intentionally small response shape.

Planned routes:

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `GET /api/auth/session`
- `POST /api/auth/verify-email`
- `POST /api/auth/resend-verification`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

Each route must use the same origin policy, CSRF protection for cookie-authenticated mutations, rate limits, structured errors, and audit logging.
