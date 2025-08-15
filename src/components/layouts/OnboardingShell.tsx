"use client";
import React from "react";

export default function OnboardingShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-[390px] min-h-screen bg-background">
      <div className="p-4 space-y-4">
        <header className="space-y-1">
          <h1 className="text-xl font-bold">{title}</h1>
          {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
        </header>
        {children}
      </div>
    </main>
  );
}

// Safety belt so TS always treats this file as a module
export {};
