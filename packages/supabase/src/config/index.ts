import { logger } from '@v1/logger';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceKey: string;
  projectId: string;
  environment: 'local' | 'remote';
}

// Configurações para diferentes ambientes
const configs = {
  local: {
    url: 'http://localhost:54321',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
    serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU',
    projectId: 'create-v1',
    environment: 'local' as const,
  },
  remote: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceKey: process.env.SUPABASE_SERVICE_KEY!,
    projectId: process.env.SUPABASE_PROJECT_ID || 'unknown',
    environment: 'remote' as const,
  },
};

// Função para obter configuração baseada na variável de ambiente
export function getSupabaseConfig(): SupabaseConfig {
  const useLocal = process.env.USE_SUPABASE_LOCAL === 'true';
  const config = useLocal ? configs.local : configs.remote;
  
  logger.info(`Using Supabase ${config.environment} environment`, {
    url: config.url,
    projectId: config.projectId,
  });
  
  return config;
}

// Função para validar configuração
export function validateSupabaseConfig(config: SupabaseConfig): boolean {
  const required = ['url', 'anonKey', 'serviceKey'];
  const missing = required.filter(key => !config[key as keyof SupabaseConfig]);
  
  if (missing.length > 0) {
    logger.error('Missing required Supabase configuration:', missing);
    return false;
  }
  
  return true;
}

// Função para alternar entre ambientes
export function switchSupabaseEnvironment(environment: 'local' | 'remote'): void {
  if (environment === 'local') {
    process.env.USE_SUPABASE_LOCAL = 'true';
    logger.info('Switched to Supabase local environment');
  } else {
    process.env.USE_SUPABASE_LOCAL = 'false';
    logger.info('Switched to Supabase remote environment');
  }
}

// Função para obter configuração atual
export function getCurrentEnvironment(): 'local' | 'remote' {
  return process.env.USE_SUPABASE_LOCAL === 'true' ? 'local' : 'remote';
}

// Função para verificar se está usando local
export function isUsingLocal(): boolean {
  return getCurrentEnvironment() === 'local';
}

// Função para verificar se está usando remoto
export function isUsingRemote(): boolean {
  return getCurrentEnvironment() === 'remote';
}

// Exportar configurações individuais
export const localConfig = configs.local;
export const remoteConfig = configs.remote;
