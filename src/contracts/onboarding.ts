import { z } from "zod";

export const OnboardingSignals = z.object({
  roleId: z.string(),          // 'bartender'
  roleFamily: z.string(),      // 'bar'
  shineKeys: z.array(z.string()).max(3).default([]),
  busyKeys: z.array(z.string()).max(2).default([]),
  vibeKey: z.string().optional(),
  orgName: z.string().optional(),
  startDate: z.string().optional(), // ISO
  endDate: z.string().optional(),   // ISO
  highlightText: z.string().optional(),
  responsibilities: z.array(z.string()).default([]),
});

export type TOnboardingSignals = z.infer<typeof OnboardingSignals>;

export type FlowStepId =
  | "ROLE_SELECT"
  | "SHINE"
  | "SCENARIO"
  | "VIBE"
  | "ORG"
  | "DATES"
  | "HIGHLIGHT"
  | "RESPONSIBILITIES"
  | "PREVIEW";

export type FlowKind = "FULL" | "SHORT";

export interface RankedResponsibility {
  id: string;
  label: string;
  group: string;
  score: number;
  pinned: boolean;
}

export interface RankedOutput {
  groupsSorted: Array<{
    name: string;
    responsibilities: RankedResponsibility[];
  }>;
  pinnedIds: string[];
  recommendedMix: string[];
}

export interface HighlightSuggestion {
  id: string;
  text: string;
  score: number;
  tags: string[];
}

export interface OnboardingState {
  currentStep: FlowStepId;
  flow: FlowKind;
  signals: TOnboardingSignals;
  prevRoleId?: string;
  timestamp: number;
}

// New: User context for signup→onboarding identity
export type UserContext = {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  lastRoleId?: string | null;
};

