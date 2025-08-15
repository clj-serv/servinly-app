// Highlight keyword mapping for responsibility analysis
export const HIGHLIGHT_KEYWORDS: Record<string, string[]> = {
  creative: ["cocktail", "menu", "recipe", "special", "design", "create", "innovate", "develop", "art", "presentation"],
  leadership: ["train", "mentor", "lead", "supervise", "guide", "coach", "manage", "direct", "motivate", "inspire"],
  guest_comms: ["vip", "complaint", "guest issue", "resolve", "handle", "manage", "assist", "help", "customer", "service"],
  ops_cost: ["inventory", "wastage", "cost", "efficiency", "reduce", "optimize", "save", "budget", "overhead", "expense"],
  quality: ["standard", "quality", "safety", "compliance", "maintain", "ensure", "follow", "adhere", "protocol", "regulation"],
  team: ["collaborate", "support", "coordinate", "work with", "team", "colleague", "staff", "rally", "unite", "cooperate"],
  problem_solving: ["resolve", "fix", "solve", "handle", "manage", "address", "troubleshoot", "overcome", "challenge", "issue"],
  efficiency: ["optimize", "streamline", "improve", "enhance", "speed up", "reduce time", "workflow", "process", "productivity"],
  sales: ["upsell", "sales", "revenue", "commission", "target", "goal", "increase", "promote", "recommend", "suggest"],
  people_person: ["interact", "communicate", "connect", "build rapport", "relationship", "social", "outgoing", "friendly"],
  detail_oriented: ["accurate", "precise", "thorough", "meticulous", "attention", "detail", "quality", "consistency"],
  focused: ["concentrate", "focus", "attention", "dedicated", "committed", "determined", "persistent", "consistent"],
  energy_bringer: ["enthusiastic", "energetic", "motivated", "inspiring", "positive", "vibrant", "dynamic", "passionate"],
  go_getter: ["ambitious", "driven", "proactive", "initiative", "self-starter", "motivated", "determined", "persistent"],
  natural_leader: ["lead", "guide", "inspire", "motivate", "influence", "authority", "confidence", "charisma"],
  team_player: ["collaborate", "support", "cooperate", "teamwork", "unity", "harmony", "partnership", "alliance"],
  rally_team: ["unite", "motivate", "inspire", "rally", "energize", "mobilize", "coordinate", "organize"],
  switch_efficiency_mode: ["efficient", "productive", "organized", "systematic", "methodical", "structured", "orderly"],
  calm_organized: ["calm", "organized", "systematic", "methodical", "structured", "orderly", "composed", "collected"],
  friendly: ["friendly", "welcoming", "approachable", "warm", "kind", "pleasant", "courteous", "hospitable"],
  problem_solver: ["solve", "resolve", "fix", "address", "troubleshoot", "overcome", "challenge", "issue", "problem"],
};

/**
 * Extract relevant tags from highlight text using keyword matching
 * @param text - The highlight text to analyze
 * @returns Array of matching tag strings
 */
export function tagsFromHighlight(text: string): string[] {
  if (!text || typeof text !== 'string') return [];
  
  const lowerText = text.toLowerCase();
  const matchedTags: string[] = [];
  
  // Check each keyword category
  Object.entries(HIGHLIGHT_KEYWORDS).forEach(([tag, keywords]) => {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      matchedTags.push(tag);
    }
  });
  
  return matchedTags;
}

/**
 * Get all available tags for validation
 * @returns Array of all possible tag strings
 */
export function getAllTags(): string[] {
  return Object.keys(HIGHLIGHT_KEYWORDS);
}
