# Role Engine (RE)

**Purpose**: Provide role/role-family content packs + deterministic ranking.

## 🏗️ Concepts

### RoleDescriptor
```typescript
type RoleDescriptor = {
  id: string;
  label: string;
  family: RoleFamily;
  active: boolean;
};
```

### ContentPack
```typescript
type ContentPack = {
  version: string;
  family: RoleFamily;
  shine: ShineOption[];
  scenarios: ScenarioOption[];
  vibe: VibeOption[];
  responsibilities: ResponsibilityGroup[];
};
```

## 🌐 Public APIs

### Get Content Pack
```typescript
function getPack(roleId: string, family: RoleFamily): ContentPack;
```

### Rank Responsibilities
```typescript
function rankResponsibilities(
  signals: OnboardingSignals, 
  pack: ContentPack
): RankedOutput;
```

## ➕ Add a Role

### Steps
1. **Add to content**: `src/content/roles.ts`
2. **Set active**: `active: true`
3. **Family pack**: Reuse existing or extend
4. **Optional flag**: `FEATURE_ROLE_<ROLE>` for gradual rollout

### Example
```typescript
// src/content/roles.ts
export const ROLES: RoleDescriptor[] = [
  // ... existing roles
  {
    id: "sommelier",
    label: "Sommelier",
    family: "service",
    active: true
  }
];
```

## 🗑️ Retire a Role

### Action
```typescript
// Set active: false (don't delete)
{
  id: "old-role",
  label: "Old Role",
  family: "legacy",
  active: false
}
```

### Benefits
- **No breaking changes**: Existing users keep data
- **Easy restoration**: Set `active: true` to restore
- **Data integrity**: No orphaned references

## 🛡️ Guarantees

- **Flow Engine unchanged**: Navigation logic independent of roles
- **Deterministic first-paint**: Content loads without API calls
- **AI polish later**: Enhancement optional, not blocking
- **Backward compatible**: Role changes don't break flows

##  Feature Flags

### Role-Specific
```bash
FEATURE_ROLE_SOMMELIER=true
FEATURE_ROLE_MIXOLOGIST=true
FEATURE_ROLE_CONCIERGE=true
```

### Engine Features
```bash
FEATURE_RE_V2=true          # New ranking algorithms
FEATURE_RE_CONTENT_CACHE=true # Content caching
```

## 📊 Ranking Algorithm

### Deterministic Scoring
```typescript
function rankResponsibilities(signals: OnboardingSignals, pack: ContentPack) {
  const scores = pack.responsibilities.map(resp => ({
    id: resp.id,
    score: calculateScore(resp, signals),
    confidence: calculateConfidence(resp, signals)
  }));
  
  return scores.sort((a, b) => b.score - a.score);
}
```

### Score Calculation
```typescript
function calculateScore(resp: Responsibility, signals: OnboardingSignals) {
  let score = 0;
  
  // Trait alignment
  score += getTraitAlignment(resp, signals.shineKeys);
  
  // Scenario fit
  score += getScenarioFit(resp, signals.busyKeys);
  
  // Vibe match
  score += getVibeMatch(resp, signals.vibeKey);
  
  return Math.max(0, Math.min(100, score));
}
```

## 🔄 Content Updates

### Version Management
```typescript
type ContentVersion = {
  major: number;
  minor: number;
  patch: number;
  date: string;
};

// Content packs carry version for cache invalidation
const pack: ContentPack = {
  version: "2025.8.14",
  family: "service",
  // ... content
};
```

### Cache Strategy
```typescript
// Cache by role + family + version
const cacheKey = `${roleId}:${family}:${pack.version}`;
const cached = await cache.get(cacheKey);

if (cached) return cached;

// Generate and cache
const pack = generatePack(roleId, family);
await cache.set(cacheKey, pack, '24h');
return pack;
```

## ✅ Done Means Checklist

For any role/content update:

- [ ] **Role added** to `content/roles.ts` with `active: true`
- [ ] **Content pack** complete for all steps (shine, scenarios, vibe, responsibilities)
- [ ] **Family alignment** consistent with existing roles
- [ ] **Feature flag** added if role-specific logic needed
- [ ] **TypeScript types** updated and complete
- [ ] **Unit tests** cover new content and ranking
- [ ] **Performance** under 50ms for content retrieval
- [ ] **Cache invalidation** handles version updates
- [ ] **Backward compatibility** maintained
- [ ] **Documentation** updated

## 🔗 Related

- **Content**: `src/content/roles.ts`, `src/content/onboarding.ts`
- **Flow**: `src/config/onboarding.flow.ts`
- **API**: `/api/roles/[id]` endpoint
- **Storage**: Role metadata in database
- **Flags**: `FEATURE_ROLE_*` for gradual rollout
