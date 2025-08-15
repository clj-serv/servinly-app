// src/content/howYouShine.ts
export type ShineKey =
  | "people-person"
  | "problem-solver"
  | "bring-energy"
  | "detail-oriented"
  | "team-player"
  | "natural-leader"
  | "keep-positive";

export type ShineOption = {
  key: ShineKey; // stable ID for ML mapping
  title: string; // short label
  description: string; // role-family specific copy
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
  "server/waitstaff": "service",
  server: "service",
  waitstaff: "service",
  host: "service",
  hostess: "service",
  "front desk agent": "frontdesk",
  frontdesk: "frontdesk",
  "front-desk": "frontdesk",
  barista: "coffee",
  "line cook": "kitchen",
  "line-cook": "kitchen",
  "sous chef": "kitchen",
  "sous-chef": "kitchen",
  chef: "kitchen",
  kitchenhand: "kitchen",
  supervisor: "management",
  "venue manager": "management",
  manager: "management",
  "business owner": "management",
  "business-owner": "management",
};

const BASE_KEYS: ShineKey[] = [
  "people-person",
  "problem-solver",
  "bring-energy",
  "detail-oriented",
  "team-player",
  "natural-leader",
  "keep-positive",
];

// ---- Family content ----

export const HOW_YOU_SHINE: Record<RoleFamily, ShineOption[]> = {
  bar: [
    {
      key: "people-person",
      title: "People person",
      description: "I connect easily with guests and keep the bar lively and welcoming.",
    },
    {
      key: "problem-solver",
      title: "Problem solver",
      description: "I smooth out mix‑ups on the fly and keep service moving.",
    },
    {
      key: "bring-energy",
      title: "Brings the energy",
      description: "I lift the room with upbeat conversation and confident service.",
    },
    {
      key: "detail-oriented",
      title: "Detail focused",
      description: "I hit recipes precisely and keep presentation sharp under pressure.",
    },
    {
      key: "team-player",
      title: "Team player",
      description: "I sync with barbacks and floor staff to keep the flow smooth.",
    },
    {
      key: "natural-leader",
      title: "Natural leader",
      description: "I set the pace on busy nights and help direct the team.",
    },
    {
      key: "keep-positive",
      title: "Keeps it positive",
      description: "I stay upbeat with guests and teammates, even in a rush.",
    },
  ],
  service: [
    {
      key: "people-person",
      title: "People person",
      description: "I make guests feel welcome and build quick rapport at the table or door.",
    },
    {
      key: "problem-solver",
      title: "Problem solver",
      description: "I handle special requests and fix issues without fuss.",
    },
    {
      key: "bring-energy",
      title: "Brings the energy",
      description: "I keep spirits high and the section humming during peaks.",
    },
    {
      key: "detail-oriented",
      title: "Detail focused",
      description: "I know the menu, note dietary needs, and get orders right.",
    },
    {
      key: "team-player",
      title: "Team player",
      description: "I coordinate with runners and kitchen to keep timing tight.",
    },
    {
      key: "natural-leader",
      title: "Natural leader",
      description: "I help allocate sections and mentor new team members.",
    },
    {
      key: "keep-positive",
      title: "Keeps it positive",
      description: "I stay calm and friendly when the floor gets busy.",
    },
  ],
  frontdesk: [
    {
      key: "people-person",
      title: "People person",
      description: "I make arrivals feel at home and set a warm first impression.",
    },
    {
      key: "problem-solver",
      title: "Problem solver",
      description: "I resolve booking issues and special requests smoothly.",
    },
    {
      key: "bring-energy",
      title: "Brings the energy",
      description: "I keep the lobby upbeat and moving during check‑in waves.",
    },
    {
      key: "detail-oriented",
      title: "Detail focused",
      description: "I manage bookings, notes, and billing accurately.",
    },
    {
      key: "team-player",
      title: "Team player",
      description: "I coordinate with housekeeping and maintenance to meet guest needs.",
    },
    {
      key: "natural-leader",
      title: "Natural leader",
      description: "I guide the desk during peak times and coach newer staff.",
    },
    {
      key: "keep-positive",
      title: "Keeps it positive",
      description: "I stay composed and helpful when lines and phones light up.",
    },
  ],
  coffee: [
    {
      key: "people-person",
      title: "People person",
      description: "I remember regulars and make the counter feel friendly.",
    },
    {
      key: "problem-solver",
      title: "Problem solver",
      description: "I handle remakes and special orders without slowing the line.",
    },
    {
      key: "bring-energy",
      title: "Brings the energy",
      description: "I bring morning‑rush energy and keep the vibe bright.",
    },
    {
      key: "detail-oriented",
      title: "Detail focused",
      description: "I nail recipes, dialing in shots and milk texture consistently.",
    },
    {
      key: "team-player",
      title: "Team player",
      description: "I switch between bar, till, and handoff to help the team.",
    },
    {
      key: "natural-leader",
      title: "Natural leader",
      description: "I set pace on the bar and coach best practices.",
    },
    {
      key: "keep-positive",
      title: "Keeps it positive",
      description: "I stay patient and upbeat when the queue grows.",
    },
  ],
  kitchen: [
    {
      key: "people-person",
      title: "People person",
      description: "I communicate clearly on the line and keep teamwork tight.",
    },
    {
      key: "problem-solver",
      title: "Problem solver",
      description: "I troubleshoot tickets and substitutions without derailing service.",
    },
    {
      key: "bring-energy",
      title: "Brings the energy",
      description: "I keep momentum high and help the pass run smoothly.",
    },
    {
      key: "detail-oriented",
      title: "Detail focused",
      description: "I plate consistently and uphold recipe and hygiene standards.",
    },
    {
      key: "team-player",
      title: "Team player",
      description: "I back up stations and call when help is needed.",
    },
    {
      key: "natural-leader",
      title: "Natural leader",
      description: "I run a station, call tickets, and coach juniors on the fly.",
    },
    {
      key: "keep-positive",
      title: "Keeps it positive",
      description: "I stay steady and constructive when the board is full.",
    },
  ],
  management: [
    {
      key: "people-person",
      title: "People person",
      description: "I build guest loyalty and foster a supportive team culture.",
    },
    {
      key: "problem-solver",
      title: "Problem solver",
      description: "I remove blockers fast and keep operations on track.",
    },
    {
      key: "bring-energy",
      title: "Brings the energy",
      description: "I set a positive tone and motivate the team on busy days.",
    },
    {
      key: "detail-oriented",
      title: "Detail focused",
      description: "I monitor standards, costs, and compliance without missing the details.",
    },
    {
      key: "team-player",
      title: "Team player",
      description: "I collaborate across FOH/BOH to keep service seamless.",
    },
    {
      key: "natural-leader",
      title: "Natural leader",
      description: "I set direction, delegate clearly, and develop people.",
    },
    {
      key: "keep-positive",
      title: "Keeps it positive",
      description: "I handle escalations calmly and keep morale steady.",
    },
  ],
};

// Helper to fetch options for a role slug or family
export function getShineOptions(input: string): ShineOption[] {
  const family = (ROLE_TO_FAMILY[input.toLowerCase()] ?? input) as RoleFamily;
  return HOW_YOU_SHINE[family] ?? HOW_YOU_SHINE.bar;
}
