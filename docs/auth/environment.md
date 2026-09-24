# Authentication Environment

Required server-only variables:

```env
DATABASE_URL=postgresql://...
AUTH_JWT_SECRET=...
AUTH_REFRESH_SECRET=...
APP_URL=https://livzo.com
EMAIL_FROM=auth@livzo.com
EMAIL_PROVIDER_API_KEY=...
```

Secrets must be supplied by the deployment secret manager. Never expose them with a `NEXT_PUBLIC_` prefix or commit a real `.env` file.
