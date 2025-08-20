import { TRPCError, initTRPC } from '@trpc/server';
import { type NextRequest } from 'next/server';
import type { CreateContextOptions } from './types';

export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    req: opts.req,
    user: opts.user,
  };
};

export const createTRPCContext = async (opts: { req: NextRequest; user?: { id: string; email: string } | null }) => {
  try {
    return createInnerTRPCContext({
      req: opts.req,
      user: opts.user || null,
    });
  } catch (error) {
    console.error('Error creating TRPC context:', error);
    return createInnerTRPCContext({
      req: opts.req,
      user: null,
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
      code: 'UNAUTHORIZED',
      message: 'User not authenticated',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

// Middleware para logging detalhado
const loggingMiddleware = t.middleware(async ({ path, type, input, ctx, next }) => {
  const start = Date.now();
  const userId = ctx.user?.id || 'anonymous';
  
  console.log(`[tRPC Server] ${type.toUpperCase()} ${path} started`, {
    userId,
    input: input || 'no input',
    timestamp: new Date().toISOString(),
  });
  
  try {
    const result = await next();
    
    const duration = Date.now() - start;
    console.log(`[tRPC Server] ${type.toUpperCase()} ${path} completed successfully`, {
      userId,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });
    
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`[tRPC Server] ${type.toUpperCase()} ${path} failed`, {
      userId,
      duration: `${duration}ms`,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
    
    throw error;
  }
});

export const loggedProcedure = t.procedure.use(loggingMiddleware);
export const protectedProcedure = t.procedure.use(isAuthed).use(loggingMiddleware);
