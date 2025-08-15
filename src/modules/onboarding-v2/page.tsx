import { Suspense } from "react";
import Link from "next/link";
import OnboardingClient from "./OnboardingClient";
import { getRoleFamily } from "@/role-engine/registry";
import { getPack } from "@/role-engine/registry";
import { rankHighlightSuggestions } from "@/server/highlightRank";
import { rankResponsibilities } from "@/server/rank";
import type { UserContext } from "@/contracts/onboarding";

interface PageProps {
  searchParams: {
    step?: string;
    role?: string;
    prevRoleId?: string;
  };
}

export default async function OnboardingPage({ searchParams }: PageProps) {
  const { step = "ROLE_SELECT", role, prevRoleId } = searchParams;
  
  // Dev-only logging
  if (process.env.NODE_ENV !== "production") {
    console.debug('[modules/onboarding-v2/page] step:', step, 'flag:', process.env.NEXT_PUBLIC_FEATURE_ONBOARDING_V2_ROUTER);
  }
  
  // Soft fallback for feature flag - render friendly disabled message
  if (process.env.NEXT_PUBLIC_FEATURE_ONBOARDING_V2_ROUTER !== "true") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-3">Onboarding V2 Disabled</h1>
          <p className="text-gray-600 mb-6">This feature is currently disabled. You can return to your profile to manage your experiences.</p>
          <Link 
            href="/profile" 
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Profile
          </Link>
        </div>
      </div>
    );
  }
  
  // Validate step - default to ROLE_SELECT for invalid steps
  const validSteps = ["ROLE_SELECT", "SHINE", "SCENARIO", "VIBE", "ORG", "DATES", "HIGHLIGHT", "RESPONSIBILITIES", "PREVIEW"];
  const validatedStep = validSteps.includes(step) ? step : "ROLE_SELECT";
  
  // Initialize empty user context (will be loaded client-side)
  const userContext: UserContext = {};
  
  // Get initial data for current step (SSR)
  let initialData = null;
  
  if (role && validatedStep !== "ROLE_SELECT") {
    try {
      const family = getRoleFamily(role);
      if (family) {
        const pack = getPack(role, family);
        
        if (validatedStep === "HIGHLIGHT" && pack) {
          const signals = { roleId: role, roleFamily: family } as any;
          initialData = {
            suggestions: rankHighlightSuggestions(signals, 5)
          };
        } else if (validatedStep === "RESPONSIBILITIES" && pack) {
          const signals = { roleId: role, roleFamily: family } as any;
          initialData = {
            ranked: rankResponsibilities(signals, pack)
          };
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error("Error getting role data:", error);
      }
    }
  }
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OnboardingClient 
        initialStep={validatedStep as any}
        initialRoleId={role}
        prevRoleId={prevRoleId}
        userContext={userContext}
        initialData={initialData}
      />
    </Suspense>
  );
}

