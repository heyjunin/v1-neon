import { logger } from "@v1/logger";
import { sql } from "drizzle-orm";
import { db } from "./drizzle";

async function createLMSTable() {
  try {
    logger.info("Creating LMS table manually...");
    
    await db.execute(sql`
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
      )
    `);
    logger.info("LMS table created successfully!");
    
    // Verificar se a tabela foi criada
    const lmsExists = await db.execute(
      sql`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'lms')`
    );
    logger.info("LMS table exists after creation:", lmsExists.rows[0]?.exists);
    
  } catch (error) {
    logger.error("Error creating LMS table:", error);
  }
}

createLMSTable();
