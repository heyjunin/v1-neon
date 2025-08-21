"use client";

import { useOrganization } from "@/contexts/organization-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { useState } from "react";
import { trpc } from "./client";
import { createLoggerLink } from "./logger-config";

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const { currentOrganization } = useOrganization();
  
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        /**
         * Logger Link - Logs detalhados das operações tRPC
         * Configuração automática baseada no ambiente
         */
        createLoggerLink(),
        httpBatchLink({
          url: "/api/trpc",
          headers: () => {
            const headers: Record<string, string> = {};
            
            // Adicionar organização atual ao header se disponível
            if (currentOrganization?.id) {
              headers["x-organization-id"] = currentOrganization.id;
            }
            
            return headers;
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
