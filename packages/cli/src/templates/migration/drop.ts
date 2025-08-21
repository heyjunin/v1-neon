export const dropMigrationTemplate = `-- Drop {{tableName}} table
-- Migration: {{migrationName}}
-- WARNING: This will permanently delete the table and all its data!

-- Drop dependent objects first (if any)
-- TODO: Add any dependent objects that need to be dropped
-- Examples:
-- DROP VIEW IF EXISTS "{{tableName}}_view" CASCADE;
-- DROP FUNCTION IF EXISTS "{{tableName}}_trigger_function"() CASCADE;

-- Drop indexes
-- TODO: Add specific indexes to drop (optional, they'll be dropped with the table)
-- DROP INDEX IF EXISTS "{{tableName}}_name_idx";
-- DROP INDEX IF EXISTS "{{tableName}}_created_at_idx";

-- Drop foreign key constraints from other tables that reference this table
-- TODO: Add foreign key constraints that reference this table
-- Examples:
-- ALTER TABLE "other_table" DROP CONSTRAINT IF EXISTS "other_table_{{tableName}}_id_fkey";

-- Drop the table
DROP TABLE IF EXISTS "{{tableName}}" CASCADE;

-- Note: CASCADE will automatically drop any dependent objects like:
-- - Foreign key constraints that reference this table
-- - Views that depend on this table  
-- - Triggers on this table
-- - Indexes on this table`;
