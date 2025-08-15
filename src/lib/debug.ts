// src/lib/debug.ts
// Debug UI utilities for development builds

export function isDebugUIEnabled(): boolean {
  // Inlined at build-time; ensure explicit string comparison.
  const flag = process.env.NEXT_PUBLIC_DEBUG_UI;
  return process.env.NODE_ENV !== "production" && flag === "true";
}

export function getOriginSafely(): string {
  // Prevent hydration mismatch by checking if we're in browser
  if (typeof window === 'undefined') {
    return 'server';
  }
  return window.location.origin;
}
