import React from "react";

interface ProgressProps {
  current: number;
  total: number;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Progress({ 
  current, 
  total, 
  showText = true, 
  size = "md",
  className = ""
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));
  
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };
  
  return (
    <div className={`space-y-2 ${className}`}>
      {showText && (
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Step {current} of {total}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div 
          className="h-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
