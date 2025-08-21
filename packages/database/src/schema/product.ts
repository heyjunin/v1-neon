import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

export const product = pgTable(
  "product",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // TODO: Add your specific fields here
    // Example fields:
    // name: text('name').notNull(),
    // slug: text('slug').notNull().unique(),
    // description: text('description'),
    // isActive: boolean('is_active').default(true).notNull(),
    // sortOrder: integer('sort_order').default(0).notNull(),
    // metadata: jsonb('metadata'),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    // TODO: Add indexes here
    // Example:
    // nameIdx: index('product_name_idx').on(table.name),
    // createdAtIdx: index('product_created_at_idx').on(table.createdAt),
  }),
);

// Relations
export const productRelations = relations(product, ({}) => ({
  // TODO: Add relations here
}));

// Types
export type Product = typeof product.$inferSelect;
export type NewProduct = typeof product.$inferInsert;

// Utility types
export type ProductWithRelations = Product & {
  // TODO: Add relation types here
};

// Constants
export const ProductStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  DRAFT: "draft",
} as const;

export type ProductStatusType =
  (typeof ProductStatus)[keyof typeof ProductStatus];
