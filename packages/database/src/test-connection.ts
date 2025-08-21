import { logger } from "@v1/logger";
import { sql } from "drizzle-orm";
import { db } from "./drizzle";

async function testConnection() {
  try {
    logger.info("🔌 Testing database connection...");
    
    // Testar conexão básica
    const result = await db.execute(sql`SELECT 1 as test`);
    logger.info("Connection test result:", result.rows[0]);
    
    // Tentar criar a tabela blogs manualmente
    logger.info("Creating blogs table manually...");
    await db.execute(sql`
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
      )
    `);
    logger.info("Blogs table created successfully!");
    
    // Verificar se a tabela foi criada
    const blogsExists = await db.execute(
      sql`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'blogs')`
    );
    logger.info("Blogs table exists after creation:", blogsExists.rows[0]?.exists);
    
  } catch (error) {
    logger.error("Error testing connection:", error);
  }
}

testConnection();
