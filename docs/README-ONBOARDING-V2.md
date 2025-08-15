# Onboarding V2 — Architecture & Implementation Guide

**Contracts-first, role-aware onboarding that replays every time a user adds a role. Deterministic first paint; AI is optional and isolated.**

## 0) At a glance

- **Feature flag**: `NEXT_PUBLIC_FEATURE_ONBOARDING_V2_ROUTER` (default off)
- **Flows**: Full (first/different role) vs Short (same role)
- **Separation of concerns**:
  - **Flow Engine**: step order, routing, guards
  - **Role Engine**: role/role-family content packs + ranking
  - **Personality Engine** (optional): server API to derive trait vector + summary
- **Deterministic first paint**: No generic defaults, no auto-AI calls on load
- **Repeatable**: From Profile → "Add role" re-enters the same flow

## 1) Goals & non-goals

### Goals
- Rebuild a maintainable onboarding that supports every role addition
- Deliver role-aware copy and suggestions with no AI dependency
- Keep AI isolated (server-only), with graceful fallbacks and caching

### Non-goals (this version)
- Visual redesign
- Full DB dependency (uses storage adapter; Supabase optional)
- Jobs/social/org flows

## 2) Contracts (source of truth)

**File**: `src/contracts/onboarding.ts`

```typescript
import { z } from "zod";

export const OnboardingSignals = z.object({
  roleId: z.string(),          // 'bartender'
  roleFamily: z.string(),      // 'bar'
  shineKeys: z.array(z.string()).max(3).default([]),
  busyKeys: z.array(z.string()).max(2).default([]),
  vibeKey: z.string().optional(),
  orgName: z.string().optional(),
  startDate: z.string().optional(), // ISO
  endDate: z.string().optional(),   // ISO
  highlightText: z.string().optional(),
  responsibilities: z.array(z.string()).default([]),
});

export type TOnboardingSignals = z.infer<typeof OnboardingSignals>;

export type FlowStepId =
  | "ROLE_SELECT" | "SHINE" | "SCENARIO" | "VIBE"
  | "ORG" | "DATES" | "HIGHLIGHT" | "RESPONSIBILITIES" | "PREVIEW";

export type FlowKind = "FULL" | "SHORT";

export interface RankedResponsibility {
  id: string; 
  label: string; 
  group: string; 
  score: number; 
  pinned: boolean;
}

export interface RankedOutput {
  groupsSorted: Array<{ name: string; responsibilities: RankedResponsibility[] }>;
  pinnedIds: string[]; 
  recommendedMix: string[];
}

export interface HighlightSuggestion { 
  id: string; 
  text: string; 
  score: number; 
  tags: string[]; 
}
```

## 3) Flow definitions & routing

**File**: `src/config/onboarding.flow.ts`

- **Full flow**: `ROLE_SELECT` → `SHINE` → `SCENARIO` → `VIBE` → `ORG` → `DATES` → `HIGHLIGHT` → `RESPONSIBILITIES` → `PREVIEW`
- **Short flow**: `ROLE_SELECT` → `SHINE` (quick) → `VIBE` (quick) → `RESPONSIBILITIES` → `DATES` → `PREVIEW`

```typescript
export function decideFlow(prevRoleId: string | null, nextRoleId: string): "FULL"|"SHORT" {
  if (!prevRoleId) return "FULL";
  return prevRoleId === nextRoleId ? "SHORT" : "FULL";
}
```

**Router helpers**: `src/lib/onboardingRouter.ts`
- `getNextStep(flow, current, signals)`
- `getPrevStep(flow, current)`
- `guard(step, signals)` minimal prerequisites (e.g., must have roleId before SHINE)

**Hook**: `src/lib/useStepRouter.ts`
- URL-driven step, local draft save/restore, `goNext`, `goPrev`, `updateSignals`

## 4) Role Engine (content packs)

**Files**
- `src/role-engine/types.ts` — ContentPack (shine, scenarios, vibe, responsibilities)
- `src/role-engine/families/bar.ts`, `service.ts` — family packs
- `src/role-engine/registry.ts` — `getPack(roleId, family)`, `getAvailableRoles()`, `getRoleFamily(roleId)`
- `src/content/roles.ts` — role list `{ id, label, family, active }`

### Add/retire a role
1. Add an entry in `content/roles.ts` (set `active:true`)
2. If needed, extend/override a family pack in `families/*`
3. **No flow code changes required**

## 5) Deterministic ranking (server)

**Files**
- `src/server/rank.ts` — `rankResponsibilities(signals, pack): RankedOutput`
- `src/server/highlightRank.ts` — `rankHighlightSuggestions(signals, take): string[]`

**Rules**
- No `Math.random()` in SSR. Use a stable tie-breaker (hash of `item.id + roleId`)
- First paint must be personalized (no generic bartender list placeholder)

```typescript
// stableTieBreak.ts
export const stableTie = (s: string) =>
  [...s].reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0) % 7;
```

## 6) Pages & components

**Route**: `src/app/onboarding-v2/page.tsx`
- Reads searchParams (`step`, `role`, `prevRoleId`)
- **SSR**: for `HIGHLIGHT`/`RESPONSIBILITIES` fetch initial, personalized data via rankers
- Renders client shell `OnboardingClient`

**Client shell**: `src/app/onboarding-v2/OnboardingClient.tsx`
- Uses `useStepRouter`
- Progress: "Step {index+1} of {steps.length}" (no % math tricks)

**Step components**: `src/app/onboarding-v2/steps/*`
- `RoleSelect`, `HowYouShine`, `BusyShiftScenario`, `YourVibe`, `Organization`, `Dates`, `CareerHighlight`, `Responsibilities`, `Preview`

**Skeletons**: `src/components/SkeletonChips.tsx` for loading shimmer

### UX rules
- "Continue" disables until minimum selections met (e.g., ≥1 shine)
- No auto-AI calls on mount
- Personalized suggestions appear immediately (SSR/server action)

## 7) Personality Engine (optional)

**API**: `src/app/api/assess/route.ts`
- **Input**: `{ userId, signals, schema: "big5a@v1" | "hexaco@v1" }`
- **Output**: `{ schema, traits: [...], summary, version }`
- Deterministic first (rules), optional low-token LLM summary (server-only), cached
- Persist to `user_traits` when Supabase env present; otherwise noop

### When to call
- On Preview step (or after Step 4), behind flag `FEATURE_PE_CALL`
- If unavailable, show deterministic summary template

## 8) Persistence adapter

**File**: `src/lib/storage.ts`
- Dev/demo → localStorage
- When Supabase env/session present → write `profiles`, `user_experiences`, `user_traits` on Finalize
- Keep storage client-only; write server helpers later for Supabase

## 9) Re-entering onboarding ("Add another role")

**From** `/profile` → Add role
1. Navigate to `/onboarding-v2?step=ROLE_SELECT&prevRoleId=<lastRoleId>`
2. Flow decision: `decideFlow(prevRoleId, roleId)`
3. Short flow for same role ID; Full flow for different role

## 10) Testing (minimum)

### Unit
- `flow.test.ts`: `decideFlow()` and `guard()` cases
- `rank.test.ts`: same input → same output (determinism)

### Playwright (happy paths)
- New user → Full Flow → Preview renders personalized lists
- Add the same role → Short Flow → Responsibilities delta → Preview

## 11) Accessibility & microcopy

- Mobile-first tap targets, focus states, WCAG AA contrast
- Button labels consistent (Next, Back, Save & Continue)
- Light, optimistic tone: "Pick a few that sound like you—no wrong answers"

## 12) Feature flagging & safety

- `NEXT_PUBLIC_FEATURE_ONBOARDING_V2_ROUTER` gates the new router
- `FEATURE_PE_CALL` gates `/api/assess` usage
- If flags are off, legacy flow still works
- **Do not auto-call any AI endpoints**

## 13) Deployment checklist

1. Feature branch → PR → CI (typecheck, lint, tests)
2. Deploy to staging; click through both flows
3. Enable flag(s) in Vercel env for the preview
4. Merge after sign-off; keep flags configurable per environment

## 14) Troubleshooting

- **Generic suggestions on first paint**: verify SSR is using `rank*` functions and signals contain `roleId`/`roleFamily`
- **Hydration mismatch**: remove randomness; use `stableTie()` for tie-breaks
- **Looping steps**: check `guard()` prerequisites vs step wiring
- **Short flow not triggering**: ensure `prevRoleId` is passed in URL and used by `decideFlow()`

## 15) Mermaid overview (high level)

```mermaid
flowchart LR
  A[ROLE_SELECT] --> B{Flow?}
  B -->|FULL| C[SHINE] --> D[SCENARIO] --> E[VIBE] --> F[ORG] --> G[DATES] --> H[HIGHLIGHT] --> I[RESPONSIBILITIES] --> J[PREVIEW]
  B -->|SHORT| C2[SHINE (quick)] --> E2[VIBE (quick)] --> I2[RESPONSIBILITIES] --> G2[DATES] --> J2[PREVIEW]
```

## 16) Next steps (incremental)

- **Slice 1**: Contracts + router + flag
- **Slice 2**: Role Engine + deterministic SSR ranking
- **Slice 3**: Step components wired to packs (no AI)
- **Slice 4**: Preview + profile handoff
- **Slice 5**: `/api/assess` (optional) + caching + persistence on finalize

## Done means

- [ ] With flag ON, onboarding uses the new router
- [ ] First paint is personalized (no generic placeholders)
- [ ] Adding another role replays the workflow with Full/Short branching
- [ ] AI is optional and never blocks UI

---

## Quick Reference

### Key Files
```
src/contracts/onboarding.ts          # All types & schemas
src/config/onboarding.flow.ts        # Flow definitions
src/lib/onboardingRouter.ts          # Navigation logic
src/lib/useStepRouter.ts             # Client hook
src/role-engine/                     # Content packs
src/server/rank.ts                   # Deterministic ranking
src/app/onboarding-v2/               # Step components
```

This README provides a comprehensive guide for implementing and maintaining the Onboarding V2 workflow, with clear contracts, flow definitions, and implementation details that ensure deterministic first paint and optional AI integration.

### Feature Flags
```bash
NEXT_PUBLIC_FEATURE_ONBOARDING_V2_ROUTER=true  # Enable new router
FEATURE_PE_CALL=true                           # Enable personality assessment
```

### Flow Decision
```typescript
const flow = decideFlow(prevRoleId, roleId);
// prevRoleId === roleId → SHORT (quick confirm)
// prevRoleId !== roleId → FULL (complete flow)
```

### Adding a Role
1. Add to `src/content/roles.ts` with `active: true`
2. Content automatically available via `getPack(roleId, family)`
3. No flow code changes needed