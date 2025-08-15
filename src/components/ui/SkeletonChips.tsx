import React from "react";

export default function SkeletonChips() {
  return (
    <div className="space-y-4">
      {/* Loading message */}
      <div className="text-center py-6">
        <div className="text-base font-medium text-gray-900 mb-2">
          Personalizing from your answers...
        </div>
        <div className="text-sm text-gray-500">
          This will just take a moment
        </div>
      </div>
      
      {/* Skeleton suggestion pills */}
      <div className="grid grid-cols-1 gap-2">
        {[1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className="h-12 bg-gray-100 rounded-xl animate-pulse"
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
