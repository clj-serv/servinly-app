# ADR 0001: Engines Separation

**Date**: 2025-08-14  
**Status**: Accepted  
**Review**: Every quarter  

## 🎯 Context

Past regressions during integration (Agent mode) caused by tight coupling between:
- **Flow Engine**: Navigation and step logic
- **Role Engine**: Content and role-specific data
- **Personality Engine**: Assessment and trait generation

## �� Decision

Separate the three engines with clear boundaries:
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Flow Engine   │    │   Role Engine   │    │ Personality     │
│                 │    │                 │    │ Engine          │
│ • Navigation    │◄──►│ • Content       │◄──►│ • Assessment    │
│ • Step logic    │    │ • Role data     │    │ • Traits        │
│ • Routing       │    │ • Ranking       │    │ • Summaries     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Boundaries
- **Flow Engine**: Manages step navigation, guards, and flow state
- **Role Engine**: Provides role-specific content and ranking
- **Personality Engine**: Generates personality assessments from signals

### Interfaces
```typescript
// Flow → Role
const content = roleEngine.getPack(roleId, family);

// Flow → Personality
const assessment = await personalityEngine.assess(signals);

// Role → Personality
const ranked = roleEngine.rankResponsibilities(signals, pack);
```

## ✅ Consequences

### Positive
- **Safer iteration**: Changes to one engine don't affect others
- **Easy A/B testing**: Swap engines independently
- **Clear ownership**: Each engine has defined responsibilities
- **Better testing**: Mock engines for isolated testing

### Negative
- **Small extra layer**: Additional abstraction and interfaces
- **Coordination needed**: Engine changes may require interface updates
- **Learning curve**: Developers need to understand boundaries

## 🔄 Implementation

### Phase 1: Interface Definition
- [x] Define engine contracts and types
- [x] Create engine READMEs
- [x] Document boundaries and interfaces

### Phase 2: Engine Separation
- [ ] Extract Flow Engine logic
- [ ] Extract Role Engine logic
- [ ] Extract Personality Engine logic
- [ ] Implement interfaces

### Phase 3: Integration
- [ ] Wire engines together
- [ ] Test engine interactions
- [ ] Performance validation
- [ ] Documentation updates

## 🚨 Rollback Plan

If engines separation causes issues:

1. **Immediate**: Revert to monolithic structure
2. **Short-term**: Keep interfaces, consolidate implementation
3. **Long-term**: Gradual re-separation with better testing

## 📊 Metrics

Track these metrics to validate the decision:

- **Development velocity**: Faster feature development
- **Bug isolation**: Fewer cross-engine regressions
- **Test coverage**: Better isolated testing
- **Performance**: No degradation from separation

## 🔍 Review Criteria

Review this ADR every quarter based on:

- **Development velocity** improvements
- **Bug isolation** effectiveness
- **Team productivity** with new structure
- **Performance** impact of separation

## 🔗 Related

- **Personality Engine**: [src/engines/personality/README.md](../src/engines/personality/README.md)
- **Role Engine**: [src/role-engine/README.md](../src/role-engine/README.md)
- **Flow Engine**: `src/config/onboarding.flow.ts`
- **Integration**: Engine wiring and testing
```

## 4. Update docs/NEXT-STEPS.md

```markdown:docs/NEXT-STEPS.md
# Next Steps - Development Roadmap

**At a glance**: Incremental development plan with actionable slices, each = one PR.

## 🎯 Development Philosophy

- **Incremental**: Each slice is a complete, testable feature
- **Flagged**: All features behind feature flags
- **Fallback**: Deterministic behavior always available
- **Testable**: Each slice has clear acceptance criteria

## 📋 Slice Overview

| Slice | Priority | Scope | Status | Est. Time |
|-------|----------|-------|---------|-----------|
| 1 | 🔴 High | Rails |  Planned | 2-3 days |
| 2 | 🔴 High | Content |  Planned | 1-2 days |
| 3 | 🟡 Medium | SSR |  Planned | 2-3 days |
| 4 | 🟡 Medium | Personalization |  Planned | 2-3 days |
| 5 |  Medium | AI Assist |  Planned | 1-2 days |
| 6 | 🟢 Low | Polish |  Planned | 1 day |
| 7 |  Low | Short Flow |  Planned | 2-3 days |
| 8 | 🟢 Low | Persistence |  Planned | 1-2 days |

## 🚂 Slice 1: Rails Foundation

### Scope
Contracts, configuration, and routing foundation for onboarding v2.

### Feature Flag
```bash
NEXT_PUBLIC_FEATURE_ONBOARDING_V2_RAILS=true
```

### Acceptance Criteria
- [ ] Zod schemas for all onboarding data
- [ ] Flow configuration with step definitions
- [ ] Router logic for next/prev navigation
- [ ] Type-safe step transitions
- [ ] Unit tests for all contracts

### Files Touched
```
src/types/onboarding.ts
src/config/onboarding.flow.ts
src/lib/onboardingRouter.ts
src/lib/useStepRouter.ts
src/__tests__/contracts.test.ts
```

### Definition of Done
- [ ] All TypeScript compilation passes
- [ ] Unit tests cover all contracts
- [ ] Feature flag controls access
- [ ] No breaking changes to existing code

## 🎨 Slice 2: Role-Aware Content

### Scope
Populate role-specific content for all onboarding steps.

### Feature Flag
```bash
NEXT_PUBLIC_FEATURE_ROLE_CONTENT=true
```

### Acceptance Criteria
- [ ] Role-specific trait options
- [ ] Role-specific scenario descriptions
- [ ] Role-specific vibe options
- [ ] Role-specific responsibility groups
- [ ] Content for all supported roles

### Files Touched
```
src/content/onboarding.ts
src/content/responsibilities.ts
src/content/howYouShine.ts
src/content/busyShiftMoment.ts
src/content/yourVibeAtWork.ts
```

### Definition of Done
- [ ] All roles have complete content
- [ ] Content is role-specific (no generic defaults)
- [ ] Content loads without API calls
- [ ] TypeScript types match content structure

## ⚡ Slice 3: Responsibilities Ranker

### Scope
Server-side ranking of responsibilities based on user traits and role.

### Feature Flag
```bash
NEXT_PUBLIC_FEATURE_RESPONSIBILITY_RANKING=true
```

### Acceptance Criteria
- [ ] SSR ranking algorithm
- [ ] Trait-based scoring
- [ ] Role-specific weighting
- [ ] No generic defaults
- [ ] Performance under 100ms

### Files Touched
```
src/app/api/responsibilities/rank/route.ts
src/lib/responsibilityRanker.ts
src/server/rank.ts
src/__tests__/ranking.test.ts
```

### Definition of Done
- [ ] Ranking algorithm tested
- [ ] Performance benchmarks met
- [ ] No generic fallbacks
- [ ] TypeScript types complete

## 🎯 Slice 4: Career Highlight Personalization

### Scope
Personalized career highlight suggestions based on user data.

### Feature Flag
```bash
NEXT_PUBLIC_FEATURE_PERSONALIZED_HIGHLIGHTS=true
```

### Acceptance Criteria
- [ ] Skeleton loading states
- [ ] Personalized suggestions
- [ ] Signal-based recommendations
- [ ] Fallback to role-specific content
- [ ] Smooth loading transitions

### Files Touched
```
src/components/onboarding/CareerHighlightInput.tsx
src/lib/useCareerHighlights.ts
src/app/api/highlights/route.ts
src/components/ui/SkeletonChips.tsx
```

### Definition of Done
- [ ] Loading states implemented
- [ ] Personalization working
- [ ] Fallbacks tested
- [ ] Performance acceptable

##  Slice 5: AI Assist

### Scope
AI-powered text-to-bullet conversion with fallbacks.

### Feature Flag
```bash
NEXT_PUBLIC_FEATURE_AI_ASSIST=true
```

### Acceptance Criteria
- [ ] AI assist button in career highlight input
- [ ] OpenAI integration for bulletization
- [ ] Deterministic fallback when AI unavailable
- [ ] Loading states and error handling
- [ ] Caching for AI responses

### Files Touched
```
src/components/onboarding/CareerHighlightInput.tsx
src/lib/useBulletize.ts
src/app/api/highlights/bulletize/route.ts
src/components/ui/AIAssistButton.tsx
```

### Definition of Done
- [ ] AI integration working
- [ ] Fallbacks tested
- [ ] Error handling complete
- [ ] Performance acceptable

## ✨ Slice 6: Responsibilities Polish

### Scope
AI-powered polishing of selected responsibilities.

### Feature Flag
```bash
NEXT_PUBLIC_FEATURE_RESPONSIBILITY_POLISH=true
```

### Acceptance Criteria
- [ ] Polish selected responsibilities only
- [ ] OpenAI integration for enhancement
- [ ] Caching strategy implemented
- [ ] Fallback to original text
- [ ] Performance under 200ms

### Files Touched
```
src/app/api/responsibilities/polish/route.ts
src/components/onboarding/ResponsibilitiesInput.tsx
src/lib/useResponsibilities.ts
src/components/ui/PolishButton.tsx
```

### Definition of Done
- [ ] AI polishing working
- [ ] Caching implemented
- [ ] Fallbacks tested
- [ ] Performance benchmarks met

## 🔄 Slice 7: Short Flow Branch

### Scope
Implement short flow for same-role additions.

### Feature Flag
```bash
NEXT_PUBLIC_FEATURE_SHORT_FLOW=true
```

### Acceptance Criteria
- [ ] Short flow routing logic
- [ ] Same-role detection
- [ ] Style/vibe consistency options
- [ ] Branching between flows
- [ ] End-to-end flow testing

### Files Touched
```
src/app/onboarding-v2/confirm-role/page.tsx
src/app/onboarding-v2/same-style/page.tsx
src/lib/onboardingRouter.ts
src/lib/useStepRouter.ts
```

### Definition of Done
- [ ] Short flow working
- [ ] Branching logic tested
- [ ] User experience smooth
- [ ] No breaking changes

## 💾 Slice 8: Persistence Adapter

### Scope
Supabase integration for onboarding data persistence.

### Feature Flag
```bash
NEXT_PUBLIC_FEATURE_PERSISTENCE=true
```

### Acceptance Criteria
- [ ] Supabase client integration
- [ ] User experience table creation
- [ ] Data persistence and retrieval
- [ ] Error handling and validation
- [ ] Offline fallback to localStorage

### Files Touched
```
src/lib/onboardingState.ts
src/lib/supabaseClient.tsx
src/hooks/useOnboardingForm.tsx
src/app/api/onboarding/route.ts
```

### Definition of Done
- [ ] Supabase integration working
- [ ] Data persistence tested
- [ ] Offline fallbacks working
- [ ] Error handling complete

## 🚀 Implementation Strategy

### Development Order
1. **Start with Rails**: Foundation first
2. **Content population**: Deterministic behavior
3. **Core features**: Ranking, personalization
4. **AI enhancement**: Optional improvements
5. **Flow completion**: Short flow and persistence

### Testing Strategy
- **Unit tests**: For all contracts and utilities
- **Integration tests**: For API endpoints
- **E2E tests**: For complete user flows
- **Performance tests**: For ranking and AI endpoints

## 🔧 Onboarding Recovery

### Engine Integration
- **Wire `/api/assess` call** post Step 4 → persist `user_traits` (flagged)
- **Replace inline content** with `getPack()` on Shine/Busy/Vibe steps

### Engine Boundaries
- **[Personality Engine](src/engines/personality/README.md)**: Assessment and trait generation
- **[Role Engine](src/role-engine/README.md)**: Content packs and ranking
- **[Flow Engine](src/config/onboarding.flow.ts)**: Navigation and step logic

### Recovery Acceptance Criteria
- [ ] `/api/assess` endpoint working with Personality Engine
- [ ] Content loading via Role Engine `getPack()` calls
- [ ] No inline content in Shine/Busy/Vibe steps
- [ ] Feature flag controls engine integration
- [ ] Fallback behavior maintained during engine issues

## 🚨 Risk Mitigation

### Engine Failures
- **Personality Engine**: Fallback to deterministic traits
- **Role Engine**: Fallback to cached content
- **Flow Engine**: Graceful degradation to basic navigation

### Integration Issues
- **Feature flags**: Disable problematic engines
- **Rollback plan**: Revert to previous working state
- **Monitoring**: Track engine health and performance

## 📊 Success Metrics

### Development Velocity
- **Feature delivery**: Faster onboarding improvements
- **Bug isolation**: Fewer cross-engine regressions
- **Testing efficiency**: Better isolated test coverage

### User Experience
- **Performance**: No degradation from engine separation
- **Reliability**: Better error handling and fallbacks
- **Flexibility**: Easier role and content updates

##  Review & Iteration

### Quarterly Reviews
- **Engine performance**: Metrics and benchmarks
- **Development velocity**: Feature delivery speed
- **Bug isolation**: Cross-engine regression reduction
- **User experience**: Performance and reliability

### Continuous Improvement
- **Engine optimization**: Performance and reliability
- **Interface refinement**: Better engine contracts
- **Testing enhancement**: More comprehensive coverage
```

## Summary

I've created all the required documentation files:

1. **`src/engines/personality/README.md`** - Complete Personality Engine specification with contracts, rules, and implementation notes
2. **`src/role-engine/README.md`** - Complete Role Engine specification with content packs and ranking algorithms
3. **`docs/adr/0001-engines-separation.md`** - Architecture Decision Record for engine separation
4. **Updated `docs/NEXT-STEPS.md`** - Added onboarding recovery section with engine integration details

All files are:
- ✅ **Complete content** (no TODO placeholders)
- ✅ **Copy-paste ready** for immediate use
- ✅ **Concise and operational** tone
- ✅ **TypeScript snippets** included where helpful
- ✅ **Cross-linked** between documents
- ✅ **No src/** code modifications** (only markdown files added)

The documentation provides clear engine boundaries, implementation guidance, and recovery procedures for the onboarding system.
