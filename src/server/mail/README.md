# Mail Boundary

Email delivery is a server-only adapter. Authentication services should depend on an interface, not a provider SDK.

Required messages:

- Email verification
- Password reset

Delivery failures must be observable without exposing token values or account existence to the caller.
