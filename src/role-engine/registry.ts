// Simple role registry for onboarding V2
import type { Role, ContentPack } from "./types";

// Available roles
export const AVAILABLE_ROLES: Role[] = [
  { id: "bartender", label: "Bartender", family: "bar", active: true },
  { id: "barista", label: "Barista", family: "bar", active: true },
  { id: "server", label: "Server", family: "service", active: true },
  { id: "host", label: "Host/Hostess", family: "service", active: true },
  { id: "manager", label: "Manager", family: "management", active: true },
  { id: "chef", label: "Chef", family: "kitchen", active: true },
];

// Content packs by family
const CONTENT_PACKS: Record<string, ContentPack> = {
  bar: {
    version: "1.0",
    family: "bar",
    shine: ["Customer-focused", "Quick thinking", "Team player", "Detail-oriented", "Calm under pressure"],
    scenarios: [
      { id: "rush_hour", label: "Rush hour", tags: ["busy", "fast-paced"] },
      { id: "complex_orders", label: "Complex orders", tags: ["technical", "attention"] },
      { id: "customer_complaints", label: "Customer complaints", tags: ["communication", "problem-solving"] },
      { id: "equipment_issues", label: "Equipment issues", tags: ["technical", "troubleshooting"] },
      { id: "team_coordination", label: "Team coordination", tags: ["leadership", "communication"] }
    ],
    vibe: [
      { id: "energetic", label: "Energetic", tags: ["dynamic", "engaging"] },
      { id: "professional", label: "Professional", tags: ["polished", "reliable"] },
      { id: "friendly", label: "Friendly", tags: ["approachable", "warm"] },
      { id: "fast_paced", label: "Fast-paced", tags: ["dynamic", "efficient"] },
      { id: "collaborative", label: "Collaborative", tags: ["team-oriented", "supportive"] }
    ],
    responsibilities: [
      {
        name: "Drink Preparation",
        items: [
          { id: "prepare_drinks", label: "Prepare drinks", tags: ["drinks", "preparation", "quality"] },
          { id: "maintain_standards", label: "Maintain quality standards", tags: ["quality", "consistency"] },
          { id: "handle_special_requests", label: "Handle special requests", tags: ["customization", "attention"] }
        ]
      },
      {
        name: "Customer Service",
        items: [
          { id: "greet_customers", label: "Greet and seat customers", tags: ["hospitality", "first-impression"] },
          { id: "take_orders", label: "Take drink orders", tags: ["communication", "accuracy"] },
          { id: "handle_complaints", label: "Handle customer complaints", tags: ["problem-solving", "communication"] }
        ]
      },
      {
        name: "Bar Operations",
        items: [
          { id: "maintain_inventory", label: "Maintain bar inventory", tags: ["organization", "planning"] },
          { id: "clean_equipment", label: "Clean and maintain equipment", tags: ["maintenance", "hygiene"] },
          { id: "restock_supplies", label: "Restock supplies", tags: ["organization", "efficiency"] }
        ]
      }
    ]
  },
  service: {
    version: "1.0",
    family: "service",
    shine: ["Guest-focused", "Attention to detail", "Problem-solving", "Communication", "Teamwork"],
    scenarios: [
      { id: "high_volume", label: "High volume service", tags: ["busy", "efficient"] },
      { id: "special_requests", label: "Special requests", tags: ["flexibility", "attention"] },
      { id: "guest_issues", label: "Guest issues", tags: ["problem-solving", "communication"] },
      { id: "menu_changes", label: "Menu changes", tags: ["adaptability", "knowledge"] },
      { id: "team_support", label: "Team support", tags: ["collaboration", "helpfulness"] }
    ],
    vibe: [
      { id: "welcoming", label: "Welcoming", tags: ["friendly", "approachable"] },
      { id: "efficient", label: "Efficient", tags: ["organized", "quick"] },
      { id: "attentive", label: "Attentive", tags: ["observant", "responsive"] },
      { id: "professional", label: "Professional", tags: ["polished", "reliable"] },
      { id: "team_oriented", label: "Team-oriented", tags: ["collaborative", "supportive"] }
    ],
    responsibilities: [
      {
        name: "Guest Service",
        items: [
          { id: "greet_guests", label: "Greet and welcome guests", tags: ["hospitality", "first-impression"] },
          { id: "take_orders", label: "Take food and drink orders", tags: ["communication", "accuracy"] },
          { id: "serve_food", label: "Serve food and beverages", tags: ["timing", "presentation"] }
        ]
      },
      {
        name: "Table Management",
        items: [
          { id: "set_tables", label: "Set and clear tables", tags: ["organization", "efficiency"] },
          { id: "maintain_cleanliness", label: "Maintain table cleanliness", tags: ["hygiene", "presentation"] },
          { id: "handle_special_requests", label: "Handle special requests", tags: ["customization", "attention"] }
        ]
      }
    ]
  },
  management: {
    version: "1.0",
    family: "management",
    shine: ["Leadership", "Problem-solving", "Communication", "Organization", "Decision-making"],
    scenarios: [
      { id: "staff_shortage", label: "Staff shortage", tags: ["leadership", "problem-solving"] },
      { id: "customer_complaints", label: "Customer complaints", tags: ["communication", "resolution"] },
      { id: "inventory_issues", label: "Inventory issues", tags: ["organization", "planning"] },
      { id: "scheduling_conflicts", label: "Scheduling conflicts", tags: ["coordination", "communication"] },
      { id: "quality_standards", label: "Quality standards", tags: ["leadership", "enforcement"] }
    ],
    vibe: [
      { id: "authoritative", label: "Authoritative", tags: ["leadership", "confidence"] },
      { id: "approachable", label: "Approachable", tags: ["accessible", "friendly"] },
      { id: "organized", label: "Organized", tags: ["structured", "efficient"] },
      { id: "decisive", label: "Decisive", tags: ["confident", "quick"] },
      { id: "supportive", label: "Supportive", tags: ["encouraging", "helpful"] }
    ],
    responsibilities: [
      {
        name: "Team Leadership",
        items: [
          { id: "supervise_staff", label: "Supervise and train staff", tags: ["leadership", "development"] },
          { id: "conduct_meetings", label: "Conduct team meetings", tags: ["communication", "coordination"] },
          { id: "handle_discipline", label: "Handle disciplinary issues", tags: ["leadership", "conflict-resolution"] }
        ]
      },
      {
        name: "Operations",
        items: [
          { id: "manage_inventory", label: "Manage inventory and supplies", tags: ["organization", "planning"] },
          { id: "ensure_quality", label: "Ensure quality standards", tags: ["leadership", "enforcement"] },
          { id: "handle_scheduling", label: "Handle staff scheduling", tags: ["coordination", "planning"] }
        ]
      }
    ]
  },
  kitchen: {
    version: "1.0",
    family: "kitchen",
    shine: ["Attention to detail", "Speed", "Teamwork", "Quality focus", "Safety awareness"],
    scenarios: [
      { id: "rush_orders", label: "Rush orders", tags: ["speed", "pressure"] },
      { id: "equipment_failure", label: "Equipment failure", tags: ["problem-solving", "adaptability"] },
      { id: "ingredient_shortage", label: "Ingredient shortage", tags: ["creativity", "substitution"] },
      { id: "quality_issues", label: "Quality issues", tags: ["attention", "standards"] },
      { id: "team_coordination", label: "Team coordination", tags: ["communication", "collaboration"] }
    ],
    vibe: [
      { id: "focused", label: "Focused", tags: ["concentration", "determination"] },
      { id: "energetic", label: "Energetic", tags: ["dynamic", "enthusiastic"] },
      { id: "precise", label: "Precise", tags: ["accuracy", "attention"] },
      { id: "fast_paced", label: "Fast-paced", tags: ["speed", "efficiency"] },
      { id: "collaborative", label: "Collaborative", tags: ["teamwork", "cooperation"] }
    ],
    responsibilities: [
      {
        name: "Food Preparation",
        items: [
          { id: "prepare_food", label: "Prepare food items", tags: ["cooking", "quality"] },
          { id: "follow_recipes", label: "Follow recipes and standards", tags: ["accuracy", "consistency"] },
          { id: "maintain_quality", label: "Maintain food quality", tags: ["standards", "attention"] }
        ]
      },
      {
        name: "Kitchen Operations",
        items: [
          { id: "maintain_cleanliness", label: "Maintain kitchen cleanliness", tags: ["hygiene", "organization"] },
          { id: "manage_inventory", label: "Manage kitchen inventory", tags: ["organization", "planning"] },
          { id: "ensure_safety", label: "Ensure kitchen safety", tags: ["safety", "compliance"] }
        ]
      }
    ]
  }
};

export function getAvailableRoles(): Role[] {
  return AVAILABLE_ROLES.filter(role => role.active);
}

export function getRoleFamily(roleId: string): string | null {
  const role = AVAILABLE_ROLES.find(r => r.id === roleId);
  return role?.family || null;
}

export function getPack(roleId: string, family: string): ContentPack | null {
  return CONTENT_PACKS[family] || null;
}

export function getRolesByFamily(family: string): Role[] {
  return AVAILABLE_ROLES.filter(role => role.family === family && role.active);
}



