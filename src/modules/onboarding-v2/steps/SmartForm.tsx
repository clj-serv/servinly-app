"use client";

import { useState } from "react";
import { useMemo } from "react";
import type { UseStepRouterReturn } from "@/lib/useStepRouter";
import { getPack } from "@/role-engine/registry";
import { Field, Input, Textarea } from "@/ui/Field";
// Using simple text chevrons instead of heroicons for simplicity
const ChevronDownIcon = ({ className }: { className?: string }) => <span className={className || "text-gray-500"}>▼</span>;
const ChevronRightIcon = ({ className }: { className?: string }) => <span className={className || "text-gray-500"}>▶</span>;

type Props = { router: UseStepRouterReturn };

interface ExpanderState {
  organization: boolean;
  dates: boolean;
  responsibilities: boolean;
  highlight: boolean;
}

export default function SmartForm({ router }: Props) {
  const { signals, updateSignals, goNext, goPrev } = router;
  
  // Progressive disclosure state
  const [expanded, setExpanded] = useState<ExpanderState>({
    organization: !signals.orgName,
    dates: !signals.startDate,
    responsibilities: signals.responsibilities.length === 0,
    highlight: !signals.highlightText,
  });

  // Get role content pack for responsibilities
  const pack = useMemo(() => {
    if (!signals.roleId || !signals.roleFamily) return null;
    return getPack(signals.roleId, signals.roleFamily as any);
  }, [signals.roleId, signals.roleFamily]);

  const toggleExpander = (section: keyof ExpanderState) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleNext = () => {
    // Simple validation and navigation - form data is handled by individual field updates
    goNext();
  };

  // Validation - check if at least organization is filled
  const name = (signals.orgName ?? "").trim();
  const isValid = name.length > 0;

  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Experience Details</h1>
            <p className="text-gray-600">Tell us about your work experience in this role.</p>
          </div>

          <div className="space-y-8">
            {/* Organization Section */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => toggleExpander('organization')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <h2 className="text-lg font-semibold text-gray-900 scroll-mt-20">Organization</h2>
                {expanded.organization ? (
                  <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {expanded.organization && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Field label="Organization Name" required>
                    <Input
                      id="orgName"
                      name="orgName"
                      value={signals.orgName || ""}
                      onChange={(e) => updateSignals({ orgName: e.target.value })}
                      onBlur={(e) => updateSignals({ orgName: e.target.value.trim() })}
                      placeholder="Enter organization name"
                    />
                  </Field>
                </div>
              )}
            </div>
            
            {/* Dates Section */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => toggleExpander('dates')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <h2 className="text-lg font-semibold text-gray-900 scroll-mt-20">Employment Dates</h2>
                {expanded.dates ? (
                  <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {expanded.dates && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Start Date" required>
                      <Input
                        type="date"
                        id="startDate"
                        name="startDate"
                        defaultValue={signals.startDate || ""}
                      />
                    </Field>
                    
                    <Field label="End Date (optional)">
                      <Input
                        type="date"
                        id="endDate"
                        name="endDate"
                        defaultValue={signals.endDate || ""}
                      />
                    </Field>
                  </div>
                </div>
              )}
            </div>

            {/* Responsibilities Section */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => toggleExpander('responsibilities')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <h2 className="text-lg font-semibold text-gray-900 scroll-mt-20">Key Responsibilities</h2>
                {expanded.responsibilities ? (
                  <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {expanded.responsibilities && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-4">Select the responsibilities that apply to your role.</p>
                  <div className="space-y-2">
                    {signals.responsibilities.map((resp, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`resp-${index}`}
                          name="responsibilities"
                          value={resp}
                          defaultChecked
                          className="mr-2"
                        />
                        <label htmlFor={`resp-${index}`} className="text-sm text-gray-700">
                          {resp}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Career Highlight Section */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => toggleExpander('highlight')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <h2 className="text-lg font-semibold text-gray-900 scroll-mt-20">Career Highlight</h2>
                {expanded.highlight ? (
                  <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {expanded.highlight && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Field label="Share a memorable achievement or experience">
                    <Textarea
                      id="highlightText"
                      name="highlightText"
                      defaultValue={signals.highlightText || ""}
                      rows={4}
                      placeholder="Describe a memorable achievement, challenge overcome, or experience that showcases your skills..."
                    />
                  </Field>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Sticky Footer */}
      <div className="sticky bottom-0 z-10 bg-white/95 backdrop-blur border-t border-gray-200 p-4 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleNext}
            disabled={!isValid}
            className="w-full min-h-[44px] px-4 text-base py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
