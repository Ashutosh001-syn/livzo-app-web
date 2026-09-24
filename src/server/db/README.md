# Database Server Boundary

PostgreSQL access belongs here. Route handlers must not construct SQL directly.

- `client.ts`: one pooled server-side PostgreSQL client.
- `queries/`: parameterized query modules grouped by aggregate.
- `repositories/`: persistence interfaces used by auth services.
- `migrations/`: ordered SQL migrations.
- `transaction.ts`: transaction helper for multi-write auth operations.

The initial auth schema is defined in `db/migrations/0001_auth.sql`.
