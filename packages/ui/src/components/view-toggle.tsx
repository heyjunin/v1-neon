"use client";

import { Button } from "@v1/ui/button";
import { Grid3X3, List } from "lucide-react";
import type { ViewMode } from "../hooks/use-view-mode";

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  isLoaded?: boolean;
}

export function ViewToggle({ viewMode, onViewModeChange, isLoaded = true }: ViewToggleProps) {
  if (!isLoaded) return null;

  return (
    <div className="flex items-center border rounded-md bg-background">
      <Button
        variant={viewMode === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewModeChange("grid")}
        className="rounded-r-none border-r"
        title="Visualização em grade"
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewModeChange("list")}
        className="rounded-l-none"
        title="Visualização em tabela"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}
