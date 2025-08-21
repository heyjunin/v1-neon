"use client";

import { useUserOrganizations } from "@/lib/trpc/hooks";
import { useAuth } from "@v1/auth/hooks";
import { createContext, useContext, useEffect, useState } from "react";

interface OrganizationWithRole {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  ownerId: string;
  isActive: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  role: string;
  status: string;
}

interface OrganizationContextType {
  currentOrganization: OrganizationWithRole | null;
  userOrganizations: OrganizationWithRole[];
  isLoading: boolean;
  error: string | null;
  setCurrentOrganization: (organization: OrganizationWithRole) => void;
  refreshOrganizations: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [currentOrganization, setCurrentOrganization] = useState<OrganizationWithRole | null>(null);
  const { data: userOrganizations = [], isLoading, error: queryError, refetch } = useUserOrganizations();

  const refreshOrganizations = async () => {
    await refetch();
  };

  useEffect(() => {
    // Se não há organization atual, definir a primeira como padrão
    if (!currentOrganization && userOrganizations.length > 0) {
      // Priorizar organizations onde o usuário é owner
      const ownedOrganization = userOrganizations.find((org: OrganizationWithRole) => org.role === "owner");
      const defaultOrganization = ownedOrganization || userOrganizations[0];
      if (defaultOrganization) {
        setCurrentOrganization(defaultOrganization);
      }
    }
  }, [userOrganizations, currentOrganization]);

  const value: OrganizationContextType = {
    currentOrganization,
    userOrganizations,
    isLoading,
    error: queryError?.message || null,
    setCurrentOrganization,
    refreshOrganizations,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error("useOrganization must be used within an OrganizationProvider");
  }
  return context;
}
