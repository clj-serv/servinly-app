// src/content/yourVibeAtWork.ts
export type VibeKey = "friendly" | "focused" | "team_player" | "go_getter";

export type VibeOption = {
  key: VibeKey; // stable ID for ML mapping
  emoji: string; // UI emoji
  title: string; // short label
  description: string; // role-context description
};

export type RoleFamily =
  | "bar" // Bartender
  | "service" // Server/Waitstaff, Host/Hostess
  | "frontdesk" // Front Desk Agent
  | "coffee" // Barista
  | "kitchen" // Line Cook, Sous Chef, Chef, Kitchenhand
  | "management"; // Supervisor, Venue Manager, Business Owner

export const ROLE_TO_FAMILY: Record<string, RoleFamily> = {
  bartender: "bar",
  server: "service",
  "server/waitstaff": "service",
  waitstaff: "service",
  host: "service",
  hostess: "service",
  frontdesk: "frontdesk",
  "front desk agent": "frontdesk",
  barista: "coffee",
  "line cook": "kitchen",
  "sous chef": "kitchen",
  chef: "kitchen",
  kitchenhand: "kitchen",
  supervisor: "management",
  "venue manager": "management",
  "business owner": "management",
};

export const YOUR_VIBE_OPTIONS: Record<RoleFamily, VibeOption[]> = {
  // 🍹 Bar — Bartender
  bar: [
    {
      key: "friendly",
      emoji: "😄",
      title: "Friendly",
      description: "Warm and welcoming at the bar, remembering regulars and making guests feel at home.",
    },
    {
      key: "focused",
      emoji: "🤓",
      title: "Focused",
      description: "Keeps drink orders accurate and presentation sharp, even in a rush.",
    },
    {
      key: "team_player",
      emoji: "🤝",
      title: "Team Player",
      description: "Backs up barbacks and servers to keep the floor and bar in sync.",
    },
    {
      key: "go_getter",
      emoji: "🚀",
      title: "Go‑getter",
      description: "Spots upsell moments and keeps the service pace high.",
    },
  ],

  // 🍽️ Service Floor — Server / Waitstaff / Host(ess)
  service: [
    {
      key: "friendly",
      emoji: "😄",
      title: "Friendly",
      description: "Puts guests at ease and builds quick rapport at the table or door.",
    },
    {
      key: "focused",
      emoji: "🤓",
      title: "Focused",
      description: "Tracks orders, notes dietary needs, and stays precise under pressure.",
    },
    {
      key: "team_player",
      emoji: "🤝",
      title: "Team Player",
      description: "Syncs with runners and kitchen to time courses smoothly.",
    },
    {
      key: "go_getter",
      emoji: "🚀",
      title: "Go‑getter",
      description: "Proactive in busy periods—jumps in where needed to keep service moving.",
    },
  ],

  // 🛎️ Front Desk — Reception / Concierge
  frontdesk: [
    {
      key: "friendly",
      emoji: "😄",
      title: "Friendly",
      description: "Greets guests warmly and sets a positive tone for their stay.",
    },
    {
      key: "focused",
      emoji: "🤓",
      title: "Focused",
      description: "Processes check‑ins and bookings accurately, even during arrival waves.",
    },
    {
      key: "team_player",
      emoji: "🤝",
      title: "Team Player",
      description: "Coordinates with housekeeping and maintenance to meet guest needs fast.",
    },
    {
      key: "go_getter",
      emoji: "🚀",
      title: "Go‑getter",
      description: "Handles extras and resolves issues quickly to keep things moving.",
    },
  ],

  // ☕ Coffee — Barista
  coffee: [
    {
      key: "friendly",
      emoji: "😄",
      title: "Friendly",
      description: "Keeps the counter welcoming and remembers regulars' orders.",
    },
    {
      key: "focused",
      emoji: "🤓",
      title: "Focused",
      description: "Dialed‑in shots and consistent milk texture during the morning rush.",
    },
    {
      key: "team_player",
      emoji: "🤝",
      title: "Team Player",
      description: "Switches between bar, till, and handoff to help the team.",
    },
    {
      key: "go_getter",
      emoji: "🚀",
      title: "Go‑getter",
      description: "Finds ways to speed the queue and keep service brisk.",
    },
  ],

  // 🔪 Kitchen — Line Cook / Sous Chef / Chef / Kitchenhand
  kitchen: [
    {
      key: "friendly",
      emoji: "😄",
      title: "Friendly",
      description: "Maintains good vibes on the line, even when tickets stack up.",
    },
    {
      key: "focused",
      emoji: "🤓",
      title: "Focused",
      description: "Plates consistently and meets standards without slipping under pressure.",
    },
    {
      key: "team_player",
      emoji: "🤝",
      title: "Team Player",
      description: "Backs up stations and calls for help when needed.",
    },
    {
      key: "go_getter",
      emoji: "🚀",
      title: "Go‑getter",
      description: "Takes initiative to speed prep and push service forward.",
    },
  ],

  // 🧭 Management — Supervisor / Venue Manager / Owner
  management: [
    {
      key: "friendly",
      emoji: "😄",
      title: "Friendly",
      description: "Builds guest loyalty and a supportive team culture.",
    },
    {
      key: "focused",
      emoji: "🤓",
      title: "Focused",
      description: "Keeps standards, costs, and compliance on track without missing details.",
    },
    {
      key: "team_player",
      emoji: "🤝",
      title: "Team Player",
      description: "Aligns FOH/BOH and models collaboration during peaks.",
    },
    {
      key: "go_getter",
      emoji: "🚀",
      title: "Go‑getter",
      description: "Sets a positive pace and removes blockers fast.",
    },
  ],
};

// Helper to fetch options for a role slug or family
export function getVibeOptions(input: string): VibeOption[] {
  const key = input.toLowerCase();
  const family = (ROLE_TO_FAMILY[key] ?? key) as RoleFamily;
  return YOUR_VIBE_OPTIONS[family] ?? YOUR_VIBE_OPTIONS.service;
}

export const VIBE_UI_COPY = {
  title: "Your vibe at work",
  prompt: "What energy do you bring to your workplace?",
  helper: "Pick the option that fits you best. We'll use this to shape your profile and suggestions.",
};
