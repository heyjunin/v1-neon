-- Add organization_id to posts table
ALTER TABLE "posts" ADD COLUMN "organization_id" uuid REFERENCES "organizations"("id") ON DELETE CASCADE;

-- Create index for organization_id in posts
CREATE INDEX IF NOT EXISTS "idx_posts_organization_id" ON "posts" ("organization_id");

-- Update existing posts to have a default organization (if any exists)
-- This will be handled by the application logic
