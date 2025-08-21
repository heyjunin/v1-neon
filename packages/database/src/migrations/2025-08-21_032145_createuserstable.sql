-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- TODO: Add your columns here
  -- Example:
  -- "name" TEXT NOT NULL,
  -- "description" TEXT,
  -- "is_active" BOOLEAN DEFAULT true NOT NULL,
  
  -- Timestamps
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes
-- TODO: Add your indexes here
-- Example:
-- CREATE INDEX IF NOT EXISTS "users_name_idx" ON "users" ("name");
-- CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" ("created_at");

-- Add foreign key constraints if needed
-- TODO: Add foreign keys here
-- Example:
-- ALTER TABLE "users" ADD CONSTRAINT "users_user_id_fkey" 
--   FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;