"use client";

import { useState } from "react";
import type { UseStepRouterReturn } from "@/lib/useStepRouter";
import { Button } from "@/ui/Button";
import { Field, Input } from "@/ui/Field";
import { getLastRoleData } from "@/lib/storage";

type Props = { router: UseStepRouterReturn };

export default function Organization({ router }: Props) {
  const { signals, updateSignals, goNext, goPrev } = router;
  const [showCopyOption, setShowCopyOption] = useState(true);

  const handleCopyFromLastRole = () => {
    const lastRoleData = getLastRoleData();
    if (lastRoleData) {
      updateSignals({
        orgName: lastRoleData.orgName || signals.orgName,
        startDate: lastRoleData.startDate || signals.startDate,
        endDate: lastRoleData.endDate || signals.endDate,
        responsibilities: lastRoleData.responsibilities || signals.responsibilities
      });
      setShowCopyOption(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Form submission handled by button click
  };

  const lastRoleData = getLastRoleData();
  const canCopyFromLast = showCopyOption && lastRoleData && !signals.orgName;

  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Organization</h1>
            <p className="text-gray-600">Where do you work?</p>
          </div>

          {canCopyFromLast && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-blue-900">Copy from last role</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Use details from {lastRoleData.orgName} to speed up entry
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyFromLastRole}
                  className="min-h-[44px] px-4 text-base bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Copy Details
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Field label="Organization Name" required htmlFor="orgName">
              <Input
                id="orgName"
                name="orgName"
                value={signals.orgName || ""}
                onChange={(e) => updateSignals({ orgName: e.target.value })}
                onBlur={(e) => updateSignals({ orgName: e.target.value.trim() })}
                placeholder="Enter organization name"
                required
              />
            </Field>
          </form>
        </div>
      </div>
      
      {/* Sticky Footer */}
      <div className="sticky bottom-0 z-10 bg-white/95 backdrop-blur border-t border-gray-200 p-4 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-md mx-auto flex gap-3">
          <button
            type="button"
            onClick={goPrev}
            className="flex-1 min-h-[44px] px-4 text-base py-3 rounded-xl border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              const name = (signals.orgName ?? "").trim();
              if (name.length > 0) {
                goNext();
              }
            }}
            disabled={(() => {
              const name = (signals.orgName ?? "").trim();
              return name.length === 0;
            })()}
            className="flex-1 min-h-[44px] px-4 text-base py-3 rounded-xl bg-blue-600 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
