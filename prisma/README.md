# Prisma Ownership

- `schema.prisma` is the canonical database model.
- `prisma generate` updates the typed client.
- `prisma migrate dev` is for local migration development.
- `prisma migrate deploy` is the production deployment command.
- Application code must import the singleton from `src/server/db/prisma.ts`.
- Do not instantiate `PrismaClient` in route handlers or client components.
