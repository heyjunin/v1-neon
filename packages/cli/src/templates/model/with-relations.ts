export const withRelationsModelTemplate = `import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
{{#if relations}}
// Import related tables
{{#each relations}}
import { {{table}} } from './{{table}}.js';
{{/each}}
{{/if}}

export const {{tableName}} = pgTable('{{tableName}}', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // TODO: Add your fields here
  // Example:
  // name: text('name').notNull(),
  // description: text('description'),
  // isActive: boolean('is_active').default(true).notNull(),
  
  {{#if relations}}
  // Foreign keys
  {{#each relations}}
  {{foreignKey}}: uuid('{{foreignKey}}').references(() => {{table}}.id, { onDelete: 'cascade' }),
  {{/each}}
  {{/if}}
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

{{#if relations}}
// Relations
export const {{tableName}}Relations = relations({{tableName}}, ({ one, many }) => ({
  {{#each relations}}
  {{name}}: {{#if (eq type 'belongsTo')}}one({{table}}, {
    fields: [{{../tableName}}.{{foreignKey}}],
    references: [{{table}}.id],
  }){{else}}many({{table}}){{/if}},
  {{/each}}
}));
{{/if}}

export type {{ModelName}} = typeof {{tableName}}.$inferSelect;
export type New{{ModelName}} = typeof {{tableName}}.$inferInsert;`;
