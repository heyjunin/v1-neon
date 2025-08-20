// Exportações do servidor - NÃO importar no cliente
import { router } from './context';
import { postsRouter } from './routers/posts';

export const appRouter = router({
  posts: postsRouter,
});

export type AppRouter = typeof appRouter;
export { createTRPCContext } from './context';

