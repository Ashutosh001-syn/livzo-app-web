# LivZo Database

PostgreSQL is the system of record for identity, sessions, roles, and auth audit events.

Apply migrations in lexical order with the team's migration runner. The first migration is `migrations/0001_auth.sql`.

Production rules:

- Use a dedicated least-privilege application role.
- Keep migrations immutable after release.
- Enable TLS for remote database connections.
- Back up encrypted databases and test restoration.
- Never expose database access to client components or route-handler callers.
