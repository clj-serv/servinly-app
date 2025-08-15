// src/lib/preview.ts
// Safe helpers + preview builders for onboarding data.

import type { TOnboardingSignals } from "@/contracts/onboarding";

// ---------- Types ----------
export type PreviewBullet = { icon?: string; text: string };

export type OnboardingForm = {
  role?: string;
  organization?: string;
  location?: string;
  startDate?: unknown;        // Accept unknown; we'll sanitize to "Mon YYYY"
  endDate?: unknown;
  currentlyWorking?: boolean;

  responsibilities?: string[];
  highlights?: string[];
  busyShift?: string[];
  howYouShine?: string[];
  skills?: string[];

  // traits can be either ids[] or a score map
  traits?: string[] | Record<string, number>;

  // optional vibe flag for preview text
  vibe?: "same" | "different" | string;
};

// ---------- Date formatting (safe) ----------
const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
];

const isYearMonth = (v: unknown): v is string =>
  typeof v === "string" && /^\d{4}-\d{2}$/.test(v);

/** Format "YYYY-MM" -> "Mon YYYY". Returns empty string if invalid. */
function fmtYM(v: unknown): string {
  if (!isYearMonth(v)) return "";
  const [year, month] = v.split("-");
  const idx = parseInt(month, 10) - 1;
  if (Number.isNaN(idx) || idx < 0 || idx > 11) return "";
  return `${MONTHS[idx]} ${year}`;
}

/** Returns a single human string like "Jan 2024 – Present" (or "") */
export function formatDates(
  start?: unknown,
  end?: unknown,
  isCurrent?: boolean
): string {
  const s = fmtYM(start);
  const e = isCurrent ? "Present" : fmtYM(end);
  if (!s && !e) return "";
  if (!s) return e;
  if (!e) return s;
  return `${s} – ${e}`;
}

// ---------- Trait helpers ----------
/** "people-person" -> "People Person" (or pick top-N from score map) */
export function humanizeTraits(input?: string[] | Record<string, number> | null, max = 5): string {
  if (!input) return "";
  const toTitle = (s: string) =>
    s.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  if (Array.isArray(input)) {
    return input.filter(Boolean).slice(0, max).map((t) => toTitle(String(t))).join(", ");
  }

  const top = Object.entries(input)
    .filter(([k]) => !!k)
    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
    .slice(0, max)
    .map(([k]) => toTitle(k));
  return top.join(", ");
}

// ---------- Preview builders ----------
export function buildHeadline(form: Partial<OnboardingForm>): string {
  const parts: string[] = [];
  if (form.role) parts.push(form.role);
  if (form.organization) parts.push(`at ${form.organization}`);
  if (form.location) parts.push(`— ${form.location}`);
  const main = parts.join(" ");
  const dates = formatDates(form.startDate, form.endDate, form.currentlyWorking);
  return [main || "Role", dates ? `(${dates})` : ""].filter(Boolean).join(" ");
}

export function buildBullets(
  form: Partial<OnboardingForm>,
  opts?: { max?: number }
): PreviewBullet[] {
  const max = opts?.max ?? 6;
  const out: PreviewBullet[] = [];

  if (form.responsibilities?.length) {
    out.push(...form.responsibilities.filter(Boolean).slice(0, 3).map((t) => ({ icon: "•", text: t })));
  }

  if (form.highlights?.length) {
    out.push(...form.highlights.filter(Boolean).slice(0, 2).map((t) => ({ icon: "★", text: t })));
  }

  if (form.busyShift?.length) {
    out.push(...form.busyShift.filter(Boolean).slice(0, 1).map((t) => ({ icon: "⚡", text: t })));
  }

  if (form.howYouShine?.length) {
    out.push(...form.howYouShine.filter(Boolean).slice(0, 1).map((t) => ({ icon: "✨", text: t })));
  }

  if (form.skills?.length) {
    const skills = form.skills.filter(Boolean).slice(0, 6).join(", ");
    if (skills) out.push({ icon: "🛠️", text: `Skills: ${skills}` });
  }

  const traitsLine = humanizeTraits(form.traits, 5);
  if (traitsLine) out.push({ icon: "🧭", text: `Traits: ${traitsLine}` });

  if (form.vibe === "same") out.push({ icon: "🎛️", text: "Same style as previous role" });
  else if (form.vibe === "different") out.push({ icon: "🎛️", text: "Felt different from previous role" });

  if (!out.length) {
    out.push({ icon: "•", text: "Add responsibilities, highlights, or key moments to see a preview." });
  }
  return out.slice(0, max);
}

/** Optional: grouped sections if your UI renders them */
export function buildPreviewSections(form: Partial<OnboardingForm>) {
  return [
    { title: "Responsibilities", items: (form.responsibilities ?? []).filter(Boolean) },
    { title: "Highlights", items: (form.highlights ?? []).filter(Boolean) },
    { title: "Busy Shifts", items: (form.busyShift ?? []).filter(Boolean) },
    { title: "How You Shine", items: (form.howYouShine ?? []).filter(Boolean) },
  ].filter((s) => s.items.length > 0);
}

// ---------- Signals Adapter ----------
/**
 * Pure adapter function that maps TOnboardingSignals to OnboardingForm
 * Bridges the gap between contracts (shineKeys) and preview helpers (howYouShine)
 */
export function adaptSignalsToForm(signals: TOnboardingSignals): Partial<OnboardingForm> {
  return {
    role: signals.roleId,
    organization: signals.orgName,
    startDate: signals.startDate,
    endDate: signals.endDate,
    responsibilities: signals.responsibilities,
    highlights: signals.highlightText ? [signals.highlightText] : [],
    busyShift: signals.busyKeys,
    howYouShine: signals.shineKeys, // ← Key mapping: shineKeys → howYouShine
    traits: signals.shineKeys, // Also map to traits for compatibility
    vibe: signals.vibeKey,
  };
}

/**
 * Convenience function to build bullets directly from signals
 */
export function buildBulletsFromSignals(
  signals: TOnboardingSignals,
  opts?: { max?: number }
): PreviewBullet[] {
  const form = adaptSignalsToForm(signals);
  return buildBullets(form, opts);
}

/**
 * Convenience function to build sections directly from signals
 */
export function buildPreviewSectionsFromSignals(signals: TOnboardingSignals) {
  const form = adaptSignalsToForm(signals);
  return buildPreviewSections(form);
}