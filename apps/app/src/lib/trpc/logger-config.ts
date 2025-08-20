import { loggerLink } from '@trpc/client';

/**
 * Configuração do loggerLink para tRPC
 * 
 * Funcionalidades:
 * - Logs completos em desenvolvimento
 * - Apenas erros em produção
 * - Prefixos personalizados para facilitar identificação
 * - Suporte a cores ANSI no servidor e CSS no cliente
 */
export const createLoggerLink = () => {
  return loggerLink({
    enabled: (opts) => {
      // Em desenvolvimento: logs completos
      if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
        return true;
      }
      
      // Em produção: apenas erros
      if (opts.direction === 'down' && opts.result instanceof Error) {
        return true;
      }
      
      return false;
    },
    console: {
      log: (message: string) => {
        console.log(`[tRPC Client] ${message}`);
      },
      error: (message: string) => {
        console.error(`[tRPC Client Error] ${message}`);
      },
    },
    colorMode: typeof window === 'undefined' ? 'ansi' : 'css',
  });
};

/**
 * Configuração para desenvolvimento com logs mais verbosos
 */
export const createDevLoggerLink = () => {
  return loggerLink({
    enabled: () => process.env.NODE_ENV === 'development',
    console: {
      log: (message: string) => {
        console.log(`[tRPC Dev] ${message}`);
      },
      error: (message: string) => {
        console.error(`[tRPC Dev Error] ${message}`);
      },
    },
    colorMode: typeof window === 'undefined' ? 'ansi' : 'css',
  });
};

/**
 * Configuração para produção com logs mínimos
 */
export const createProdLoggerLink = () => {
  return loggerLink({
    enabled: (opts) => opts.direction === 'down' && opts.result instanceof Error,
    console: {
      log: (message: string) => {
        console.log(`[tRPC Prod] ${message}`);
      },
      error: (message: string) => {
        console.error(`[tRPC Prod Error] ${message}`);
      },
    },
    colorMode: typeof window === 'undefined' ? 'ansi' : 'css',
  });
};
