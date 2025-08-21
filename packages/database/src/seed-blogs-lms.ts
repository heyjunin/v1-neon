import { logger } from "@v1/logger";
import { seedBlogsAndLMS } from "./seeders";

async function main() {
  try {
    logger.info("🚀 Starting blogs and LMS seeding...");
    
    await seedBlogsAndLMS();
    
    logger.info("✅ Blogs and LMS seeding completed successfully!");
  } catch (error) {
    logger.error("❌ Error seeding blogs and LMS:", error);
    process.exit(1);
  }
}

main();
