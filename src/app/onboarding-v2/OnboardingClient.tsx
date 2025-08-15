"use client";

import { useStepRouter } from "@/lib/useStepRouter";
import RoleSelect from "./steps/RoleSelect";
import HowYouShine from "./steps/HowYouShine";
import type { FlowStepId } from "@/contracts/onboarding";

interface OnboardingClientProps {
  initialStep: FlowStepId;
  initialRoleId?: string;
  prevRoleId?: string;
  initialData?: any;
}

export default function OnboardingClient({ 
  initialStep, 
  initialRoleId, 
  prevRoleId, 
  initialData 
}: OnboardingClientProps) {
  const router = useStepRouter(initialStep, initialRoleId, prevRoleId);

  // Debug logging to see what's happening
  console.log("OnboardingClient - currentStep:", router.currentStep);
  console.log("OnboardingClient - initialStep:", initialStep);

  // Render the appropriate step component
  switch (router.currentStep) {
    case "ROLE_SELECT":
      console.log("Rendering ROLE_SELECT");
      return <RoleSelect router={router} />;
    
    case "SHINE":
      console.log("Rendering SHINE");
      return <HowYouShine router={router} />;
    
    case "SCENARIO":
      return <div className="min-h-screen bg-white p-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Busy Shift Scenarios</h1>
          <p className="text-gray-600 mb-8">Coming soon...</p>
          <button 
            onClick={router.goNext}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg"
          >
            Continue
          </button>
        </div>
      </div>;
    
    case "VIBE":
      return <div className="min-h-screen bg-white p-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Vibe at Work</h1>
          <p className="text-gray-600 mb-8">Coming soon...</p>
          <button 
            onClick={router.goNext}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg"
          >
            Continue
          </button>
        </div>
      </div>;
    
    case "ORG":
      return <div className="min-h-screen bg-white p-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Organization</h1>
          <p className="text-gray-600 mb-8">Coming soon...</p>
          <button 
            onClick={router.goNext}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg"
          >
            Continue
          </button>
        </div>
      </div>;
    
    case "DATES":
      return <div className="min-h-screen bg-white p-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Dates</h1>
          <p className="text-gray-600 mb-8">Coming soon...</p>
          <button 
            onClick={router.goNext}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg"
          >
            Continue
          </button>
        </div>
      </div>;
    
    case "HIGHLIGHT":
      return <div className="min-h-screen bg-white p-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Career Highlights</h1>
          <p className="text-gray-600 mb-8">Coming soon...</p>
          <button 
            onClick={router.goNext}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg"
          >
            Continue
          </button>
        </div>
      </div>;
    
    case "RESPONSIBILITIES":
      return <div className="min-h-screen bg-white p-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Responsibilities</h1>
          <p className="text-gray-600 mb-8">Coming soon...</p>
          <button 
            onClick={router.goNext}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg"
          >
            Continue
          </button>
        </div>
      </div>;
    
    case "PREVIEW":
      return <div className="min-h-screen bg-white p-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Preview</h1>
          <p className="text-gray-600 mb-8">Coming soon...</p>
          <div className="space-y-3">
            <button 
              onClick={() => router.goToStep("ROLE_SELECT")}
              className="w-full px-6 py-3 bg-gray-500 text-white rounded-lg"
            >
              Add Another Role
            </button>
            <button 
              onClick={() => window.location.href = "/profile"}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg"
            >
              Finish Profile
            </button>
          </div>
        </div>
      </div>;
    
    default:
      console.log("Unknown step:", router.currentStep);
      return <div className="min-h-screen bg-white p-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unknown Step</h1>
          <p className="text-gray-600 mb-8">Step not found: {router.currentStep}</p>
          <button 
            onClick={() => router.goToStep("ROLE_SELECT")}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg"
          >
            Start Over
          </button>
        </div>
      </div>;
  }
}



