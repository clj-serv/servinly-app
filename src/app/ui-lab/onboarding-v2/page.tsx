"use client";
import Link from "next/link";

const items: [string, string][] = [
  ["#", "FF-01 Role Select (Coming Soon)"],
  ["#", "FF-02 How You Shine (Coming Soon)"],
  ["#", "FF-03 Busy Shift (Coming Soon)"],
  ["#", "FF-04 Your Vibe (Coming Soon)"],
  ["#", "FF-05 Organization (Coming Soon)"],
  ["#", "FF-06 Dates (Coming Soon)"],
  ["#", "FF-07 Highlight (Coming Soon)"],
  ["#", "FF-08 Responsibilities (Coming Soon)"],
  ["#", "FF-09 Preview (Coming Soon)"],
  ["#", "SF-01 Confirm Role (Coming Soon)"],
  ["#", "SF-02 Same Style & Vibe (Coming Soon)"],
  ["#", "SF-03 Organization (Coming Soon)"],
  ["#", "SF-04 Dates (Coming Soon)"],
  ["#", "SF-05 Highlight (Coming Soon)"],
  ["#", "SF-06 Responsibilities (Coming Soon)"],
  ["#", "SF-07 Preview (Coming Soon)"],
];

export default function UILabOnboarding() {
  return (
    <main className="mx-auto max-w-[420px] p-4 space-y-3">
      <h1 className="text-xl font-bold">UI‑Lab — Onboarding V2</h1>
      <ul className="space-y-2">
        {items.map(([href, label]) => (
          <li key={href}>
            <Link href={href} className="underline text-primary">{label}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
