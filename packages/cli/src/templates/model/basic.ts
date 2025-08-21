export const basicModelTemplate = `import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const {{tableName}} = pgTable('{{tableName}}', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // TODO: Add your fields here
  // Example:
  // name: text('name').notNull(),
  // description: text('description'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type {{ModelName}} = typeof {{tableName}}.$inferSelect;
export type New{{ModelName}} = typeof {{tableName}}.$inferInsert;`;
