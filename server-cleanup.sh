#!/bin/bash

# Server Cleanup Script for Servinly App
# This script helps prevent port conflicts by cleaning up stale processes

echo "🧹 Cleaning up development server processes..."

# Kill any processes using ports 3000 and 3001
echo "Checking for processes on port 3000..."
if lsof -i :3000 > /dev/null 2>&1; then
    echo "Found process on port 3000, terminating..."
    lsof -ti :3000 | xargs kill -9
    echo "✅ Port 3000 cleared"
else
    echo "✅ Port 3000 is already free"
fi

echo "Checking for processes on port 3001..."
if lsof -i :3001 > /dev/null 2>&1; then
    echo "Found process on port 3001, terminating..."
    lsof -ti :3001 | xargs kill -9
    echo "✅ Port 3001 cleared"
else
    echo "✅ Port 3001 is already free"
fi

# Kill any Next.js development processes
echo "Cleaning up Next.js processes..."
pkill -f "next dev" 2>/dev/null || echo "No Next.js dev processes found"

# Clear Next.js cache to prevent stale builds
echo "Clearing Next.js cache..."
rm -rf .next
rm -rf node_modules/.cache 2>/dev/null || true

# Remove any PID files
echo "Removing PID files..."
rm -f *.pid .next-server.pid server.pid dev-server.pid 2>/dev/null || true

echo "🎉 Cleanup complete! You can now start the development server with './scripts/dev-start.sh'"
