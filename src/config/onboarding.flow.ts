// Onboarding V2 — step metadata & helpers
// This file intentionally keeps logic light; branching is handled inside pages
// (e.g., buttons route to next paths). The hook can still use these maps.

import type { FlowKind, FlowStepId } from "@/contracts/onboarding";

export const FULL_FLOW: FlowStepId[] = [
  "ROLE_SELECT",
  "SHINE",
  "SCENARIO",
  "VIBE",
  "ORG",
  "DATES",
  "HIGHLIGHT",
  "RESPONSIBILITIES",
  "PREVIEW"
];

export const SHORT_FLOW: FlowStepId[] = [
  "ROLE_SELECT",
  "SHINE",
  "VIBE",
  "RESPONSIBILITIES",
  "DATES",
  "PREVIEW"
];

export function decideFlow(prevRoleId: string | null, nextRoleId: string): FlowKind {
  if (!prevRoleId) return "FULL";
  return prevRoleId === nextRoleId ? "SHORT" : "FULL";
}

export function getFlowSteps(flow: FlowKind): FlowStepId[] {
  return flow === "FULL" ? FULL_FLOW : SHORT_FLOW;
}

export function getStepIndex(flow: FlowKind, step: FlowStepId): number {
  const steps = getFlowSteps(flow);
  return steps.indexOf(step);
}

export function isStepInFlow(flow: FlowKind, step: FlowStepId): boolean {
  const steps = getFlowSteps(flow);
  return steps.includes(step);
}

export function getStepLabel(step: FlowStepId): string {
  const labels: Record<FlowStepId, string> = {
    ROLE_SELECT: "Select Role",
    SHINE: "How You Shine",
    SCENARIO: "Busy Shift Scenarios",
    VIBE: "Your Work Vibe",
    ORG: "Organization",
    DATES: "Employment Dates",
    HIGHLIGHT: "Career Highlights",
    RESPONSIBILITIES: "Key Responsibilities",
    PREVIEW: "Profile Preview"
  };
  return labels[step];
}

export function getStepDescription(step: FlowStepId): string {
  const descriptions: Record<FlowStepId, string> = {
    ROLE_SELECT: "Choose your primary role in hospitality",
    SHINE: "Select up to 3 traits that best describe you",
    SCENARIO: "How do you handle busy shift moments?",
    VIBE: "What's your preferred work environment?",
    ORG: "Tell us about your organization",
    DATES: "When did you work in this role?",
    HIGHLIGHT: "Share your key achievements",
    RESPONSIBILITIES: "Select your main responsibilities",
    PREVIEW: "Review and complete your profile"
  };
  return descriptions[step];
}