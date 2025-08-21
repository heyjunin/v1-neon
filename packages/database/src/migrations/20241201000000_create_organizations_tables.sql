-- Create organizations table
CREATE TABLE IF NOT EXISTS "organizations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "description" text,
  "logo_url" text,
  "owner_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Create indexes for organizations
CREATE INDEX IF NOT EXISTS "idx_organizations_slug" ON "organizations"("slug");
CREATE INDEX IF NOT EXISTS "idx_organizations_owner_id" ON "organizations"("owner_id");

-- Create organization_members table
CREATE TABLE IF NOT EXISTS "organization_members" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "organization_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "role" text NOT NULL DEFAULT 'member',
  "status" text NOT NULL DEFAULT 'active',
  "invited_by" uuid REFERENCES "users"("id"),
  "invited_at" timestamp,
  "joined_at" timestamp,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Create indexes for organization_members
CREATE INDEX IF NOT EXISTS "idx_org_members_org_user" ON "organization_members"("organization_id", "user_id");
CREATE INDEX IF NOT EXISTS "idx_org_members_user_id" ON "organization_members"("user_id");
CREATE INDEX IF NOT EXISTS "idx_org_members_organization_id" ON "organization_members"("organization_id");

-- Create organization_invites table
CREATE TABLE IF NOT EXISTS "organization_invites" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "organization_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
  "email" text NOT NULL,
  "role" text NOT NULL DEFAULT 'member',
  "invited_by" uuid NOT NULL REFERENCES "users"("id"),
  "token" text NOT NULL UNIQUE,
  "expires_at" timestamp NOT NULL,
  "status" text NOT NULL DEFAULT 'pending',
  "accepted_at" timestamp,
  "accepted_by" uuid REFERENCES "users"("id"),
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Create indexes for organization_invites
CREATE INDEX IF NOT EXISTS "idx_org_invites_token" ON "organization_invites"("token");
CREATE INDEX IF NOT EXISTS "idx_org_invites_email" ON "organization_invites"("email");
CREATE INDEX IF NOT EXISTS "idx_org_invites_organization_id" ON "organization_invites"("organization_id");

-- Add constraints for role values
ALTER TABLE "organization_members" ADD CONSTRAINT "check_role" CHECK ("role" IN ('owner', 'admin', 'member'));
ALTER TABLE "organization_members" ADD CONSTRAINT "check_status" CHECK ("status" IN ('active', 'invited', 'suspended'));

ALTER TABLE "organization_invites" ADD CONSTRAINT "check_invite_role" CHECK ("role" IN ('owner', 'admin', 'member'));
ALTER TABLE "organization_invites" ADD CONSTRAINT "check_invite_status" CHECK ("status" IN ('pending', 'accepted', 'expired', 'cancelled'));

-- Add unique constraint to prevent duplicate members
ALTER TABLE "organization_members" ADD CONSTRAINT "unique_org_member" UNIQUE ("organization_id", "user_id");
