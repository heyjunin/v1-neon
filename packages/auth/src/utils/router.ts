import { NavigateFunction } from "react-router-dom";

export const handleAuthRedirect = (
  navigate: NavigateFunction,
  redirectTo?: string,
  fallbackPath: string = "/login"
) => {
  const targetPath = redirectTo || fallbackPath;
  navigate(targetPath, { replace: true });
};

export const isProtectedRoute = (pathname: string): boolean => {
  const protectedPaths = [
    "/dashboard",
    "/profile",
    "/settings",
    "/admin",
  ];
  
  return protectedPaths.some(path => pathname.startsWith(path));
};

export const isPublicRoute = (pathname: string): boolean => {
  const publicPaths = [
    "/",
    "/login",
    "/signup",
    "/reset-password",
    "/auth/callback",
  ];
  
  return publicPaths.some(path => pathname === path || pathname.startsWith(path));
};
