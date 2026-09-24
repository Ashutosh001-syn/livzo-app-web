# Auth Schemas

Request validation belongs here. Each schema should normalize email/handle values, enforce password policy, reject unknown fields, and expose only field-safe validation errors to route handlers.

Planned schemas:

- `signup-schema.ts`
- `login-schema.ts`
- `forgot-password-schema.ts`
- `reset-password-schema.ts`
- `verify-email-schema.ts`

Shared field rules live in `fields.ts`. Use `safeParse` in route handlers and expose only the issue path and message; never return raw request values or stack traces.
