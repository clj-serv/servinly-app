import crypto from 'crypto';

/**
 * Generate a stable cache key for ranking based on signals
 */
export function cacheKeyForRanking(signals: {
  roleFamily: string;
  shineKeys: string[];
  busyKeys: string[];
  vibeKey?: string;
  highlightTags?: string[];
}): string {
  // Sort arrays for consistent hashing
  const sortedPayload = {
    ...signals,
    shineKeys: [...signals.shineKeys].sort(),
    busyKeys: [...signals.busyKeys].sort(),
    highlightTags: signals.highlightTags ? [...signals.highlightTags].sort() : [],
  };
  
  const payloadString = JSON.stringify(sortedPayload);
  return crypto.createHash('sha256').update(payloadString).digest('hex');
}

/**
 * Generate a stable cache key for polish requests
 */
export function cacheKeyForPolish(
  role: string, 
  selected: Array<{ id: string; label: string }>
): string {
  // Sort by ID for consistent hashing
  const sortedSelected = [...selected].sort((a, b) => a.id.localeCompare(b.id));
  
  const payload = {
    role,
    selected: sortedSelected,
  };
  
  const payloadString = JSON.stringify(payload);
  return crypto.createHash('sha256').update(payloadString).digest('hex');
}

/**
 * Generate a cache key for any data structure
 */
export function generateCacheKey(data: unknown): string {
  const dataString = JSON.stringify(data);
  return crypto.createHash('sha256').update(dataString).digest('hex');
}

/**
 * Cache TTL constants
 */
export const CACHE_TTL = {
  RANKING: 90 * 24 * 60 * 60 * 1000, // 90 days
  POLISH: 30 * 24 * 60 * 60 * 1000,  // 30 days
} as const;
