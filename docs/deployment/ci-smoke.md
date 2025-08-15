# CI Smoke (Staging)

1) `gh auth login --web --scopes "repo,workflow"`
2) `npm run ci:check`
3) `npm run ci:staging`

Open run: `gh run view --web` • Watch: `gh run watch --exit-status`
