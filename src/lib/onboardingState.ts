import { create } from "zustand";

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

export type OnboardingState = {
  // Core fields
  role: string;                 // e.g., "bartender"
  traits: TraitId[];            // up to 3
  scenario?: ScenarioId;
  vibe?: string;                // short label, e.g., "High energy"
  orgName?: string;
  location?: string;
  startDate?: string;           // YYYY-MM
  endDate?: string;             // YYYY-MM
  isCurrent: boolean;

  // Career highlight
  highlightText?: string;
  highlightSuggestions: string[];

  // Responsibilities (ids or labels depending on your content source)
  responsibilities: string[];

  // --- Actions (setters) ---
  setRole?: (role: string) => void;

  setTraits?: (next: TraitId[]) => void;
  addTrait?: (t: TraitId) => void;
  removeTrait?: (t: TraitId) => void;
  toggleTrait?: (t: TraitId) => void;   // ← added

  setScenario?: (s?: ScenarioId) => void;
  setVibe?: (v?: string) => void;

  setOrganization?: (orgName?: string, location?: string) => void;
  setDates?: (start?: string, end?: string, isCurrent?: boolean) => void;

  setHighlightText?: (text: string) => void;
  toggleHighlightSuggestion?: (label: string) => void;
  setHighlightSuggestions?: (suggestions: string[]) => void;

  toggleResponsibility?: (id: string) => void;
  setResponsibilities?: (responsibilities: string[]) => void;

  // --- Clears (used to avoid stale data on role reselect) ---
  clearTraits?: () => void;
  clearScenario?: () => void;
  clearVibe?: () => void;
  clearOrganization?: () => void;
  clearDates?: () => void;
  clearHighlights?: () => void;
  clearResponsibilities?: () => void;
};

export const useOnboardingState = create<OnboardingState>((set, get) => ({
  // Initial state
  role: "",
  traits: [],
  scenario: undefined,
  vibe: undefined,
  orgName: undefined,
  location: undefined,
  startDate: undefined,
  endDate: undefined,
  isCurrent: false,

  highlightText: "",
  highlightSuggestions: [],
  responsibilities: [],

  // --- Setters ---
  setRole: (role) => set({ role }),

  setTraits: (next) => set({ traits: next.slice(0, 3) }),
  addTrait: (t) => {
    const { traits } = get();
    if (traits.includes(t)) return;
    if (traits.length >= 3) return;
    set({ traits: [...traits, t] });
  },
  removeTrait: (t) => set({ traits: get().traits.filter((x) => x !== t) }),
  toggleTrait: (t) => {
    const { traits } = get();
    if (traits.includes(t)) {
      set({ traits: traits.filter((x) => x !== t) });
    } else {
      if (traits.length >= 3) return; // enforce cap
      set({ traits: [...traits, t] });
    }
  },

  setScenario: (s) => set({ scenario: s }),
  setVibe: (v) => set({ vibe: v }),

  setOrganization: (orgName, location) => set({ orgName, location }),
  setDates: (start, end, isCurrent) => set({ startDate: start, endDate: end, isCurrent: !!isCurrent }),

  setHighlightText: (text) => set({ highlightText: text }),
  toggleHighlightSuggestion: (label) => {
    const cur = get().highlightSuggestions;
    set({
      highlightSuggestions: cur.includes(label)
        ? cur.filter((x) => x !== label)
        : [...cur, label],
    });
  },
  setHighlightSuggestions: (suggestions) => set({ highlightSuggestions: suggestions }),

  toggleResponsibility: (id) => {
    const cur = get().responsibilities;
    set({
      responsibilities: cur.includes(id)
        ? cur.filter((x) => x !== id)
        : [...cur, id],
    });
  },

  setResponsibilities: (responsibilities) => set({ responsibilities }),

  // --- Clears ---
  clearTraits: () => set({ traits: [] }),
  clearScenario: () => set({ scenario: undefined }),
  clearVibe: () => set({ vibe: undefined }),
  clearOrganization: () => set({ orgName: undefined, location: undefined }),
  clearDates: () => set({ startDate: undefined, endDate: undefined, isCurrent: false }),
  clearHighlights: () => set({ highlightText: "", highlightSuggestions: [] }),
  clearResponsibilities: () => set({ responsibilities: [] }),
}));