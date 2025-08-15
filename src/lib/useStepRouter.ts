"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveDraft, loadDraft, clearDraft } from "./storage";
import { getNextStep, getPrevStep, guard, decideFlow, decideFlowWithFamilyReuse } from "./onboardingRouter";
import type { FlowStepId, FlowKind, TOnboardingSignals } from "@/contracts/onboarding";

export interface UseStepRouterReturn {
  currentStep: FlowStepId;
  flow: FlowKind;
  signals: TOnboardingSignals;
  prevRoleId?: string;
  goNext: () => void;
  goPrev: () => void;
  goToStep: (step: FlowStepId) => void;
  updateSignals: (updates: Partial<TOnboardingSignals>) => void;
  saveProgress: () => void;
  loadProgress: () => void;
  clearProgress: () => void;
}

export function useStepRouter(
  initialStep: FlowStepId = "ROLE_SELECT",
  initialRoleId?: string,
  initialPrevRoleId?: string
): UseStepRouterReturn {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [currentStep, setCurrentStep] = useState<FlowStepId>(initialStep);
  const [flow, setFlow] = useState<FlowKind>("FULL");
  const [signals, setSignals] = useState<TOnboardingSignals>({
    roleId: "",
    roleFamily: "",
    shineKeys: [],
    busyKeys: [],
    vibeKey: undefined,
    orgName: undefined,
    startDate: undefined,
    endDate: undefined,
    highlightText: undefined,
    responsibilities: [],
  });
  const [prevRoleId, setPrevRoleId] = useState<string | undefined>(initialPrevRoleId);

  // Initialize flow when roleId changes with family-aware reuse
  useEffect(() => {
    if (signals.roleId && initialRoleId) {
      const { flow: newFlow, skipToStep } = decideFlowWithFamilyReuse(initialPrevRoleId ?? null, signals.roleId);
      setFlow(newFlow);
      
      // If family matches, skip to Organization step (keeping previous answers)
      if (skipToStep && skipToStep !== currentStep) {
        // Prefill previous answers for SHORT reuse to satisfy ORG guard
        const prev = loadDraft()?.signals;
        if (prev && signals.shineKeys.length === 0) {
          if (process.env.NODE_ENV !== "production") {
            console.debug("SHORT reuse → prefill", {
              prevShine: prev.shineKeys,
              nextShine: signals.shineKeys,
              target: skipToStep,
            });
          }
          
          setSignals(prevSignals => ({
            ...prevSignals,
            shineKeys: prev.shineKeys ?? [],
            vibeKey: prev.vibeKey ?? prevSignals.vibeKey,
            busyKeys: prev.busyKeys ?? prevSignals.busyKeys,
          }));
        }
        
        // Use setTimeout to avoid render-phase state updates
        setTimeout(() => {
          setCurrentStep(skipToStep);
          router.replace(`/onboarding-v2?step=${skipToStep}`);
        }, 0);
      }
    }
  }, [signals.roleId, initialRoleId, initialPrevRoleId, currentStep, router]);

  // Fresh session handling and load saved progress on mount
  useEffect(() => {
    // If searchParams.get('fresh')==='1', call clearDraft() before attempting loadDraft()
    if (searchParams.get('fresh') === '1') {
      if (process.env.NODE_ENV !== "production") {
        console.debug("useStepRouter: fresh=1 detected, clearing draft");
      }
      clearDraft();
      // Initialize empty signals unless a valid role query exists
      const roleParam = searchParams.get('role');
      if (roleParam) {
        setSignals(prev => ({ ...prev, roleId: roleParam }));
      }
      return;
    }

    // Only load draft on client side to prevent hydration mismatch
    if (typeof window !== 'undefined') {
      const saved = loadDraft();
      if (process.env.NODE_ENV !== "production") {
        console.debug("useStepRouter: initial mount", { 
          initialStep, 
          savedSignals: saved?.signals, 
          savedStep: saved?.currentStep,
          fresh: searchParams.get('fresh')
        });
      }
      
      if (saved && saved.currentStep !== initialStep) {
        setSignals(saved.signals);
        setCurrentStep(saved.currentStep);
        setPrevRoleId(saved.prevRoleId ?? undefined); // Convert null to undefined
      }
    }
  }, [initialStep, searchParams]);

  // Update URL when step changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("step", currentStep);
    if (signals.roleId) {
      params.set("role", signals.roleId);
    }
    if (prevRoleId) {
      params.set("prevRole", prevRoleId);
    }
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [currentStep, signals.roleId, prevRoleId, searchParams]);

  // Hard guards - enforce routing rules
  useEffect(() => {
    // If currentStep !== 'ROLE_SELECT' and neither signals.roleId nor a role query param are present → set current step to 'ROLE_SELECT'
    const roleParam = searchParams.get('role');
    if (currentStep !== 'ROLE_SELECT' && !signals.roleId && !roleParam) {
      setCurrentStep('ROLE_SELECT');
    }
  }, [currentStep, signals.roleId, searchParams]);

  const goNext = useCallback(() => {
    // goNext() should never advance from 'ROLE_SELECT' unless signals.roleId is set
    if (currentStep === 'ROLE_SELECT' && !signals.roleId) {
      return;
    }
    
    const nextStep = getNextStep(flow, currentStep, signals);
    if (nextStep && guard(nextStep, signals)) {
      setCurrentStep(nextStep);
    } else if (nextStep) {
      // Guard failed - stay on current step, don't throw or redirect
      if (process.env.NODE_ENV !== "production") {
        console.debug("useStepRouter: guard failed for step", nextStep, "staying on", currentStep);
      }
    }
  }, [flow, currentStep, signals]);

  const goPrev = useCallback(() => {
    const prevStep = getPrevStep(flow, currentStep);
    if (prevStep) {
      setCurrentStep(prevStep);
    }
  }, [flow, currentStep]);

  const goToStep = useCallback((step: FlowStepId) => {
    if (guard(step, signals)) {
      setCurrentStep(step);
    } else {
      // Guard failed - don't navigate, log in dev
      if (process.env.NODE_ENV !== "production") {
        console.debug("useStepRouter: guard failed for goToStep", step, "staying on", currentStep);
      }
    }
  }, [signals, currentStep]);

  const updateSignals = useCallback((updates: Partial<TOnboardingSignals>) => {
    setSignals(prev => ({ ...prev, ...updates }));
  }, []);

  const saveProgress = useCallback(() => {
    const data = {
      currentStep,
      flow,
      signals,
      prevRoleId,
      timestamp: Date.now(),
    };
    saveDraft(data);
  }, [currentStep, flow, signals, prevRoleId]);

  const loadProgress = useCallback(() => {
    const saved = loadDraft();
    if (saved) {
      setSignals(saved.signals);
      setCurrentStep(saved.currentStep);
      setPrevRoleId(saved.prevRoleId ?? undefined);
      setFlow(saved.flow);
    }
  }, []);

  const clearProgress = useCallback(() => {
    clearDraft(); // Clear localStorage
    setSignals({
      roleId: "",
      roleFamily: "",
      shineKeys: [],
      busyKeys: [],
      vibeKey: undefined,
      orgName: undefined,
      startDate: undefined,
      endDate: undefined,
      highlightText: undefined,
      responsibilities: [],
    });
    setCurrentStep("ROLE_SELECT");
    setPrevRoleId(undefined);
    setFlow("FULL");
  }, []);

  return {
    currentStep,
    flow,
    signals,
    prevRoleId,
    goNext,
    goPrev,
    goToStep,
    updateSignals,
    saveProgress,
    loadProgress,
    clearProgress,
  };
}