import { useAuth } from "./useAuth";

export function useUser() {
  const { user, isLoading, error } = useAuth();
  
  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
  };
}
