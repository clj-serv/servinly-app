"use client";

import type { UseStepRouterReturn } from "@/lib/useStepRouter";

type Props = { router: UseStepRouterReturn };

export default function Dates({ router }: Props) {
  const { signals, updateSignals, goNext, goPrev } = router;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    
    updateSignals({ startDate, endDate });
    goNext();
  };

  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Dates</h1>
            <p className="text-gray-600">When did you work in this role?</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  defaultValue={signals.startDate || ""}
                  className="w-full min-h-[44px] p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date (optional)
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  defaultValue={signals.endDate || ""}
                  className="w-full min-h-[44px] p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
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
              const form = document.querySelector('form') as HTMLFormElement;
              if (form) {
                const formData = new FormData(form);
                const startDate = formData.get("startDate") as string;
                const endDate = formData.get("endDate") as string;
                updateSignals({ startDate, endDate });
                goNext();
              }
            }}
            className="flex-1 min-h-[44px] px-4 text-base py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
