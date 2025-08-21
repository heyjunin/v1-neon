"use client";

import { AuthProvider as AuthProviderComponent } from "@v1/auth/components";
import { createBrowserAuthProvider } from "@v1/auth/providers/supabase";

const authProvider = createBrowserAuthProvider();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProviderComponent provider={authProvider}>
      {children}
    </AuthProviderComponent>
  );
}
