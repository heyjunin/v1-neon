"use client";

import { useEffect, useState } from "react";

type ViewMode = "grid" | "list";

const STORAGE_KEY = "organizations-view-mode";

export function useViewMode() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && (stored === "grid" || stored === "list")) {
        setViewMode(stored as ViewMode);
      }
    } catch (error) {
      // Fallback to default if localStorage is not available
      console.warn("Could not load view mode from localStorage:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage when viewMode changes
  const updateViewMode = (newViewMode: ViewMode) => {
    setViewMode(newViewMode);
    try {
      localStorage.setItem(STORAGE_KEY, newViewMode);
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
