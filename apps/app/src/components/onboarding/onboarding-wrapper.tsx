"use client";

import { useOrganization } from "@/contexts/organization-context";
import { useAuth } from "@v1/auth/hooks";
import { Loader2 } from "lucide-react";
import { OrganizationOnboarding } from "./organization-onboarding";

interface OnboardingWrapperProps {
  children: React.ReactNode;
}

export function OnboardingWrapper({ children }: OnboardingWrapperProps) {
  const { user } = useAuth();
  const { userOrganizations, isLoading, error, isOnboarding } = useOrganization();

  // Se não há usuário autenticado, mostrar conteúdo normal
  if (!user) {
    return <>{children}</>;
  }

  // Se está carregando, mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Carregando suas organizações...</p>
        </div>
      </div>
    );
  }

  // Se há erro, mostrar conteúdo normal (pode ser um erro temporário)
  if (error) {
    console.warn("Erro ao carregar organizações:", error);
    return <>{children}</>;
  }

  // Se o usuário está no onboarding, mostrar onboarding
  if (isOnboarding) {
    return <OrganizationOnboarding />;
  }

  // Se o usuário tem organizações, mostrar conteúdo normal
  return <>{children}</>;
}
