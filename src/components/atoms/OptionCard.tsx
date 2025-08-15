"use client";
import React from "react";

type Props = {
  title: string;
  description?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export default function OptionCard({ title, description, selected, disabled, onClick }: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "w-full text-left rounded-2xl border p-4 transition",
        "bg-card border-border shadow-card",
        selected ? "ring-2 ring-primary" : "hover:bg-muted",
        disabled && "opacity-50 cursor-not-allowed",
      ].join(" ")}
    >
      <div className="text-base font-semibold">{title}</div>
      {description ? (
        <div className="text-sm text-muted-foreground mt-1 leading-relaxed">{description}</div>
      ) : null}
    </button>
  );
}
