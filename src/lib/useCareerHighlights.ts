import { useState, useCallback } from "react";

export interface CareerHighlight {
  suggestions: string[];
  alternates?: string[];
}

export interface CareerHighlightInput {
  role: string;
  roleFamily: "bar" | "service" | "frontdesk" | "coffee" | "kitchen" | "management";
  shineKeys: string[];
  busyKeys: string[];
  vibeKey?: string;
}

export interface UseCareerHighlightsReturn {
  // State
  suggestions: string[];
  alternates: string[];
  selected: string[];
  customText: string;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  load: (payload: CareerHighlightInput) => Promise<void>;
  togglePick: (line: string, max?: number) => void;
  setCustomText: (text: string) => void;
  addFromInput: () => void;
  clear: () => void;
  
  // Computed
  hasSelection: boolean;
  canContinue: boolean;
}

export function useCareerHighlights(maxSelection: number = 1): UseCareerHighlightsReturn {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [alternates, setAlternates] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [customText, setCustomText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (payload: CareerHighlightInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/highlights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CareerHighlight = await response.json();
      setSuggestions(data.suggestions);
      setAlternates(data.alternates || []);
      setSelected([]); // Reset selection when loading new suggestions
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load suggestions");
      console.error("Failed to load career highlights:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const togglePick = useCallback((line: string, max: number = maxSelection) => {
    setSelected(prev => {
      const isSelected = prev.includes(line);
      
      if (isSelected) {
        // Remove if already selected
        return prev.filter(item => item !== line);
      } else {
        // Add if under max limit
        if (prev.length >= max) {
          // Replace the first item if at max
          return [line];
        } else {
          return [...prev, line];
        }
      }
    });
  }, [maxSelection]);

  const addFromInput = useCallback(() => {
    if (!customText.trim()) return;
    
    const newSuggestion = customText.trim();
    
    // Add to suggestions if not already present
    if (!suggestions.includes(newSuggestion)) {
      setSuggestions(prev => [newSuggestion, ...prev.slice(0, 4)]); // Keep max 5
    }
    
    // Select the custom text
    setSelected([newSuggestion]);
    setCustomText(""); // Clear input
  }, [customText, suggestions]);

  const clear = useCallback(() => {
    setSelected([]);
    setCustomText("");
    setError(null);
  }, []);

  // Computed values
  const hasSelection = selected.length > 0;
  const canContinue = hasSelection || customText.trim().length > 0;

  return {
    // State
    suggestions,
    alternates,
    selected,
    customText,
    isLoading,
    error,
    
    // Actions
    load,
    togglePick,
    setCustomText,
    addFromInput,
    clear,
    
    // Computed
    hasSelection,
    canContinue,
  };
}
