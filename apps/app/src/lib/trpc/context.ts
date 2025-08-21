import { TRPCError, initTRPC } from "@trpc/server";
import { type NextRequest } from "next/server";
import { getOrganizationMember } from "@v1/database/queries";
import type { CreateContextOptions } from "./types";

export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    req: opts.req,
    user: opts.user,
    organizationId: opts.organizationId,
    userRole: opts.userRole,
  };
};

export const createTRPCContext = async (opts: {
  req: NextRequest;
  user?: { id: string; email: string } | null;
  organizationId?: string | null;
}) => {
  try {
    let userRole: string | null = null;
    
    // Se temos usuário e organização, buscar o role do usuário na organização
    if (opts.user && opts.organizationId) {
      try {
        const member = await getOrganizationMember(opts.organizationId, opts.user.id);
        userRole = member?.role || null;
      } catch (error) {
        console.error("Error getting user role in organization:", error);
        userRole = null;
      }
    }

    return createInnerTRPCContext({
      req: opts.req,
      user: opts.user || null,
      organizationId: opts.organizationId || null,
      userRole,
    });
  } catch (error) {
    console.error("Error creating TRPC context:", error);
    return createInnerTRPCContext({
      req: opts.req,
      user: null,
      organizationId: null,
      userRole: null,
    });
  }
};

const t = initTRPC.context<typeof createTRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// Middleware para verificar se o usuário está autenticado
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User not authenticated",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

// Middleware para verificar se o usuário tem uma organização selecionada
const hasOrganization = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User not authenticated",
    });
  }

  if (!ctx.organizationId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "No organization selected",
    });
  }

  if (!ctx.userRole) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "User is not a member of this organization",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
      organizationId: ctx.organizationId,
      userRole: ctx.userRole,
    },
  });
});

// Middleware para logging detalhado
const loggingMiddleware = t.middleware(
  async ({ path, type, input, ctx, next }) => {
    const start = Date.now();
    const userId = ctx.user?.id || "anonymous";
    const organizationId = ctx.organizationId || "no-org";

    console.log(`[tRPC Server] ${type.toUpperCase()} ${path} started`, {
      userId,
      organizationId,
      input: input || "no input",
      timestamp: new Date().toISOString(),
    });

    try {
      const result = await next();

      const duration = Date.now() - start;
      console.log(
        `[tRPC Server] ${type.toUpperCase()} ${path} completed successfully`,
        {
          userId,
          organizationId,
          duration: `${duration}ms`,
          timestamp: new Date().toISOString(),
        },
      );

      return result;
    } catch (error) {
      const duration = Date.now() - start;
      console.error(`[tRPC Server] ${type.toUpperCase()} ${path} failed`, {
        userId,
        organizationId,
        duration: `${duration}ms`,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      });

      throw error;
    }
  },
);

export const loggedProcedure = t.procedure.use(loggingMiddleware);
export const protectedProcedure = t.procedure
  .use(isAuthed)
  .use(loggingMiddleware);

export const organizationProcedure = t.procedure
  .use(isAuthed)
  .use(hasOrganization)
  .use(loggingMiddleware);
