import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({ 
  variant = "primary", 
  size = "md", 
  fullWidth = false,
  className = "",
  children,
  ...props 
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300",
    secondary: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500"
  };
  
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg"
  };
  
  const widthClass = fullWidth ? "w-full" : "";
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`.trim();
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
