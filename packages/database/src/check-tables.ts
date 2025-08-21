import { logger } from "@v1/logger";
import { sql } from "drizzle-orm";
import { db } from "./drizzle";

async function checkTables() {
  try {
    logger.info("🔍 Checking if tables exist...");
    
    // Verificar se a tabela blogs existe
    const blogsResult = await db.execute(
      sql`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'blogs')`
    );
    const blogsExists = blogsResult.rows[0]?.exists;
    logger.info(`Blogs table exists: ${blogsExists}`);
    
    // Verificar se a tabela lms existe
    const lmsResult = await db.execute(
      sql`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'lms')`
    );
    const lmsExists = lmsResult.rows[0]?.exists;
    logger.info(`LMS table exists: ${lmsExists}`);
    
    // Listar todas as tabelas
    const allTables = await db.execute(
      sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`
    );
    const tableNames = allTables.rows.map(row => row.table_name);
    logger.info(`All tables: ${tableNames.join(', ')}`);
    
  } catch (error) {
    logger.error("Error checking tables:", error);
  }
}

checkTables();
