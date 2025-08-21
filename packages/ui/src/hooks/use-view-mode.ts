"use client";

import { useState, useEffect } from "react";

export type ViewMode = "grid" | "list";

export interface ViewModeState {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isLoaded: boolean;
}

export function useViewMode(storageKey: string): ViewModeState {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored && (stored === "grid" || stored === "list")) {
        setViewMode(stored as ViewMode);
      }
    } catch (error) {
      // Fallback to default if localStorage is not available
      console.warn("Could not load view mode from localStorage:", error);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey]);

  // Save to localStorage when viewMode changes
  const updateViewMode = (newMode: ViewMode) => {
    setViewMode(newMode);
    try {
      localStorage.setItem(storageKey, newMode);
    } catch (error) {
      console.warn("Could not save view mode to localStorage:", error);
    }
  };

  return {
    viewMode,
    setViewMode: updateViewMode,
    isLoaded,
  };
}
