# Server Architecture

`src/server` is server-only application code. Keep secrets, database access, token signing, password hashing, OAuth exchanges, and authorization checks out of React components and browser bundles.

Authentication flow ownership:

`Route Handler -> input schema -> auth service -> repository -> PostgreSQL -> secure cookies`

No route handler should duplicate authentication policy.
