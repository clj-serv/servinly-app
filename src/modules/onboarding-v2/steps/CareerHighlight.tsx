"use client";

import type { UseStepRouterReturn } from "@/lib/useStepRouter";
import { Field, Textarea } from "@/ui/Field";
import { Card } from "@/ui/Card";

type Props = { router: UseStepRouterReturn; initialData?: any };

export default function CareerHighlight({ router, initialData }: Props) {
  const { signals, updateSignals, goNext, goPrev } = router;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Form submission handled by button click
  };

  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Career Highlight</h1>
            <p className="text-gray-600">Share a memorable achievement or experience.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Field label="Career Highlight" required htmlFor="highlightText">
              <Textarea
                id="highlightText"
                name="highlightText"
                value={signals.highlightText ?? ""}
                onChange={(e) => updateSignals({ highlightText: e.target.value })}
                onBlur={(e) => updateSignals({ highlightText: e.target.value.trim() })}
                rows={4}
                placeholder="Describe a memorable achievement, challenge overcome, or experience that showcases your skills..."
                required
                className="min-h-[44px]"
              />
            </Field>

            {initialData && (
              <Card padding="md" className="bg-blue-50 border-blue-200">
                <h3 className="font-medium text-blue-900 mb-3">Suggestions</h3>
                <div className="space-y-2">
                  {initialData.map((suggestion: any, index: number) => (
                    <Card
                      key={index}
                      padding="sm"
                      className="cursor-pointer hover:shadow-sm border-blue-200 hover:border-blue-300 bg-white min-h-[44px] flex items-center"
                      onClick={() => updateSignals({ highlightText: suggestion.text })}
                    >
                      <p className="text-sm text-blue-800">{suggestion.text}</p>
                    </Card>
                  ))}
                </div>
              </Card>
            )}
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
              const canContinue = (signals.highlightText ?? "").trim().length > 0;
              if (canContinue) {
                goNext();
              }
            }}
            disabled={(() => {
              const canContinue = (signals.highlightText ?? "").trim().length > 0;
              return !canContinue;
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
