"use client";

import { Button } from "@v1/ui/button";
import { useState } from "react";

export function EmailServiceStatus() {
  const [isChecking, setIsChecking] = useState(false);
  const [status, setStatus] = useState<"online" | "offline" | "checking">("checking");

  async function checkServiceStatus() {
    setIsChecking(true);
    setStatus("checking");
    
    try {
      const response = await fetch("/api/health");
      if (response.ok) {
        setStatus("online");
      } else {
        setStatus("offline");
      }
    } catch (error) {
      setStatus("offline");
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Status do Serviço</h3>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                status === "online"
                  ? "bg-green-500"
                  : status === "offline"
                  ? "bg-red-500"
                  : "bg-yellow-500 animate-pulse"
              }`}
            />
            <span className="text-sm text-muted-foreground">
              {status === "online"
                ? "Online"
                : status === "offline"
                ? "Offline"
                : "Verificando..."}
            </span>
          </div>
        </div>
        
        <Button
          onClick={checkServiceStatus}
          disabled={isChecking}
          variant="outline"
          size="sm"
        >
          {isChecking ? "Verificando..." : "Verificar"}
        </Button>
      </div>
    </div>
  );
}
