DO $$ BEGIN
 CREATE TYPE "document_processing_status" AS ENUM('pending', 'processing', 'completed', 'failed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "blogs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
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
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
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
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "document_tag_assignments" (
	"document_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"team_id" uuid NOT NULL,
	CONSTRAINT "document_tag_assignments_pkey" PRIMARY KEY("document_id","tag_id"),
	CONSTRAINT "document_tag_assignments_unique" UNIQUE("document_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "document_tag_embeddings" (
	"slug" text PRIMARY KEY NOT NULL,
	"embedding" text,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "document_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"organization_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"metadata" jsonb,
	"path_tokens" text[],
	"team_id" uuid,
	"parent_id" text,
	"object_id" uuid,
	"owner_id" uuid,
	"tag" text,
	"title" text,
	"body" text,
	"summary" text,
	"content" text,
	"date" date,
	"language" text,
	"processing_status" "document_processing_status" DEFAULT 'pending'
);
--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "organization_id" uuid;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_blogs_organization_id" ON "blogs" ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_blogs_domain" ON "blogs" ("domain");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_blogs_is_active" ON "blogs" ("is_active");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_lms_organization_id" ON "lms" ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_lms_domain" ON "lms" ("domain");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_lms_is_active" ON "lms" ("is_active");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_document_tag_assignments_document_id" ON "document_tag_assignments" ("document_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_document_tag_assignments_tag_id" ON "document_tag_assignments" ("tag_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "documents_name_idx" ON "documents" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "documents_team_id_idx" ON "documents" ("team_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "documents_team_id_parent_id_idx" ON "documents" ("team_id","parent_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_posts_organization_id" ON "posts" ("organization_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blogs" ADD CONSTRAINT "blogs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lms" ADD CONSTRAINT "lms_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "document_tag_assignments" ADD CONSTRAINT "document_tag_assignments_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "document_tag_assignments" ADD CONSTRAINT "document_tag_assignments_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "document_tags"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documents" ADD CONSTRAINT "documents_created_by_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
