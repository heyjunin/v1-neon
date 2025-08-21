import { updateSession } from "@v1/supabase/middleware";
import { createI18nMiddleware } from "next-international/middleware";
import { NextResponse, type NextRequest } from "next/server";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "fr"],
  defaultLocale: "en",
  urlMappingStrategy: "rewrite",
});

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(
    request,
    I18nMiddleware(request),
  );

  // Define public routes that don't require authentication
  const publicRoutes = [
    "/login",
    "/signup",
    "/reset-password",
    "/update-password",
    "/magic-link",
    "/auth/auth-code-error",
    "/api/auth/callback",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.endsWith(route),
  );

  if (!isPublicRoute && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|api|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
