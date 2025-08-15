"use client";

import { useState, useMemo } from "react";
import type { UseStepRouterReturn } from "@/lib/useStepRouter";
import { getPack } from "@/role-engine/registry";
import { Button } from "@/ui/Button";
import { Field, Input } from "@/ui/Field";
import { Card } from "@/ui/Card";
import { Chip } from "@/ui/Chip";

type Props = { router: UseStepRouterReturn };

export default function Responsibilities({ router }: Props) {
  const { signals, updateSignals, goNext, goPrev } = router;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResponsibilities, setSelectedResponsibilities] = useState<string[]>(signals.responsibilities || []);

  // Get role content pack for responsibilities
  const pack = useMemo(() => {
    if (!signals.roleId || !signals.roleFamily) return null;
    return getPack(signals.roleId, signals.roleFamily as any);
  }, [signals.roleId, signals.roleFamily]);

  // Flatten all responsibilities into searchable list
  const allResponsibilities = useMemo(() => {
    if (!pack) return [];
    return pack.responsibilities.flatMap(group => 
      group.items.map(item => item.label)
    );
  }, [pack]);

  // Filter responsibilities based on search
  const filteredResponsibilities = useMemo(() => {
    if (!searchTerm) return allResponsibilities;
    return allResponsibilities.filter(resp => 
      resp.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allResponsibilities, searchTerm]);

  // Common responsibility presets by role family
  const commonPresets = useMemo(() => {
    if (!pack) return [];
    const family = signals.roleFamily;
    
    const presets: Record<string, string[]> = {
      bar: ["Prepare drinks", "Take drink orders", "Maintain bar inventory", "Clean and maintain equipment"],
      service: ["Greet and welcome guests", "Take food and drink orders", "Serve food and beverages", "Set and clear tables"],
      management: ["Supervise and train staff", "Manage inventory and supplies", "Ensure quality standards", "Handle staff scheduling"],
      kitchen: ["Prepare food items", "Follow recipes and standards", "Maintain kitchen cleanliness", "Ensure kitchen safety"]
    };
    
    return presets[family as keyof typeof presets] || [];
  }, [pack, signals.roleFamily]);

  const toggleResponsibility = (resp: string) => {
    const newSelected = selectedResponsibilities.includes(resp)
      ? selectedResponsibilities.filter(r => r !== resp)
      : [...selectedResponsibilities, resp];
    
    setSelectedResponsibilities(newSelected);
    updateSignals({ responsibilities: newSelected });
  };

  const selectCommonSet = () => {
    const newSelected = [...new Set([...selectedResponsibilities, ...commonPresets])];
    setSelectedResponsibilities(newSelected);
    updateSignals({ responsibilities: newSelected });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateSignals({ responsibilities: selectedResponsibilities });
    goNext();
  };

  const maxRecommended = 8;
  const isOverRecommended = selectedResponsibilities.length > maxRecommended;

  if (!pack) return null;

  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Key Responsibilities</h1>
            <p className="text-gray-600">Select responsibilities that apply to your role.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Common Set Preset */}
        {commonPresets.length > 0 && (
          <Card padding="md" className="bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-blue-900">Quick start</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Select common {signals.roleFamily} responsibilities
                </p>
              </div>
              <Button 
                type="button" 
                variant="secondary"
                onClick={selectCommonSet}
                className="bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
              >
                Select Common Set
              </Button>
            </div>
          </Card>
        )}

        {/* Search Field */}
        <Field label="Search responsibilities">
          <Input
            type="text"
            placeholder="Type to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Field>

        {/* Selected Count with UX Hint */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {selectedResponsibilities.length} selected
            {isOverRecommended && (
              <span className="text-amber-600 ml-2">
                • Consider focusing on {maxRecommended} key responsibilities
              </span>
            )}
          </span>
        </div>

        {/* Selected Responsibilities as Chips */}
        {selectedResponsibilities.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Selected:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedResponsibilities.map((resp) => (
                <Chip
                  key={resp}
                  variant="solid"
                  className="bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                  onClick={() => toggleResponsibility(resp)}
                >
                  {resp} ×
                </Chip>
              ))}
            </div>
          </div>
        )}

        {/* Available Responsibilities as Chips */}
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900">Available:</h3>
          <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
            {filteredResponsibilities
              .filter(resp => !selectedResponsibilities.includes(resp))
              .map((resp) => (
                <Chip
                  key={resp}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleResponsibility(resp)}
                >
                  + {resp}
                </Chip>
              ))}
          </div>
          {filteredResponsibilities.length === 0 && searchTerm && (
            <p className="text-sm text-gray-500 italic">No responsibilities match "{searchTerm}"</p>
          )}
        </div>

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
              updateSignals({ responsibilities: selectedResponsibilities });
              goNext();
            }}
            className="flex-1 min-h-[44px] px-4 text-base py-3 rounded-xl bg-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
