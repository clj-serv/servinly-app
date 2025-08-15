"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useStepRouter } from "@/lib/useStepRouter";
import { guard } from "@/lib/onboardingRouter";
import { loadSignupUser } from "../signup/storage";
import type { FlowStepId, UserContext } from "@/contracts/onboarding";

// Import real step components
import RoleSelect from "./steps/RoleSelect";
import HowYouShine from "./steps/HowYouShine";
import BusyShiftScenario from "./steps/BusyShiftScenario";
import YourVibe from "./steps/YourVibe";
import Organization from "./steps/Organization";
import Dates from "./steps/Dates";
import CareerHighlight from "./steps/CareerHighlight";
import Responsibilities from "./steps/Responsibilities";
import Preview from "./steps/Preview";

// Dev-only debug component
import ClientStateReport from "@/components/debug/ClientStateReport";
import { isDebugUIEnabled, getOriginSafely } from '@/lib/debug';

export default function OnboardingClient() {

  const search = useSearchParams();
  const nextRouter = useRouter();
  const stepRouter = useStepRouter();
  const [user, setUser] = useState<UserContext | null>(null);

  // Load signup user data on client side
  useEffect(() => {
    const signupUser = loadSignupUser();
    if (signupUser) {
      setUser(signupUser);
    }
  }, []);

  // 1) Normalize step safely
  useEffect(() => {
    const stepParam = (search.get("step") || "ROLE_SELECT") as any;
    // guard returns boolean only — never throw here
    if (!guard(stepParam, stepRouter.signals)) {
      // redirect client-side to nearest valid step
      const fallback = stepRouter.signals.roleId ? "SHINE" : "ROLE_SELECT";
      if (process.env.NODE_ENV !== "production") {
        console.debug("guard=false; soft redirect", { stepParam, fallback, signals: stepRouter.signals });
      }
      nextRouter.replace(`/onboarding-v2?step=${fallback}`);
    }
  }, [search, stepRouter.signals, nextRouter]);

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div>
      {/* Dev-only debug component - gated by debug flag */}
      {isDebugUIEnabled() && <ClientStateReport />}
      
      {/* Render the appropriate step component */}
      {(() => {
        switch (stepRouter.currentStep) {
          case "ROLE_SELECT":
            return <RoleSelect router={stepRouter} user={user} />;
          case "SHINE":
            return <HowYouShine router={stepRouter} />;
          case "SCENARIO":
            return <BusyShiftScenario router={stepRouter} />;
          case "VIBE":
            return <YourVibe router={stepRouter} />;
          case "ORG":
            return <Organization router={stepRouter} />;
          case "DATES":
            return <Dates router={stepRouter} />;
          case "HIGHLIGHT":
            return <CareerHighlight router={stepRouter} />;
          case "RESPONSIBILITIES":
            return <Responsibilities router={stepRouter} />;
          case "PREVIEW":
            return <Preview router={stepRouter} />;
          default:
            return <div>Unknown step: {stepRouter.currentStep}</div>;
        }
      })()}
      
      {/* Dev build marker footer */}
      {isDebugUIEnabled() && (
        <div className="fixed bottom-0 left-0 right-0 bg-yellow-100 border-t border-yellow-300 px-4 py-2 text-xs text-yellow-800 z-50">
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            <span>
              DEV BUILD v{process.env.npm_package_version || '2.0'} | {getOriginSafely()}
            </span>
            <span className="text-yellow-600">
              Onboarding V2 Debug Mode
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
