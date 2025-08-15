"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { ensureDevSession } from "@/lib/devAuth";
import { finalizeRole } from "../repos/profileRepo";
import type { UseStepRouterReturn } from "@/lib/useStepRouter";
import { getPack } from "@/role-engine/registry";
import { isAddAnotherEnabled } from '@/lib/flags';
import { getSessionUserId, getDevFakeUserId } from '@/lib/auth';
import { adaptSignalsToForm, buildBulletsFromSignals } from "@/lib/preview";
import { loadDraft } from "@/lib/storage";
import DevPanel from "@/components/debug/DevPanel";

interface PreviewProps {
  router: UseStepRouterReturn;
}

export default function Preview({ router }: PreviewProps) {
  const { signals, goPrev } = router;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nextRouter = useRouter();
  const search = useSearchParams();

  // Tiny safeguard: if someone landed here with fresh=1, strip it so drafts aren't wiped again
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("fresh") === "1") {
      sp.delete("fresh");
      const qs = sp.toString();
      nextRouter.replace(`/onboarding-v2?step=PREVIEW${qs ? `&${qs}` : ""}`, { scroll: false });
    }
  }, [nextRouter]);

  // Re-print auth debug logs on Preview mount
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.debug('ENV SAVE:', process.env.NEXT_PUBLIC_ONB_SUPABASE_SAVE);
      console.debug('ENV URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      getSessionUserId().then(uid => console.debug('session uid:', uid));
      ensureDevSession().then(uid => console.debug('dev uid:', uid));
    }
  }, []);

  const handleFinishProfile = async () => {
    if (process.env.NODE_ENV !== "production") console.debug("finish click", { isSubmitting });
    if (isSubmitting) return;
    
    // Safeguard: bail if missing roleId
    if (!signals.roleId) {
      console.debug('safeguard: missing roleId');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await finalizeRole(signals);
      if (!res.ok) {
        if (res.error === "AUTH_REQUIRED") {
          // Non-blocking toast/banner and redirect to signup
          setError("Please sign in to save your profile.");
          if (process.env.NODE_ENV !== "production") console.debug("auth required, redirecting to signup");
          nextRouter.push(`/signup?returnTo=${encodeURIComponent('/onboarding-v2?step=PREVIEW')}`);
          return;
        }
        // Other errors
        setError("Could not finish profile.");
        if (process.env.NODE_ENV !== "production") console.debug("finalize failed", res);
        return;
      }
      if (!res.id) {
        setError('Failed to save role');
        if (process.env.NODE_ENV !== "production") console.debug("finalize failed - no ID", res);
        return;
      }
      if (process.env.NODE_ENV !== "production") console.debug("finalize ok", { id: res.id });
      router.clearProgress?.();
      nextRouter.push("/profile");
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'An unexpected error occurred';
      setError(errorMsg);
      if (process.env.NODE_ENV !== "production") console.debug("finalize exception", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAnotherRole = () => {
    if (process.env.NODE_ENV !== "production") {
      console.debug("Preview: Add Another Role clicked", { signals });
    }
    nextRouter.push("/onboarding-v2?step=ROLE_SELECT");
  };

  const showAddAnother = isAddAnotherEnabled();

  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Preview</h1>
        <p className="text-gray-600">Review your information before submitting.</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900">Role</h3>
          <p className="text-gray-600">{signals.roleId}</p>
        </div>
        
        {signals.shineKeys.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900">How you shine</h3>
            <p className="text-gray-600">{signals.shineKeys.join(", ")}</p>
          </div>
        )}
        
        {signals.busyKeys.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900">Busy shift moments</h3>
            <p className="text-gray-600">{signals.busyKeys.join(", ")}</p>
          </div>
        )}
        
        {signals.vibeKey && (
          <div>
            <h3 className="font-semibold text-gray-900">Your vibe</h3>
            <p className="text-gray-600">{signals.vibeKey}</p>
          </div>
        )}
        
        {signals.orgName && (
          <div>
            <h3 className="font-semibold text-gray-900">Organization</h3>
            <p className="text-gray-600">{signals.orgName}</p>
          </div>
        )}
        
        {signals.startDate && (
          <div>
            <h3 className="font-semibold text-gray-900">Start Date</h3>
            <p className="text-gray-600">{new Date(signals.startDate).toLocaleDateString()}</p>
          </div>
        )}
        
        {signals.endDate && (
          <div>
            <h3 className="font-semibold text-gray-900">End Date</h3>
            <p className="text-gray-600">{new Date(signals.endDate).toLocaleDateString()}</p>
          </div>
        )}
        
        {signals.highlightText && (
          <div>
            <h3 className="font-semibold text-gray-900">Career Highlight</h3>
            <p className="text-gray-600">{signals.highlightText}</p>
          </div>
        )}
        
        {signals.responsibilities.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900">Responsibilities</h3>
            <ul className="list-disc list-inside text-gray-600">
              {signals.responsibilities.map((resp, index) => (
                <li key={index}>{resp}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-800 text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-600 text-sm underline mt-2"
          >
            Dismiss
          </button>
        </div>
      )}

        </div>
      </div>
      
      {/* Sticky Footer */}
      <div className="sticky bottom-0 z-20 bg-white border-t border-gray-200 p-4 pb-[env(safe-area-inset-bottom)]">
        <div className={`max-w-md mx-auto ${showAddAnother ? 'grid grid-cols-3 gap-3' : 'grid grid-cols-2 gap-3'}`}>
          <button
            type="button"
            onClick={goPrev}
            className="min-h-[44px] px-4 text-base py-3 rounded-xl border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isSubmitting}
          >
            Back
          </button>
          {showAddAnother && (
            <button
              type="button"
              onClick={handleAddAnotherRole}
              className="min-h-[44px] px-4 text-base py-3 rounded-xl bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
            >
              Add Another Role
            </button>
          )}
          <button
            type="button"
            data-testid="finish-profile"
            onClick={handleFinishProfile}
            disabled={isSubmitting}
            className="min-h-[44px] px-4 rounded-xl bg-blue-600 text-white disabled:opacity-50"
            aria-busy={isSubmitting ? "true" : "false"}
          >
            {isSubmitting ? "Finishing..." : "Finish Profile"}
          </button>
        </div>
      </div>
      
      <DevPanel currentStep="PREVIEW" lastFinalizeError={error} />
    </div>
  );
}
       