import React from "react";

interface FieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

export function Field({ label, error, required, children, className = "", htmlFor }: FieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className = "", ...props }: InputProps) {
  const baseClasses = "w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors";
  const errorClasses = error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300";
  const classes = `${baseClasses} ${errorClasses} ${className}`.trim();
  
  return <input className={classes} {...props} />;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ error, className = "", ...props }: TextareaProps) {
  const baseClasses = "w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-vertical";
  const errorClasses = error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300";
  const classes = `${baseClasses} ${errorClasses} ${className}`.trim();
  
  return <textarea className={classes} {...props} />;
}
