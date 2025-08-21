export const basicMigrationTemplate = `-- Migration: {{migrationName}}
-- Created at: {{timestamp}}

-- TODO: Write your migration here
-- Examples:

-- Create a new table
-- CREATE TABLE "example_table" (
--   "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   "name" TEXT NOT NULL,
--   "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
-- );

-- Add a column to existing table
-- ALTER TABLE "existing_table" ADD COLUMN "new_column" TEXT;

-- Create an index
-- CREATE INDEX "example_index" ON "example_table" ("name");

-- Insert initial data
-- INSERT INTO "example_table" ("name") VALUES ('Initial Value');`;
