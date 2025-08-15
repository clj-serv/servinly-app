import type { FlowStepId, FlowKind, TOnboardingSignals } from "@/contracts/onboarding";
import { FULL_FLOW, SHORT_FLOW } from "@/config/onboarding.flow";
import { getRoleFamily } from "@/role-engine/registry";

export function getNextStep(flow: FlowKind, current: FlowStepId, signals: TOnboardingSignals): FlowStepId | null {
  const flowSteps = flow === "FULL" ? FULL_FLOW : SHORT_FLOW;
  const currentIndex = flowSteps.indexOf(current);
  
  if (currentIndex === -1 || currentIndex === flowSteps.length - 1) {
    return null;
  }
  
  const nextStep = flowSteps[currentIndex + 1];
  return guard(nextStep, signals) ? nextStep : null;
}

export function getPrevStep(flow: FlowKind, current: FlowStepId): FlowStepId | null {
  const flowSteps = flow === "FULL" ? FULL_FLOW : SHORT_FLOW;
  const currentIndex = flowSteps.indexOf(current);
  
  if (currentIndex <= 0) {
    return null;
  }
  
  return flowSteps[currentIndex - 1];
}

export function guard(canEnter: FlowStepId, signals: TOnboardingSignals): boolean {
  switch (canEnter) {
    case "SHINE":
      return !!signals.roleId;
    case "SCENARIO":
      return !!signals.roleId && signals.shineKeys.length > 0;
    case "VIBE":
      return !!signals.roleId && signals.shineKeys.length > 0;
    case "ORG":
      return !!signals.roleId && signals.shineKeys.length > 0;
    case "DATES":
      return !!signals.roleId && signals.shineKeys.length > 0;
    case "HIGHLIGHT":
      return !!signals.roleId && signals.shineKeys.length > 0;
    case "RESPONSIBILITIES":
      return !!signals.roleId && signals.shineKeys.length > 0;
    case "PREVIEW":
      return !!signals.roleId && signals.shineKeys.length > 0;
    default:
      return true;
  }
}

export function decideFlow(prevRoleId: string | null, nextRoleId: string): FlowKind {
  if (!prevRoleId) return "FULL";
  const flow = prevRoleId === nextRoleId ? "SHORT" : "FULL";
  
  if (process.env.NODE_ENV !== "production") {
    console.debug("decideFlow", { prevRoleId, nextRoleId, flow });
  }
  
  return flow;
}

/**
 * Family-aware flow decision with answer reuse
 * If families match, skip to ORG (keeping previous answers)
 * If families differ, restart from SHINE
 */
export function decideFlowWithFamilyReuse(
  prevRoleId: string | null, 
  nextRoleId: string
): { flow: FlowKind; skipToStep?: FlowStepId } {
  if (!prevRoleId) return { flow: "FULL" };
  
  const prevFamily = getRoleFamily(prevRoleId);
  const nextFamily = getRoleFamily(nextRoleId);
  
  let result: { flow: FlowKind; skipToStep?: FlowStepId };
  
  if (prevFamily && nextFamily && prevFamily === nextFamily) {
    // Same family: Keep answers, skip to Organization
    result = { flow: "SHORT", skipToStep: "ORG" };
  } else {
    // Different family or role: Start fresh from SHINE
    result = { flow: "FULL" };
  }
  
  if (process.env.NODE_ENV !== "production") {
    console.debug("decideFlowWithFamilyReuse", { 
      prevRoleId, 
      prevRoleFamily: prevFamily,
      nextRoleId, 
      nextRoleFamily: nextFamily,
      flow: result.flow,
      skipToStep: result.skipToStep
    });
  }
  
  return result;
}

// Helper functions for flow metadata
export function getFlowSteps(flow: FlowKind): FlowStepId[] {
  return flow === "FULL" ? FULL_FLOW : SHORT_FLOW;
}

export function getStepIndex(flow: FlowKind, step: FlowStepId): number {
  const flowSteps = getFlowSteps(flow);
  return flowSteps.indexOf(step);
}

export function isStepInFlow(flow: FlowKind, step: FlowStepId): boolean {
  const flowSteps = getFlowSteps(flow);
  return flowSteps.includes(step);
}

export function getStepLabel(step: FlowStepId): string {
  const labels: Record<FlowStepId, string> = {
    ROLE_SELECT: "Select Role",
    SHINE: "How You Shine",
    SCENARIO: "Busy Shift Moment",
    VIBE: "Your Vibe",
    ORG: "Organization",
    DATES: "Dates",
    HIGHLIGHT: "Career Highlight",
    RESPONSIBILITIES: "Responsibilities",
    PREVIEW: "Preview",
  };
  return labels[step] || step;
}

export function getStepDescription(step: FlowStepId): string {
  const descriptions: Record<FlowStepId, string> = {
    ROLE_SELECT: "Choose your primary role in hospitality",
    SHINE: "Select traits that describe you best",
    SCENARIO: "Pick moments that sound like you during a rush",
    VIBE: "Choose your work style and energy",
    ORG: "Tell us about your organization",
    DATES: "When did you work in this role?",
    HIGHLIGHT: "Share a memorable achievement or experience",
    RESPONSIBILITIES: "Select responsibilities that apply to your role",
    PREVIEW: "Review your information before submitting",
  };
  return descriptions[step] || "";
}