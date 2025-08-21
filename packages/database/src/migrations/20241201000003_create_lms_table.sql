-- Create lms table
CREATE TABLE IF NOT EXISTS "lms" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "organization_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "short_description" text,
  "long_description" text,
  "og_meta_tags" jsonb,
  "seo_meta_tags" jsonb,
  "domain" text,
  "is_multi_language" boolean DEFAULT false,
  "primary_language" text,
  "secondary_language" text,
  "primary_timezone" text,
  "secondary_timezone" text,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Create indexes for lms
CREATE INDEX IF NOT EXISTS "idx_lms_organization_id" ON "lms"("organization_id");
CREATE INDEX IF NOT EXISTS "idx_lms_domain" ON "lms"("domain");
CREATE INDEX IF NOT EXISTS "idx_lms_is_active" ON "lms"("is_active");

-- Add unique constraint for domain per organization
ALTER TABLE "lms" ADD CONSTRAINT "unique_lms_domain_per_org" UNIQUE ("organization_id", "domain");
