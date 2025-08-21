export const fakerSeederTemplate = `import { type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { {{tableName}} } from '../schema/{{tableName}}';
import { BaseSeeder } from './base-seeder';
import { fakerUtils } from './utils/faker';

export class {{SeederName}}Seeder extends BaseSeeder {
  name = '{{seederName}}';

  async run(db: NeonHttpDatabase): Promise<void> {
    // Initialize faker with a seed for consistent results
    fakerUtils.initialize({ seed: 12345 });

    // Generate fake data
    const sampleData = fakerUtils.array(() => ({
      // TODO: Add your fake data generation here
      // Example:
      // name: fakerUtils.commerce.productName(),
      // description: fakerUtils.commerce.productDescription(),
      // price: fakerUtils.number.float({ min: 10, max: 1000 }),
      // createdAt: fakerUtils.date.past(),
    }), 20);

    await this.executeInTransaction(db, async () => {
      // Check if data already exists
      const existing = await db.select().from({{tableName}}).limit(1);
      
      if (existing.length > 0) {
        throw new Error('{{SeederName}} already exist in the database. Use --force to override.');
      }

      await this.batchInsert(db, {{tableName}}, sampleData);
    });
  }
}`;
