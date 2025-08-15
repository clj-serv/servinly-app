import { Suspense } from "react";
import OnboardingClient from "@/modules/onboarding-v2/OnboardingClient";

export default function RoleSelectPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OnboardingClient />
    </Suspense>
  );
}
