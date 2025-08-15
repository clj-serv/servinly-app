"use client";

import { useMemo } from "react";
import type { UseStepRouterReturn } from "@/lib/useStepRouter";
import { getPack } from "@/role-engine/registry";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Chip } from "@/ui/Chip";

type Props = { router: UseStepRouterReturn };

export default function BusyShiftScenario({ router }: Props) {
  const { signals, updateSignals, goNext, goPrev } = router;

  const pack = useMemo(() => {
    if (!signals.roleId || !signals.roleFamily) return null;
    return getPack(signals.roleId, signals.roleFamily as any);
  }, [signals.roleId, signals.roleFamily]);

  if (!signals.roleId || !pack) return null;

  const selected = signals.busyKeys ?? [];
  const max = 2;

  const toggle = (id: string) => {
    const has = selected.includes(id);
    if (has) {
      updateSignals({ busyKeys: selected.filter((x: string) => x !== id) });
    } else if (selected.length < max) {
      updateSignals({ busyKeys: [...selected, id] });
    }
    // Silent ignore if at max - no error or feedback
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggle(id);
    }
  };

  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Busy shift moment</h1>
            <p className="text-gray-600">Pick up to {max} that sound like you during a rush.</p>
          </div>
          <div className="space-y-4">
            {pack.scenarios.map((opt) => {
              const isSelected = selected.includes(opt.id);
              const isDisabled = !isSelected && selected.length >= max;
              
              return (
                <button
                  key={opt.id}
                  role="checkbox"
                  aria-checked={isSelected}
                  aria-disabled={isDisabled}
                  onClick={() => toggle(opt.id)}
                  onKeyDown={(e) => handleKeyDown(e, opt.id)}
                  className={`w-full min-h-[44px] p-4 rounded-xl border-2 text-left text-base transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : isDisabled
                      ? "border-gray-200 bg-gray-50 opacity-60"
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
            disabled={selected.length === 0}
            className="flex-1 min-h-[44px] px-4 text-base py-3 rounded-xl bg-blue-600 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}



