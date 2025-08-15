import type { ContentPack } from "../types";

export function getBarFamily(): Omit<ContentPack, "version" | "family"> {
  return {
    shine: [
      { id: "creative", label: "Creative & Artistic", tags: ["innovation", "design", "craft"] },
      { id: "detail-oriented", label: "Detail-Oriented", tags: ["precision", "quality", "consistency"] },
      { id: "customer-focused", label: "Customer-Focused", tags: ["service", "hospitality", "experience"] },
      { id: "efficient", label: "Efficient & Organized", tags: ["speed", "workflow", "management"] },
      { id: "team-player", label: "Team Player", tags: ["collaboration", "support", "coordination"] },
      { id: "problem-solver", label: "Problem Solver", tags: ["troubleshooting", "adaptability", "quick-thinking"] }
    ],
    
    scenarios: [
      { id: "rush-hour", label: "Rush Hour Management", tags: ["high-volume", "efficiency", "calm"] },
      { id: "vip-service", label: "VIP Guest Service", tags: ["attention", "discretion", "excellence"] },
      { id: "inventory-crisis", label: "Inventory Crisis", tags: ["problem-solving", "communication", "adaptability"] },
      { id: "team-coordination", label: "Team Coordination", tags: ["leadership", "communication", "efficiency"] }
    ],
    
    vibe: [
      { id: "energetic", label: "Energetic & Lively", tags: ["vibrant", "fun", "engaging"] },
      { id: "sophisticated", label: "Sophisticated & Refined", tags: ["elegant", "professional", "upscale"] },
      { id: "casual", label: "Casual & Welcoming", tags: ["friendly", "approachable", "comfortable"] },
      { id: "intimate", label: "Intimate & Cozy", tags: ["warm", "personal", "relaxed"] }
    ],
    
    responsibilities: [
      {
        name: "Drink Crafting",
        items: [
          { id: "cocktail-creation", label: "Create signature cocktails", tags: ["creativity", "mixology", "quality"] },
          { id: "recipe-development", label: "Develop new drink recipes", tags: ["innovation", "testing", "documentation"] },
          { id: "garnish-design", label: "Design drink garnishes", tags: ["aesthetics", "creativity", "presentation"] }
        ]
      },
      {
        name: "Customer Service",
        items: [
          { id: "guest-interaction", label: "Interact with guests", tags: ["hospitality", "communication", "experience"] },
          { id: "recommendations", label: "Make drink recommendations", tags: ["knowledge", "sales", "service"] },
          { id: "complaint-resolution", label: "Resolve guest issues", tags: ["problem-solving", "customer-service", "communication"] }
        ]
      },
      {
        name: "Bar Operations",
        items: [
          { id: "inventory-management", label: "Manage bar inventory", tags: ["organization", "efficiency", "cost-control"] },
          { id: "equipment-maintenance", label: "Maintain bar equipment", tags: ["maintenance", "safety", "quality"] },
          { id: "cleanliness", label: "Maintain bar cleanliness", tags: ["hygiene", "organization", "standards"] }
        ]
      }
    ]
  };
}
