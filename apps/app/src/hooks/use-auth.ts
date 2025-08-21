"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIsAuthenticated, useGetCurrentUser } from "@/lib/trpc";

export function useAuth() {
  const router = useRouter();
  const { data: authData, isLoading: isAuthLoading } = useIsAuthenticated();
  const { data: userData, isLoading: isUserLoading } = useGetCurrentUser();

  const isAuthenticated = authData?.isAuthenticated || false;
  const user = userData?.user || authData?.user || null;
  const isLoading = isAuthLoading || isUserLoading;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  return {
    isAuthenticated,
    user,
    isLoading,
  };
}

export function useRequireAuth() {
  const { isAuthenticated, user, isLoading } = useAuth();

  return {
    isAuthenticated,
    user,
    isLoading,
    // Redirect will happen automatically in useAuth
  };
}

export function useOptionalAuth() {
  const { data: authData, isLoading } = useIsAuthenticated();
  const { data: userData } = useGetCurrentUser();

  const isAuthenticated = authData?.isAuthenticated || false;
  const user = userData?.user || authData?.user || null;

  return {
    isAuthenticated,
    user,
    isLoading,
  };
}
