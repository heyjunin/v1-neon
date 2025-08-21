import { relations } from "drizzle-orm";
import { index, jsonb, pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";

export const lms = pgTable(
  "lms",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    shortDescription: text("short_description"),
    longDescription: text("long_description"),
    ogMetaTags: jsonb("og_meta_tags"),
    seoMetaTags: jsonb("seo_meta_tags"),
    domain: text("domain"),
    isMultiLanguage: boolean("is_multi_language").default(false),
    primaryLanguage: text("primary_language"),
    secondaryLanguage: text("secondary_language"),
    primaryTimezone: text("primary_timezone"),
    secondaryTimezone: text("secondary_timezone"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    organizationIdIdx: index("idx_lms_organization_id").on(table.organizationId),
    domainIdx: index("idx_lms_domain").on(table.domain),
    isActiveIdx: index("idx_lms_is_active").on(table.isActive),
  }),
);

export const lmsRelations = relations(lms, ({ one }) => ({
  organization: one(organizations, {
    fields: [lms.organizationId],
    references: [organizations.id],
  }),
}));

export type LMS = typeof lms.$inferSelect;
export type NewLMS = typeof lms.$inferInsert;
