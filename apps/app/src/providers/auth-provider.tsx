"use client";

import { AuthProvider } from "@v1/auth/components";
import { createBrowserAuthProvider } from "@v1/auth/providers/supabase/client-index";

interface AuthProviderWrapperProps {
  children: React.ReactNode;
}

export function AuthProviderWrapper({ children }: AuthProviderWrapperProps) {
  const authProvider = createBrowserAuthProvider();

  return (
    <AuthProvider provider={authProvider}>
      {children}
    </AuthProvider>
  );
}
