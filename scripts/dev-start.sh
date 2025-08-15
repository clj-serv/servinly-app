#!/bin/bash

# Development Server Startup Script for Servinly App
# This ensures a clean start every time

echo "🚀 Starting Servinly Development Server..."

# Step 1: Clean up any existing processes
echo "1. Cleaning up existing processes..."
./server-cleanup.sh

# Step 2: Clear Next.js cache
echo "2. Clearing Next.js cache..."
rm -rf .next
rm -rf node_modules/.cache 2>/dev/null || true

# Step 3: Ensure environment variables are set
echo "3. Setting up environment..."
if ! grep -q "NEXT_PUBLIC_FEATURE_ONBOARDING_V2_ROUTER=true" .env.local 2>/dev/null; then
    echo "NEXT_PUBLIC_FEATURE_ONBOARDING_V2_ROUTER=true" >> .env.local
fi

# Step 4: Start the development server on port 3001 (to avoid conflicts)
echo "4. Starting development server on port 3001..."
PORT=3001 npm run dev

echo "✅ Development server should be running on http://localhost:3001"
