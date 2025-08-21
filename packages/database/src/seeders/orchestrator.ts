import { logger } from "@v1/logger";
import { type NeonHttpDatabase } from "drizzle-orm/neon-http";
import type { Seeder, SeederOptions, SeederResult } from "./types";

export class SeederOrchestrator {
  private seeders: Map<string, Seeder> = new Map();
  private db: NeonHttpDatabase;

  constructor(db: NeonHttpDatabase) {
    this.db = db;
  }

  register(seeder: Seeder): void {
    this.seeders.set(seeder.name, seeder);
  }

  registerMany(seeders: Seeder[]): void {
    seeders.forEach((seeder) => this.register(seeder));
  }

  async run(options: SeederOptions = {}): Promise<SeederResult[]> {
    const { specific, force = false, verbose = false } = options;

    const seedersToRun = specific
      ? (specific
          .map((name) => this.seeders.get(name))
          .filter(Boolean) as Seeder[])
      : Array.from(this.seeders.values());

    if (seedersToRun.length === 0) {
      logger.warn("No seeders found to run");
      return [];
    }

    logger.info(`Running ${seedersToRun.length} seeder(s)...`);

    const results: SeederResult[] = [];

    for (const seeder of seedersToRun) {
      const startTime = Date.now();

      try {
        if (verbose) {
          logger.info(`Running seeder: ${seeder.name}`);
        }

        await seeder.run(this.db, { force });

        const duration = Date.now() - startTime;
        results.push({
          name: seeder.name,
          success: true,
          duration,
        });

        if (verbose) {
          logger.info(`✅ ${seeder.name} completed in ${duration}ms`);
        }
      } catch (error) {
        const duration = Date.now() - startTime;
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        results.push({
          name: seeder.name,
          success: false,
          error: errorMessage,
          duration,
        });

        logger.error(`❌ ${seeder.name} failed: ${errorMessage}`);

        if (!force) {
          throw error;
        }
      }
    }

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    logger.info(
      `Seeding completed: ${successful} successful, ${failed} failed`,
    );

    return results;
  }

  list(): string[] {
    return Array.from(this.seeders.keys());
  }

  get(name: string): Seeder | undefined {
    return this.seeders.get(name);
  }
}
