"use client";

import React, { createContext, useEffect, useState } from "react";
import type { AuthContextValue, AuthProvider as AuthProviderInterface, AuthSession } from "../types";

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
  provider: AuthProviderInterface;
}

export function AuthProvider({ children, provider }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Initial session load
    const loadSession = async () => {
      try {
        const authSession = await provider.getSession();
        setSession(authSession);
      } catch (error) {
        setSession({
          user: null,
          isLoading: false,
          error: error as Error,
        });
      }
    };

    loadSession();

    // Listen for auth state changes
    const unsubscribe = provider.onAuthStateChange((authSession) => {
      setSession(authSession);
    });

    return unsubscribe;
  }, [provider]);

  const signIn = async (providerName: string, options?: any) => {
    try {
      setSession(prev => ({ ...prev, isLoading: true }));
      await provider.signIn(providerName, options);
    } catch (error) {
      setSession(prev => ({
        ...prev,
        isLoading: false,
        error: error as Error,
      }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setSession(prev => ({ ...prev, isLoading: true }));
      await provider.signOut();
    } catch (error) {
      setSession(prev => ({
        ...prev,
        isLoading: false,
        error: error as Error,
      }));
      throw error;
    }
  };

  const refreshSession = async () => {
    try {
      setSession(prev => ({ ...prev, isLoading: true }));
      const authSession = await provider.getSession();
      setSession(authSession);
    } catch (error) {
      setSession(prev => ({
        ...prev,
        isLoading: false,
        error: error as Error,
      }));
      throw error;
    }
  };

  const value: AuthContextValue = {
    ...session,
    signIn,
    signOut,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
