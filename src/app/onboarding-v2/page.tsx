// use server component, but NEVER call notFound here
import { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamic import to prevent SSR issues with Supabase client
const OnboardingClient = dynamic(() => import("@/modules/onboarding-v2/OnboardingClient"), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>
});

export default function OnboardingPage() {
  return (
    <Suspense fallback={null}>
      {/* All step validation + redirects happen in the client */}
      <OnboardingClient />
    </Suspense>
  );
}
