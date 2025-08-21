export const basicSeederTemplate = `import { type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { BaseSeeder } from './base-seeder';

export class {{SeederName}}Seeder extends BaseSeeder {
  name = '{{seederName}}';

  async run(db: NeonHttpDatabase): Promise<void> {
    console.log('🌱 Seeding {{seederName}}...');
    
    // TODO: Add your seed data here
    const data = [
      // Example:
      // {
      //   name: 'Example Item',
      //   description: 'This is an example item',
      //   createdAt: new Date(),
      // }
    ];

    await this.executeInTransaction(db, async () => {
      // Check if data already exists
      const existing = await db.select().from({{tableName}}).limit(1);
      
      if (existing.length > 0) {
        throw new Error('{{SeederName}} already exist in the database. Use --force to override.');
      }

      await this.batchInsert(db, {{tableName}}, data);
    });
  }
}`;
