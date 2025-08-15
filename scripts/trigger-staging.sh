#!/usr/bin/env bash
set -euo pipefail
branch=${1:-staging}
./scripts/check-ci-prereqs.sh
git checkout "$branch" 2>/dev/null || git checkout -b "$branch"
mkdir -p ops/changes
ts=$(date -u +"%Y%m%d-%H%M%S")
echo "- CI smoke $(date -u)" > "ops/changes/${ts}-staging-smoke.md"
git add ops/changes && git commit -m "ci: staging smoke ${ts}" || true
git push -u origin "$branch"
echo "Opening latest workflow run in browser…"
gh run view --web || true
echo "Follow logs with: gh run watch --exit-status"
