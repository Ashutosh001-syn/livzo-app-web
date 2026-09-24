# Auth API Contract

All responses use `{ data, error }` and a stable machine-readable error code. Validation failures return field-safe details; authentication failures remain generic.

| Method | Route                           | Purpose                                         |
| ------ | ------------------------------- | ----------------------------------------------- |
| POST   | `/api/auth/signup`              | Create password identity and start verification |
| POST   | `/api/auth/login`               | Authenticate email/password with `rememberMe`   |
| POST   | `/api/auth/verify-email`        | Consume verification token                      |
| POST   | `/api/auth/resend-verification` | Issue a replacement verification token          |
| POST   | `/api/auth/forgot-password`     | Always return generic success                   |
| POST   | `/api/auth/reset-password`      | Consume reset token and revoke sessions         |

Session infrastructure (`refresh`, `logout`, and `session`) is a required internal boundary and should be added alongside login before protected product routes are enabled.

Protected route policy:

- `USER`: authenticated platform access.
- `HOST`: creator/studio access when the creator product is introduced.
- `ADMIN`: moderation, account, and operational controls.

Authorization belongs in server guards, never only in client route visibility.
