# Branch ↔ Environment Mapping

- `staging` → Supabase: servinly-staging, Vercel: Preview
- `main`    → Supabase: servinly (prod), Vercel: Production

## Secrets Required in GitHub

Secrets (GitHub → Settings → Secrets and variables → Actions):
- `VERCEL_TOKEN`
- `SUPABASE_STAGING_DB_URL`
- `SUPABASE_PROD_DB_URL`

## Deploy Rule

Stage first, then promote to prod after sign-off.

## Setup Instructions

After merge you must set secrets (UI/CLI):
- `VERCEL_TOKEN` (account/project token)
- `SUPABASE_STAGING_DB_URL` and `SUPABASE_PROD_DB_URL` (per doc)
