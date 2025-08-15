// === Types ===
export type RoleFamily = "generic" | "bartender" | "front-desk" | "server";

export type TraitId =
  | "people-person"
  | "problem-solver"
  | "bring-energy"
  | "detail-oriented"
  | "team-player"
  | "natural-leader"
  | "keep-positive";

export type ScenarioId =
  | "calm-organized"
  | "rally-team"
  | "keep-informed"
  | "efficiency-mode";

export type ResponsibilityId =
  | "guest-welcome"
  | "guest-recommend"
  | "maintain-atmosphere"
  | "service-throughout"
  | "coordination"
  | "train-staff"
  | "lead-events"
  | "support-issues"
  | "manage-orders"
  | "operate-pos"
  | "keep-bar-spotless"
  | "restock-inventory"
  | "design-seasonal"
  | "new-garnishes"
  | "menu-suggestions"
  | "upsell-strategies"
  | "quality-standards"
  | "health-safety"
  | "measure-control"
  | "vip-service";

type TraitOption = { id: TraitId; title: string; description: string };
type ScenarioOption = { id: ScenarioId; title: string; description: string };
type ResponsibilityOption = { id: ResponsibilityId; label: string };
type ResponsibilityGroup = { group: string; items: ResponsibilityOption[] };

// === Defaults ===
export const DEFAULT_FAMILY: RoleFamily = "generic";

// === FF-02 How You Shine ===
export const TRAIT_OPTIONS: Record<RoleFamily, TraitOption[]> = {
  generic: [
    { id: "people-person",   title: "I'm a people person",    description: "I love connecting with guests and making them feel welcome" },
    { id: "problem-solver",  title: "I'm a problem solver",   description: "I thrive on finding creative solutions and making things work" },
    { id: "bring-energy",    title: "I bring the energy",     description: "I keep spirits high and create a positive atmosphere" },
    { id: "detail-oriented", title: "I'm detail-oriented",    description: "I notice the little things that make a big difference" },
    { id: "team-player",     title: "I'm a team player",      description: "I work well with others and support my colleagues" },
    { id: "natural-leader",  title: "I'm a natural leader",   description: "I like to guide others and take initiative" },
    { id: "keep-positive",   title: "I keep things positive", description: "I maintain a smile even during the busiest shifts" },
  ],
  bartender: [],
  "front-desk": [],
  server: [],
};

// === FF-03 Busy Shift Moment ===
export const SCENARIO_OPTIONS: Record<RoleFamily, ScenarioOption[]> = {
  generic: [
    { id: "calm-organized",  title: "Stay calm and organized",  description: "I take a deep breath, prioritize tasks, and work methodically through the rush" },
    { id: "rally-team",      title: "Rally the team",           description: "I communicate with my colleagues to coordinate and support each other" },
    { id: "keep-informed",   title: "Keep guests informed",     description: "I proactively communicate with customers about wait times and updates" },
    { id: "efficiency-mode", title: "Switch to efficiency mode",description: "I streamline my movements and find ways to serve multiple tables efficiently" },
  ],
  bartender: [],
  "front-desk": [],
  server: [],
};

// === FF-07 Career Highlight Suggestions ===
export const HIGHLIGHT_SUGGESTIONS: Record<RoleFamily, string[]> = {
  generic: [
    "Created a signature cocktail that became a customer favorite",
    "Managed the bar during high-volume events without delays",
    "Trained and mentored new bartending staff",
    "Introduced upselling techniques that boosted drink sales",
    "Designed and implemented a seasonal drinks menu",
  ],
  bartender: [],
  "front-desk": [],
  server: [],
};

// === FF-08 Grouped Responsibilities (5 groups × 4 items) ===
export const RESPONSIBILITY_GROUPS: Record<RoleFamily, ResponsibilityGroup[]> = {
  generic: [
    {
      group: "Guest Service",
      items: [
        { id: "guest-welcome",       label: "Welcomed guests warmly and built rapport quickly" },
        { id: "guest-recommend",     label: "Recommended drinks based on customer preferences" },
        { id: "maintain-atmosphere", label: "Maintained a lively and positive atmosphere" },
        { id: "service-throughout",  label: "Provided attentive table and bar service throughout shifts" },
      ],
    },
    {
      group: "Teamwork & Leadership",
      items: [
        { id: "coordination",  label: "Coordinated with barbacks and floor staff for smooth flow" },
        { id: "train-staff",   label: "Trained and mentored junior bartending staff" },
        { id: "lead-events",   label: "Led the bar team during high-volume events" },
        { id: "support-issues",label: "Supported colleagues resolving customer issues promptly" },
      ],
    },
    {
      group: "Operations & Efficiency",
      items: [
        { id: "manage-orders",     label: "Managed drink orders efficiently during peak hours" },
        { id: "operate-pos",       label: "Operated POS and processed payments accurately" },
        { id: "keep-bar-spotless", label: "Kept the bar spotless and organized" },
        { id: "restock-inventory", label: "Monitored and restocked inventory proactively" },
      ],
    },
    {
      group: "Creativity & Innovation",
      items: [
        { id: "design-seasonal",    label: "Designed seasonal or themed cocktail menus" },
        { id: "new-garnishes",      label: "Introduced new garnishes and presentations" },
        { id: "menu-suggestions",   label: "Suggested menu changes based on feedback" },
        { id: "upsell-strategies",  label: "Developed upselling strategies that boosted sales" },
      ],
    },
    {
      group: "Quality & Compliance",
      items: [
        { id: "quality-standards", label: "Ensured all drinks met quality standards" },
        { id: "health-safety",     label: "Followed health and safety regulations" },
        { id: "measure-control",   label: "Controlled alcohol measures per licensing" },
        { id: "vip-service",       label: "Handled VIP guests with discretion" },
      ],
    },
  ],
  bartender: [],
  "front-desk": [],
  server: [],
};