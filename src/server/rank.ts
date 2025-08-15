import type { TOnboardingSignals, RankedOutput, RankedResponsibility } from "@/contracts/onboarding";
import type { ContentPack } from "@/role-engine/types";

// Stable tie-breaking utility
function stableTie(id: string, roleId: string): number {
  // Create a deterministic hash for consistent tie-breaking
  let hash = 0;
  const str = `${id}-${roleId}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash) % 100; // Return 0-99 for tie-breaking
}

export function rankResponsibilities(
  signals: TOnboardingSignals, 
  pack: ContentPack
): RankedOutput {
  const allResponsibilities: RankedResponsibility[] = [];
  
  // Flatten all responsibilities with scores
  pack.responsibilities.forEach(group => {
    group.items.forEach(item => {
      const score = calculateScore(item, signals);
      allResponsibilities.push({
        id: item.id,
        label: item.label,
        group: group.name,
        score,
        pinned: false
      });
    });
  });
  
  // Sort by score (highest first), then by stable tie-breaker
  allResponsibilities.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // Stable tie-breaking
    const tieA = stableTie(a.id, signals.roleId);
    const tieB = stableTie(b.id, signals.roleId);
    return tieB - tieA;
  });
  
  // Group by category and maintain order
  const groupsMap = new Map<string, RankedResponsibility[]>();
  allResponsibilities.forEach(resp => {
    if (!groupsMap.has(resp.group)) {
      groupsMap.set(resp.group, []);
    }
    groupsMap.get(resp.group)!.push(resp);
  });
  
  const groupsSorted = Array.from(groupsMap.entries()).map(([name, items]) => ({
    name,
    responsibilities: items
  }));
  
  // Pin top 3 highest scoring
  const pinnedIds = allResponsibilities.slice(0, 3).map(r => r.id);
  allResponsibilities.forEach(r => {
    r.pinned = pinnedIds.includes(r.id);
  });
  
  // Recommend mix of different groups
  const recommendedMix = getRecommendedMix(allResponsibilities, groupsSorted);
  
  return {
    groupsSorted,
    pinnedIds,
    recommendedMix
  };
}

function calculateScore(item: { id: string; label: string; tags: string[] }, signals: TOnboardingSignals): number {
  let score = 0;
  
  // Base score for all items
  score += 50;
  
  // Boost based on shine keys alignment
  signals.shineKeys.forEach(shineKey => {
    if (item.tags.some(tag => tag.includes(shineKey) || shineKey.includes(tag))) {
      score += 20;
    }
  });
  
  // Boost based on scenario alignment
  signals.busyKeys.forEach(busyKey => {
    if (item.tags.some(tag => tag.includes(busyKey) || busyKey.includes(tag))) {
      score += 15;
    }
  });
  
  // Boost based on vibe alignment
  if (signals.vibeKey && item.tags.some(tag => tag.includes(signals.vibeKey!) || signals.vibeKey!.includes(tag))) {
    score += 10;
  }
  
  // Add stable tie-breaker (no randomness)
  score += stableTie(item.id, signals.roleId);
  
  return Math.min(100, score);
}

function getRecommendedMix(
  responsibilities: RankedResponsibility[], 
  groups: Array<{ name: string; responsibilities: RankedResponsibility[] }>
): string[] {
  const mix: string[] = [];
  const groupCounts = new Map<string, number>();
  
  // Start with top 2 from each group
  groups.forEach(group => {
    const topItems = group.responsibilities.slice(0, 2);
    topItems.forEach(item => {
      mix.push(item.id);
      groupCounts.set(group.name, (groupCounts.get(group.name) || 0) + 1);
    });
  });
  
  // Add more from groups that have fewer items
  const maxPerGroup = Math.max(...Array.from(groupCounts.values()));
  groups.forEach(group => {
    const currentCount = groupCounts.get(group.name) || 0;
    if (currentCount < maxPerGroup) {
      const additionalItems = group.responsibilities.slice(2, 4);
      additionalItems.forEach(item => {
        if (mix.length < 8) { // Limit total recommendations
          mix.push(item.id);
        }
      });
    }
  });
  
  return mix.slice(0, 8); // Return max 8 recommendations
}
