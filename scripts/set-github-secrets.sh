#!/usr/bin/env bash
set -euo pipefail

: "${VERCEL_TOKEN:?Missing VERCEL_TOKEN}"
: "${SUPABASE_STAGING_DB_URL:?Missing SUPABASE_STAGING_DB_URL}"
: "${SUPABASE_PROD_DB_URL:?Missing SUPABASE_PROD_DB_URL}"

echo "Setting GitHub repo secrets…"
gh secret set VERCEL_TOKEN -b"$VERCEL_TOKEN"
gh secret set SUPABASE_STAGING_DB_URL -b"$SUPABASE_STAGING_DB_URL"
gh secret set SUPABASE_PROD_DB_URL -b"$SUPABASE_PROD_DB_URL"

echo "Done. Verify:"
gh secret list
