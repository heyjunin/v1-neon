import { type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { table } from '../schema/table';
import { BaseSeeder } from './base-seeder';
import { fakerUtils } from './utils/faker';

export class CategoriesSeederSeeder extends BaseSeeder {
  name = 'categories-seeder';
  description = 'Seed categories-seeder with various scenarios and relationships';

  async run(db: NeonHttpDatabase): Promise<void> {
    console.log('🌱 Seeding categories-seeder...');

    // Initialize faker with a seed for consistent results
    fakerUtils.initialize({ seed: 12345 });

    // Generate different types of data
    const data = this.generateSeedData();

    await this.executeInTransaction(db, async () => {
      // Check if data already exists
      const existing = await db.select().from(table).limit(1);
      
      if (existing.length > 0) {
        throw new Error('CategoriesSeeder already exist in the database. Use --force to override.');
      }

      // Insert data in batches
      await this.batchInsert(db, table, data);
      
      console.log(`✅ Seeded ${data.length} categories-seeder records`);
    });
  }

  private generateSeedData() {
    const data = [];

    // Generate different scenarios
    for (let i = 0; i < 50; i++) {
      data.push({
        // TODO: Add your data generation logic here
        // Example:
        // name: fakerUtils.commerce.productName(),
        // description: fakerUtils.commerce.productDescription(),
        // price: fakerUtils.number.float({ min: 10, max: 1000 }),
        // category: fakerUtils.helpers.arrayElement(['electronics', 'clothing', 'books']),
        // isActive: fakerUtils.datatype.boolean(),
        // createdAt: fakerUtils.date.past(),
        // updatedAt: fakerUtils.date.recent(),
      });
    }

    return data;
  }
}