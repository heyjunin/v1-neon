import { appRouter, createTRPCContext } from "@/lib/trpc/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { updateSession } from "@v1/supabase/middleware";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest) => {
  try {
    // Obter o usuário através do middleware do Supabase
    const { user } = await updateSession(req, NextResponse.next());

    // Obter a organização do header
    const organizationId = req.headers.get("x-organization-id");

    return fetchRequestHandler({
      endpoint: "/api/trpc",
      req,
      router: appRouter,
      createContext: () =>
        createTRPCContext({
          req,
          user: user
            ? {
                id: user.id,
                email: user.email || "",
              }
            : null,
          organizationId: organizationId || null,
        }),
    });
  } catch (error) {
    console.error("Error in tRPC handler:", error);
    return fetchRequestHandler({
      endpoint: "/api/trpc",
      req,
      router: appRouter,
      createContext: () => createTRPCContext({ req }),
    });
  }
};

export { handler as GET, handler as POST };
