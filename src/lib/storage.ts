import type { TOnboardingSignals, OnboardingState } from "@/contracts/onboarding";

const DRAFT_KEY = "onboarding_draft";
const SIGNALS_KEY = "onboarding_signals";
const DRAFT_VERSION = 2; // bump when contracts change

type DraftData = {
  schemaVersion: number;
  currentStep: string;
  signals: TOnboardingSignals;
  timestamp: number;
};

// Local storage fallback
function getLocalStorage<T>(key: string): T | null {
  if (typeof window !== "undefined") {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.warn(`Failed to get localStorage item ${key}:`, e);
      return null;
    }
  }
  return null;
}

function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Failed to set localStorage item ${key}:`, e);
    }
  }
}

// Supabase integration (when available)
async function persistToSupabase(data: OnboardingState): Promise<boolean> {
  // TODO: Implement Supabase persistence
  return false;
}

export function saveDraft(data: OnboardingState): void {
  // Always write schemaVersion: DRAFT_VERSION
  const versionedData: DraftData = {
    schemaVersion: DRAFT_VERSION,
    currentStep: data.currentStep,
    signals: data.signals,
    timestamp: data.timestamp
  };
  setLocalStorage(DRAFT_KEY, versionedData);
  // Try to persist to Supabase in background
  persistToSupabase(data).catch(console.warn);
}

export function loadDraft(): OnboardingState | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(DRAFT_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as DraftData;
        // If missing or schemaVersion !== DRAFT_VERSION, clear and return null
        if (!parsed || parsed.schemaVersion !== DRAFT_VERSION) {
          clearDraft();
          return null;
        }
        // Convert back to OnboardingState format
        return {
          currentStep: parsed.currentStep as any,
          flow: "FULL", // Default flow
          signals: parsed.signals,
          timestamp: parsed.timestamp
        };
      } catch (e) {
        console.warn("Failed to parse stored draft:", e);
        clearDraft();
      }
    }
  }
  return null;
}

export function saveSignals(signals: TOnboardingSignals): void {
  setLocalStorage(SIGNALS_KEY, signals);
}

export function loadSignals(): TOnboardingSignals | null {
  return getLocalStorage<TOnboardingSignals>(SIGNALS_KEY);
}

export function clearDraft(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem(SIGNALS_KEY);
  }
}

/**
 * Get the most recent role data from draft storage for prefill
 * Returns orgName, startDate, endDate, responsibilities if available
 */
export function getLastRoleData(): Partial<Pick<TOnboardingSignals, 'orgName' | 'startDate' | 'endDate' | 'responsibilities'>> | null {
  const draft = loadDraft();
  if (!draft || !draft.signals) return null;
  
  const { orgName, startDate, endDate, responsibilities } = draft.signals;
  
  // Only return if we have at least organization name
  if (!orgName) return null;
  
  return {
    orgName,
    startDate,
    endDate,
    responsibilities: responsibilities || []
  };
}

export function hasDraft(): boolean {
  return getLocalStorage(DRAFT_KEY) !== null;
}

export function getDraftAge(): number | null {
  const draft = getLocalStorage<OnboardingState>(DRAFT_KEY);
  if (!draft?.timestamp) return null;
  return Date.now() - draft.timestamp;
}

export function isDraftStale(maxAgeMs: number = 24 * 60 * 60 * 1000): boolean {
  const age = getDraftAge();
  return age !== null && age > maxAgeMs;
}
