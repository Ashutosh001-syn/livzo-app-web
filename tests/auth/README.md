# Authentication Test Plan

Add integration tests before exposing auth routes:

- Signup creates a USER and verification token transactionally.
- Duplicate email and handle responses do not leak account details.
- Login rejects disabled users and invalid credentials generically.
- Remember-me changes only the session TTL.
- Verification and reset tokens expire, are single-use, and are hashed at rest.
- Reset revokes sessions and increments `tokenVersion`.
- Refresh rotation detects token reuse.
- Secure cookie flags and CSRF checks are enforced.
- `USER`, `HOST`, and `ADMIN` guards authorize only their intended operations.
