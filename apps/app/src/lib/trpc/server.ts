// Exportações do servidor - NÃO importar no cliente
import { router } from './context';
import { postsRouter } from './routers/posts';
import { organizationsRouter } from './routers/organizations';

export const appRouter = router({
  posts: postsRouter,
  organizations: organizationsRouter,
});

export type AppRouter = typeof appRouter;
export { createTRPCContext } from './context';

