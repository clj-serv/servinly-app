import React from "react";

interface ChipProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  variant?: "default" | "outline" | "solid";
  size?: "sm" | "md";
  className?: string;
}

export function Chip({ 
  children, 
  selected = false, 
  onClick,
  variant = "default",
  size = "md",
  className = ""
}: ChipProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 cursor-pointer";
  
  const sizeClasses = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm"
  };
  
  const variantClasses = {
    default: selected 
      ? "bg-blue-100 text-blue-800 border border-blue-200" 
      : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200",
    outline: selected
      ? "bg-blue-50 text-blue-700 border-2 border-blue-500"
      : "bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400",
    solid: selected
      ? "bg-blue-600 text-white border border-blue-600"
      : "bg-gray-200 text-gray-700 border border-gray-200 hover:bg-gray-300"
  };
  
  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`.trim();
  
  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
}
