export const fullModelTemplate = `import { 
  pgTable, 
  text, 
  timestamp, 
  uuid, 
  boolean, 
  integer,
  jsonb,
  index 
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
{{#if relations}}
// Import related tables
{{#each relations}}
import { {{table}} } from './{{table}}.js';
{{/each}}
{{/if}}

export const {{tableName}} = pgTable('{{tableName}}', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // TODO: Add your specific fields here
  // Example fields:
  // name: text('name').notNull(),
  // slug: text('slug').notNull().unique(),
  // description: text('description'),
  // isActive: boolean('is_active').default(true).notNull(),
  // sortOrder: integer('sort_order').default(0).notNull(),
  // metadata: jsonb('metadata'),
  
  {{#if relations}}
  // Foreign keys
  {{#each relations}}
  {{foreignKey}}: uuid('{{foreignKey}}').references(() => {{table}}.id, { onDelete: 'cascade' }),
  {{/each}}
  {{/if}}
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // TODO: Add indexes here
  // Example:
  // nameIdx: index('{{tableName}}_name_idx').on(table.name),
  // createdAtIdx: index('{{tableName}}_created_at_idx').on(table.createdAt),
}));

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

// Types
export type {{ModelName}} = typeof {{tableName}}.$inferSelect;
export type New{{ModelName}} = typeof {{tableName}}.$inferInsert;

// Utility types
export type {{ModelName}}WithRelations = {{ModelName}} & {
  {{#if relations}}
  {{#each relations}}
  {{name}}?: {{#if (eq type 'belongsTo')}}{{table}} | null{{else}}{{table}}[]{{/if}};
  {{/each}}
  {{/if}}
};

// Constants
export const {{ModelName}}Status = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft',
} as const;

export type {{ModelName}}StatusType = typeof {{ModelName}}Status[keyof typeof {{ModelName}}Status];`;
