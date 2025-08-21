"use client";

import {
    Card,
    CardContent,
    CardHeader,
} from "@v1/ui/card";
import { Loader2 } from "lucide-react";

interface LoadingCardProps {
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function LoadingCard({ isLoading = false, children, className }: LoadingCardProps) {
  if (isLoading) {
    return (
      <Card className={`animate-pulse ${className || ""}`}>
        <CardHeader>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {children}
    </Card>
  );
}

export function LoadingOverlay({ isLoading, children }: { isLoading: boolean; children: React.ReactNode }) {
  if (!isLoading) return <>{children}</>;

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-10">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Processando...</span>
        </div>
      </div>
    </div>
  );
}
