# Servinly — Onboarding V2 Scaffold (ZIP)

This scaffold mirrors the minimal structure to preview the end‑to‑end onboarding flow in isolation.

## What’s inside
- `src/config/onboarding.flow.ts` — step IDs, route map, order
- `src/lib/onboardingRouter.ts` — helpers: `routeFor`, `getNextStep`, `canLeave`
- `src/lib/useStepRouter.ts` — Next.js client hook to advance the flow
- `src/components/layouts/OnboardingShell.tsx` — small, mobile‑first shell
- `src/app/onboarding-v2/...` — one page per step (scaffold)
- `src/app/ui-lab/onboarding-v2/page.tsx` — index with links to every step

## How to unzip into your repo (from repo root)
```bash
unzip -o tmp/servinly-onboarding-v2-scaffold.zip -d .
```

## Notes
- The scaffold is permissive (`canProceed` defaults to `true`) so you can click through.
- Replace titles/subtitles and wire real guards/validation as designs firm up.
- Paths use your `@/*` alias (`tsconfig.json` should map `@/*` -> `src/*`). 
