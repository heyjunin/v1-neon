import {
  date,
  foreignKey,
  index,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid
} from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { users } from "./users";

export const documentProcessingStatusEnum = pgEnum(
    "document_processing_status",
    ["pending", "processing", "completed", "failed"],
  );
  
  export const documentTagEmbeddings = pgTable(
    "document_tag_embeddings",
    {
      slug: text("slug").primaryKey().notNull(),
      embedding: text("embedding"), // Changed from vector to text since vector is not available
      name: text("name").notNull(),
    }
  );

  export const documentTags = pgTable(
    "document_tags",
    {
      id: uuid("id").defaultRandom().primaryKey().notNull(),
      createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
        .defaultNow()
        .notNull(),
      name: text("name").notNull(),
      slug: text("slug").notNull(),
      organizationId: uuid("organization_id").notNull(),
    }
  );
  
  export const documents = pgTable(
    "documents",
    {
      id: uuid("id").defaultRandom().primaryKey().notNull(),
      name: text("name"),
      createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "string",
      }).defaultNow(),
      metadata: jsonb("metadata"),
      pathTokens: text("path_tokens").array(),
      organizationId: uuid("organization_id"),
      parentId: text("parent_id"),
      objectId: uuid("object_id"),
      ownerId: uuid("owner_id"),
      tag: text("tag"),
      title: text("title"),
      body: text("body"),
      summary: text("summary"),
      content: text("content"),
      date: date("date"),
      language: text("language"),
      processingStatus:
        documentProcessingStatusEnum("processing_status").default("pending"),
    },
    (table) => ({
      documentsNameIdx: index("documents_name_idx").on(table.name),
      documentsOrganizationIdIdx: index("documents_organization_id_idx").on(table.organizationId),
      documentsOrganizationIdParentIdIdx: index("documents_organization_id_parent_id_idx").on(table.organizationId, table.parentId),
      documentsCreatedByFkey: foreignKey({
        columns: [table.ownerId],
        foreignColumns: [users.id],
        name: "documents_created_by_fkey",
      }).onDelete("set null"),
      documentsOrganizationIdFkey: foreignKey({
        columns: [table.organizationId],
        foreignColumns: [organizations.id],
        name: "documents_organization_id_fkey",
      }).onDelete("cascade"),
    }),
  );

export const documentTagAssignments = pgTable(
    "document_tag_assignments",
    {
      documentId: uuid("document_id").notNull(),
      tagId: uuid("tag_id").notNull(),
      organizationId: uuid("organization_id").notNull(),
    },
    (table) => ({
      idxDocumentTagAssignmentsDocumentId: index("idx_document_tag_assignments_document_id").on(table.documentId),
      idxDocumentTagAssignmentsTagId: index("idx_document_tag_assignments_tag_id").on(table.tagId),
      documentTagAssignmentsDocumentIdFkey: foreignKey({
        columns: [table.documentId],
        foreignColumns: [documents.id],
        name: "document_tag_assignments_document_id_fkey",
      }).onDelete("cascade"),
      documentTagAssignmentsTagIdFkey: foreignKey({
        columns: [table.tagId],
        foreignColumns: [documentTags.id],
        name: "document_tag_assignments_tag_id_fkey",
      }).onDelete("cascade"),
      documentTagAssignmentsOrganizationIdFkey: foreignKey({
        columns: [table.organizationId],
        foreignColumns: [organizations.id],
        name: "document_tag_assignments_organization_id_fkey",
      }).onDelete("cascade"),
      documentTagAssignmentsPkey: primaryKey({
        columns: [table.documentId, table.tagId],
        name: "document_tag_assignments_pkey",
      }),
      documentTagAssignmentsUnique: unique("document_tag_assignments_unique").on(table.documentId, table.tagId),
    }),
  );

  
