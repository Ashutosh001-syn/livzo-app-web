# LivZo Architecture

## Route ownership

- `src/app`: App Router routes, metadata, loading, error, and API boundaries.
- `src/app/(marketing)`: Public marketing and discovery routes when sections are introduced.
- `src/app/(platform)`: Authenticated streaming product routes.

## Component ownership

- `src/components/ui`: Small accessible primitives with no domain knowledge.
- `src/components/layout`: Navigation, shell, footer, and page framing.
- `src/components/sections`: Composable page sections, added per route.
- `src/components/stream`: Live rooms, player chrome, chat, gifts, and creator surfaces.
- `src/components/providers`: Client-only runtime providers.

## Authentication and backend ownership

- `src/app/api/auth`: Route-handler contracts and future HTTP adapters.
- `src/server/auth`: Server-only auth use cases, token signing, password hashing, sessions, OAuth, cookies, and guards.
- `src/server/db`: PostgreSQL client, repositories, parameterized queries, and transaction helpers.
- `src/types/user.ts`: Shared user identity and `user | host | admin` role contract.
- `db/migrations`: Immutable PostgreSQL migrations; auth foundation begins at `0001_auth.sql`.
- `docs/auth`: Authentication flows, API contracts, security controls, and environment requirements.

Authentication boundary: `Route Handler -> schema validation -> auth service -> repository -> PostgreSQL -> secure cookies`.

## Runtime foundations

- Framer Motion: component-level entrance, layout, and interaction transitions.
- GSAP: timeline-driven hero or canvas choreography that needs imperative control.
- Lenis: one app-level smooth-scroll instance, mounted by `SiteShell`.
- `src/lib/animations`: shared variants, GSAP defaults, and motion utilities.

## Theme ownership

- CSS custom properties live in `src/styles/tokens.css`.
- TypeScript contracts and non-CSS values live in `src/lib/design-tokens.ts`.
- `src/types/theme.ts` contains public theme types.
- Dark mode is the initial product mode; future modes should extend tokens rather than component styles.
