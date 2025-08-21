// Exportações do servidor - NÃO importar no cliente
import { router } from './context';
import { authRouter } from './routers/auth';
import { organizationsRouter } from './routers/organizations';
import { postsRouter } from './routers/posts';

export const appRouter = router({
  posts: postsRouter,
  organizations: organizationsRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
export { createTRPCContext } from './context';

