"use client";

import { AuthProvider } from "@v1/auth/components";
import { createBrowserAuthProvider } from "@v1/auth/providers/supabase/client-index";

interface LoginClientProps {
  children: React.ReactNode;
}

export function LoginClient({ children }: LoginClientProps) {
  const authProvider = createBrowserAuthProvider();

  return (
    <AuthProvider provider={authProvider}>
      {children}
    </AuthProvider>
  );
}
