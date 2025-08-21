import { type NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface Seeder {
  name: string;
  run(db: NeonHttpDatabase, options?: { force?: boolean }): Promise<void>;
}

export interface SeederResult {
  name: string;
  success: boolean;
  error?: string;
  duration: number;
}

export interface SeederOptions {
  specific?: string[];
  force?: boolean;
  verbose?: boolean;
}
