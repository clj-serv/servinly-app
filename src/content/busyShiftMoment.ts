// src/content/busyShiftMoment.ts
export type BusyKey =
  | "calm-organized"      // was "stay_calm"
  | "rally-team"          // was "rally_team"
  | "keep-informed"       // was "keep_guests_informed"
  | "efficiency-mode";    // was "switch_efficiency_mode"

export type BusyOption = {
  key: BusyKey; // stable ID for ML mapping
  title: string; // short label shown on card
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

export const BUSY_SHIFT_OPTIONS: Record<RoleFamily, BusyOption[]> = {
  // 🍹 Bar — Bartender
  bar: [
    {
      key: "calm-organized",
      title: "Stay calm and organized",
      description: "I take a breath, queue drink orders in my head, and work through them with precision.",
    },
    {
      key: "rally-team",
      title: "Rally the team",
      description: "I coordinate with barbacks and servers so everyone knows what's needed next.",
    },
    {
      key: "keep-informed",
      title: "Keep guests informed",
      description: "I chat with guests about wait times, thank them for patience, and keep the vibe upbeat.",
    },
    {
      key: "efficiency-mode",
      title: "Switch to efficiency mode",
      description: "I batch orders, prep garnishes, and tighten movements to keep service flowing.",
    },
  ],

  // 🍽️ Service Floor — Server / Waitstaff / Host(ess)
  service: [
    {
      key: "calm-organized",
      title: "Stay calm and organized",
      description: "I prioritize tickets, group tasks by table, and work steadily through the rush.",
    },
    {
      key: "rally-team",
      title: "Rally the team",
      description: "I call out needs, swap sections if required, and back up teammates proactively.",
    },
    {
      key: "keep-informed",
      title: "Keep guests informed",
      description: "I set expectations on wait times, offer updates, and keep guests comfortable.",
    },
    {
      key: "efficiency-mode",
      title: "Switch to efficiency mode",
      description: "I combine trips, stage plates, and use shortcuts that speed up service.",
    },
  ],

  // 🛎️ Front Desk — Reception / Concierge
  frontdesk: [
    {
      key: "calm-organized",
      title: "Stay calm and organized",
      description: "I triage the line, handle quick wins first, and keep check‑ins moving.",
    },
    {
      key: "rally-team",
      title: "Rally the team",
      description: "I coordinate with housekeeping and bell staff to turn rooms faster.",
    },
    {
      key: "keep-informed",
      title: "Keep guests informed",
      description: "I update guests on room status, offer alternatives, and keep communication clear.",
    },
    {
      key: "efficiency-mode",
      title: "Switch to efficiency mode",
      description: "I streamline paperwork, pre‑prepare keys, and optimize handovers.",
    },
  ],

  // ☕ Coffee — Barista
  coffee: [
    {
      key: "calm-organized",
      title: "Stay calm and organized",
      description: "I breathe, line up dockets mentally, and pull shots with consistent timing.",
    },
    {
      key: "rally-team",
      title: "Rally the team",
      description: "I coordinate with the till and handoff to keep the queue moving.",
    },
    {
      key: "keep-informed",
      title: "Keep guests informed",
      description: "I let regulars know about the wait and keep the counter friendly.",
    },
    {
      key: "efficiency-mode",
      title: "Switch to efficiency mode",
      description: "I batch milk, prep cups, and tighten motions for peak periods.",
    },
  ],

  // 🔪 Kitchen — Line Cook / Sous Chef / Chef / Kitchenhand
  kitchen: [
    {
      key: "calm-organized",
      title: "Stay calm and organized",
      description: "I sort the board, work the station methodically, and keep plates consistent.",
    },
    {
      key: "rally-team",
      title: "Rally the team",
      description: "I call tickets, request hands when needed, and sync with the pass.",
    },
    {
      key: "keep-informed",
      title: "Keep guests informed",
      description: "I update FOH on delays and alternatives so guests aren't left wondering.",
    },
    {
      key: "efficiency-mode",
      title: "Switch to efficiency mode",
      description: "I batch prep, simplify garnishes, and adjust firing to maintain pace.",
    },
  ],

  // 🧭 Management — Supervisor / Venue Manager / Owner
  management: [
    {
      key: "calm-organized",
      title: "Stay calm and organized",
      description: "I keep a cool head, re‑prioritize the floor plan, and remove blockers fast.",
    },
    {
      key: "rally-team",
      title: "Rally the team",
      description: "I redeploy staff, set clear calls, and keep communication tight across FOH/BOH.",
    },
    {
      key: "keep-informed",
      title: "Keep guests informed",
      description: "I handle escalations, set expectations with guests, and protect team focus.",
    },
    {
      key: "efficiency-mode",
      title: "Switch to efficiency mode",
      description: "I streamline steps of service and adjust pacing to stabilize the rush.",
    },
  ],
};

// Helper to fetch options for a role slug or family
export function getBusyShiftOptions(input: string): BusyOption[] {
  const key = input.toLowerCase();
  const family = (ROLE_TO_FAMILY[key] ?? key) as RoleFamily;
  return BUSY_SHIFT_OPTIONS[family] ?? BUSY_SHIFT_OPTIONS.service;
}

export const BUSY_SHIFT_UI_COPY = {
  title: "Busy shift moment",
  prompt: "What's your style when things get hectic?",
  helper: "Pick the option that fits you best. We'll use this to shape your profile and suggestions.",
};
