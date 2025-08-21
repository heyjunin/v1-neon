export const alterMigrationTemplate = `-- Alter {{tableName}} table
-- Migration: {{migrationName}}

-- TODO: Add your alterations here
-- Examples:

-- Add new columns
-- ALTER TABLE "{{tableName}}" ADD COLUMN "new_column" TEXT;
-- ALTER TABLE "{{tableName}}" ADD COLUMN "status" VARCHAR(50) DEFAULT 'active' NOT NULL;

-- Modify existing columns
-- ALTER TABLE "{{tableName}}" ALTER COLUMN "existing_column" SET NOT NULL;
-- ALTER TABLE "{{tableName}}" ALTER COLUMN "existing_column" DROP NOT NULL;
-- ALTER TABLE "{{tableName}}" ALTER COLUMN "existing_column" SET DEFAULT 'default_value';

-- Rename columns
-- ALTER TABLE "{{tableName}}" RENAME COLUMN "old_name" TO "new_name";

-- Add constraints
-- ALTER TABLE "{{tableName}}" ADD CONSTRAINT "{{tableName}}_unique_constraint" UNIQUE ("column_name");
-- ALTER TABLE "{{tableName}}" ADD CONSTRAINT "{{tableName}}_check_constraint" CHECK ("column_name" > 0);

-- Add foreign keys
-- ALTER TABLE "{{tableName}}" ADD CONSTRAINT "{{tableName}}_foreign_key" 
--   FOREIGN KEY ("foreign_column") REFERENCES "other_table" ("id") ON DELETE CASCADE;

-- Create new indexes
-- CREATE INDEX IF NOT EXISTS "{{tableName}}_new_index" ON "{{tableName}}" ("column_name");

-- Drop indexes (if needed)
-- DROP INDEX IF EXISTS "{{tableName}}_old_index";`;
