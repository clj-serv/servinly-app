# Development Server Management

This document outlines how to prevent and resolve the broken version conflicts in the Servinly app.

## Problem Solved

Previously, a broken version of the app would persist on port 3000, while the correct version needed to run on port 3001. This has been resolved with automated cleanup and prevention measures.

## Quick Start (Recommended)

```bash
# Clean start with automatic cleanup
npm run dev:clean
```

This will:
1. Kill any existing processes on ports 3000/3001
2. Clear Next.js cache and build artifacts
3. Set required environment variables
4. Start the server on port 3001 (conflict-free)

## Alternative Commands

```bash
# Manual cleanup first, then start
npm run cleanup
npm run dev:3001

# Standard development (may conflict)
npm run dev

# Direct port 3001 start
npm run dev:3001
```

## Root Cause Prevention

### 1. Cache Clearing
The broken version often persists due to stale Next.js builds. Our cleanup process removes:
- `.next/` directory
- `node_modules/.cache/`
- Any PID files

### 2. Process Management
- Kills all processes on ports 3000 and 3001
- Terminates any `next dev` processes
- Removes process ID files

### 3. Environment Consistency
- Ensures `NEXT_PUBLIC_FEATURE_ONBOARDING_V2_ROUTER=true`
- Uses port 3001 by default to avoid conflicts

## Files Created

- `scripts/dev-start.sh` - Comprehensive startup script
- `server-cleanup.sh` - Enhanced cleanup with cache clearing
- Updated `.gitignore` - Ignores PID files and cache
- Updated `package.json` - New npm scripts

## Why Port 3001?

Port 3001 is used as the default to avoid conflicts with:
- Other Next.js projects that default to 3000
- System services that may claim port 3000
- IDE processes that might start servers automatically

## Troubleshooting

If you still encounter the broken version:

1. Run full cleanup: `npm run cleanup`
2. Check for other project instances: `find ~ -name "servinly-app*" -type d`
3. Restart your IDE/terminal
4. Use the clean start: `npm run dev:clean`

## Debug UI Control

The app includes debug UI components that are gated by environment variables:

```bash
# Debug UI is OFF by default
NEXT_PUBLIC_DEBUG_UI=false

# To enable debug UI in development
NEXT_PUBLIC_DEBUG_UI=true
```

**Important**: After changing `NEXT_PUBLIC_DEBUG_UI`, restart the dev server as environment variables are baked at build time.

Debug UI includes:
- Client State Report component
- DEV BUILD footer banner
- Additional debug overlays

## Future Prevention

- Always use `npm run dev:clean` for development
- Never run multiple instances simultaneously
- Use the cleanup script before switching branches
- Keep the `.next` directory in `.gitignore`
