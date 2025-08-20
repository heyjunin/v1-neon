import { initTRPC } from '@trpc/server';
import { logger } from '@v1/logger';

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

// Middleware para logging
const loggingMiddleware = t.middleware(async ({ path, next }) => {
  const start = Date.now();
  logger.info(`tRPC ${path} started`);
  
  const result = await next();
  
  const duration = Date.now() - start;
  logger.info(`tRPC ${path} completed in ${duration}ms`);
  
  return result;
});

export const loggedProcedure = t.procedure.use(loggingMiddleware);
