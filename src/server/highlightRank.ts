import type { TOnboardingSignals } from "@/contracts/onboarding";

// Stable tie-breaking utility using djb2 hash
function stableHash(text: string, signalsStr: string): number {
  let hash = 5381;
  const str = text + signalsStr;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
  }
  return Math.abs(hash);
}

export function rankHighlightSuggestions(signals: TOnboardingSignals, take = 5): string[] {
  // Use roleId + shineKeys + busyKeys + vibeKey for scoring.
  // Create a small, role-aware suggestion bank (bartender/server at minimum).
  // No Math.random; break ties with a stable hash on `text + JSON.stringify(signals)`.
  // Return top `take` strings.
  
  const suggestions = getSuggestionBank(signals.roleFamily || 'service');
  const signalsStr = JSON.stringify(signals);
  
  // Score each suggestion
  const scored = suggestions.map(text => ({
    text,
    score: calculateScore(text, signals, signalsStr)
  }));
  
  // Sort by score (highest first), then by stable hash for tie-breaking
  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return stableHash(b.text, signalsStr) - stableHash(a.text, signalsStr);
  });
  
  return scored.slice(0, take).map(item => item.text);
}

function getSuggestionBank(roleFamily: string): string[] {
  const banks: Record<string, string[]> = {
    bar: [
      "Provided exceptional customer service during peak hours",
      "Coordinated with kitchen and service staff for smooth operations", 
      "Maintained consistent drink quality and presentation standards",
      "Managed bar inventory and reduced waste by 15%",
      "Trained 3 new bartenders on company standards and procedures",
      "Created signature cocktails that increased revenue by 20%",
      "Handled high-volume service during weekend rushes",
      "Resolved customer complaints with professionalism and speed"
    ],
    service: [
      "Successfully managed tables of 20+ guests during busy events",
      "Accommodated special dietary requirements and preferences", 
      "Coordinated food timing with kitchen for optimal guest experience",
      "Increased average check size by 25% through strategic upselling",
      "Maintained 4.8+ star rating through attentive service",
      "Handled multiple sections during peak dinner service",
      "Built rapport with regular customers to ensure repeat business",
      "Trained new servers on menu knowledge and service standards"
    ],
    management: [
      "Led team of 15 staff members during high-volume periods",
      "Streamlined operations reducing service time by 20%",
      "Resolved 95% of customer complaints within 24 hours", 
      "Developed and implemented staff training program",
      "Managed $50K+ monthly revenue with 15% profit margin",
      "Reduced staff turnover by 30% through improved scheduling",
      "Implemented new POS system improving order accuracy",
      "Coordinated special events for up to 200 guests"
    ],
    kitchen: [
      "Maintained 99% food quality score during 200+ daily orders",
      "Reduced prep time by 30% through workflow optimization",
      "Achieved zero safety incidents over 12 months",
      "Reduced food waste by 25% through better inventory management", 
      "Coordinated with 8-person kitchen team during peak service",
      "Developed new menu items that increased customer satisfaction",
      "Maintained consistent portion control and presentation",
      "Trained junior cooks on proper food handling procedures"
    ]
  };
  
  return banks[roleFamily] || banks.service;
}

function calculateScore(text: string, signals: TOnboardingSignals, signalsStr: string): number {
  let score = 50; // Base score
  
  const textLower = text.toLowerCase();
  
  // Boost based on shine keys alignment
  signals.shineKeys.forEach(shineKey => {
    if (textLower.includes(shineKey.toLowerCase())) {
      score += 20;
    }
  });
  
  // Boost based on busy keys alignment  
  signals.busyKeys.forEach(busyKey => {
    if (textLower.includes(busyKey.toLowerCase())) {
      score += 15;
    }
  });
  
  // Boost based on vibe key alignment
  if (signals.vibeKey && textLower.includes(signals.vibeKey.toLowerCase())) {
    score += 10;
  }
  
  // Add stable tie-breaker (no randomness)
  score += stableHash(text, signalsStr) % 10;
  
  return Math.min(100, score);
}
