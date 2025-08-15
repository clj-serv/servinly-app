#!/usr/bin/env bash
set -euo pipefail

[ "${SKIP_CI_CHECK:-0}" = "1" ] && { echo "Skipping CI prereq check."; exit 0; }

need() { command -v "$1" >/dev/null || { echo "Missing $1"; exit 1; }; }
need git; need gh; need jq

echo "Checking gh auth…"
gh auth status >/dev/null || { echo 'Run: gh auth login --web --scopes "repo,workflow"'; exit 1; }

REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || true)"
[ -z "$REPO" ] && REPO="$(git config --get remote.origin.url | sed -E 's/.*github.com[/:]([^/]+\/[^.]+).*/\1/')"
[ -z "$REPO" ] && { echo "Cannot determine repo."; exit 1; }
echo "Repo: $REPO"

ENV_NAME="${GITHUB_ENVIRONMENT:-}"   # optional, e.g. staging

has_secret_repo() { gh api "repos/$REPO/actions/secrets" --paginate -q '.secrets[].name' | grep -Fxq "$1"; }
has_secret_env()  { [ -z "$ENV_NAME" ] && return 1; gh api "repos/$REPO/environments/$ENV_NAME/secrets" --paginate -q '.secrets[].name' 2>/dev/null | grep -Fxq "$1"; }

miss=()
for s in VERCEL_TOKEN SUPABASE_STAGING_DB_URL SUPABASE_PROD_DB_URL; do
  if has_secret_repo "$s" || has_secret_env "$s"; then
    echo "✓ $s found"
  else
    echo "✗ $s missing"
    miss+=("$s")
  fi
done

if [ "${#miss[@]}" -gt 0 ]; then
  echo "Missing: ${miss[*]}"
  echo 'If you used Environment secrets, set GITHUB_ENVIRONMENT=staging (or production) before running.'
  echo 'Or bypass with: SKIP_CI_CHECK=1 npm run ci:staging'
  exit 1
fi

echo "OK: secrets available."
