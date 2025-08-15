import { useState, useCallback } from "react";

export interface ResponsibilityGroup {
  id: string;
  title: string;
  items: Array<{
    id: string;
    label: string;
  }>;
}

export interface ResponsibilitiesData {
  groups: ResponsibilityGroup[];
  pinned: string[];
  recommendedMix: string[];
}

export interface UseResponsibilitiesReturn {
  // State
  data: ResponsibilitiesData | null;
  selectedIds: string[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  load: (payload: {
    role: string;
    roleFamily: "bar" | "service" | "frontdesk" | "coffee" | "kitchen" | "management";
    shineKeys: string[];
    busyKeys: string[];
    vibeKey?: string;
    selectedHighlight?: string;
    useAI?: boolean;
  }) => Promise<void>;
  toggle: (id: string) => void;
  clear: () => void;
  
  // Computed
  isPinned: (id: string) => boolean;
  isSelected: (id: string) => boolean;
  canSelectMore: boolean;
  selectionCount: number;
  maxSelection: number;
}

export function useResponsibilities(maxSelection: number = 5): UseResponsibilitiesReturn {
  const [data, setData] = useState<ResponsibilitiesData | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (payload: {
    role: string;
    roleFamily: "bar" | "service" | "frontdesk" | "coffee" | "kitchen" | "management";
    shineKeys: string[];
    busyKeys: string[];
    vibeKey?: string;
    selectedHighlight?: string;
    useAI?: boolean;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/responsibilities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responsibilitiesData: ResponsibilitiesData = await response.json();
      setData(responsibilitiesData);
      setSelectedIds([]); // Reset selection when loading new data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load responsibilities");
      console.error("Failed to load responsibilities:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggle = useCallback((id: string) => {
    setSelectedIds(prev => {
      const isSelected = prev.includes(id);
      
      if (isSelected) {
        // Remove if already selected
        return prev.filter(itemId => itemId !== id);
      } else {
        // Add if under max limit
        if (prev.length >= maxSelection) {
          return prev; // Don't add if at max
        }
        return [...prev, id];
      }
    });
  }, [maxSelection]);

  const clear = useCallback(() => {
    setSelectedIds([]);
    setError(null);
  }, []);

  // Computed values
  const isPinned = useCallback((id: string) => {
    return data?.pinned.includes(id) || false;
  }, [data]);

  const isSelected = useCallback((id: string) => {
    return selectedIds.includes(id);
  }, [selectedIds]);

  const canSelectMore = selectedIds.length < maxSelection;
  const selectionCount = selectedIds.length;

  return {
    // State
    data,
    selectedIds,
    isLoading,
    error,
    
    // Actions
    load,
    toggle,
    clear,
    
    // Computed
    isPinned,
    isSelected,
    canSelectMore,
    selectionCount,
    maxSelection,
  };
}
