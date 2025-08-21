import { Navigate } from "react-router-dom";
import { useUser } from "../hooks";
import type { ProtectedRouteProps } from "../types";

export function ProtectedRoute({ 
  children, 
  redirectTo = "/login", 
  fallback = <div>Loading...</div> 
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useUser();

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
