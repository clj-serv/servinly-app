import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md" | "lg";
  onClick?: () => void;
}

export function Card({ 
  children, 
  className = "", 
  padding = "md",
  shadow = "sm",
  onClick
}: CardProps) {
  const baseClasses = "bg-white rounded-xl border border-gray-200";
  
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  };
  
  const shadowClasses = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg"
  };
  
  const classes = `${baseClasses} ${paddingClasses[padding]} ${shadowClasses[shadow]} ${className}`.trim();
  
  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
}
