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
| 1 | 🔴 High | Rails | �� Planned | 2-3 days |
| 2 | 🔴 High | Content | �� Planned | 1-2 days |
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



