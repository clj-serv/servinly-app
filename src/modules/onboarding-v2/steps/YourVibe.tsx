"use client";

import { useMemo } from "react";
import type { UseStepRouterReturn } from "@/lib/useStepRouter";
import { getPack } from "@/role-engine/registry";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Chip } from "@/ui/Chip";

type Props = { router: UseStepRouterReturn };

export default function YourVibe({ router }: Props) {
  const { signals, updateSignals, goNext, goPrev } = router;

  const pack = useMemo(() => {
    if (!signals.roleId || !signals.roleFamily) return null;
    return getPack(signals.roleId, signals.roleFamily as any);
  }, [signals.roleId, signals.roleFamily]);

  if (!signals.roleId || !pack) return null;

  const selected = signals.vibeKey;

  const select = (id: string) => {
    updateSignals({ vibeKey: id });
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      select(id);
    }
  };

  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Your vibe at work</h1>
            <p className="text-gray-600">Pick one that best describes your work style.</p>
          </div>
          <div className="space-y-4">
            {pack.vibe.map((opt) => {
              const isSelected = selected === opt.id;
              
              return (
                <button
                  key={opt.id}
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => select(opt.id)}
                  onKeyDown={(e) => handleKeyDown(e, opt.id)}
                  className={`w-full min-h-[44px] p-4 rounded-xl border-2 text-left text-base transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="font-medium text-gray-900 mb-2">{opt.label}</div>
                  {opt.tags?.length ? (
                    <div className="flex flex-wrap gap-1">
                      {opt.tags.map((tag) => (
                        <Chip key={tag} size="sm" variant="outline">
                          {tag}
                        </Chip>
                      ))}
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>

        </div>
      </div>
      
      {/* Sticky Footer */}
      <div className="sticky bottom-0 z-10 bg-white/95 backdrop-blur border-t border-gray-200 p-4 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-md mx-auto flex gap-3">
          <button
            onClick={goPrev}
            className="flex-1 min-h-[44px] px-4 text-base py-3 rounded-xl border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back
          </button>
          <button
            onClick={goNext}
            disabled={!selected}
            className="flex-1 min-h-[44px] px-4 text-base py-3 rounded-xl bg-blue-600 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}



