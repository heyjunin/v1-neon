import { execSync } from 'child_process';
import { logger } from '@v1/logger';
import { setupNeonEnvironment } from './provision-neon';

export async function setupCompleteNeonDatabase(): Promise<void> {
  try {
    logger.info('🚀 Starting complete Neon database setup...');

    // 1. Provisionar banco Neon
    logger.info('📦 Step 1: Provisioning Neon database...');
    await setupNeonEnvironment();

    // 2. Executar migrações do Drizzle
    logger.info('🔄 Step 2: Running Drizzle migrations...');
    try {
      execSync('bun run push', { stdio: 'inherit', cwd: process.cwd() });
      logger.info('✅ Migrations applied successfully!');
    } catch (error) {
      logger.warn('⚠️ Migration failed, trying to generate first...');
      try {
        execSync('bun run generate', { stdio: 'inherit', cwd: process.cwd() });
        execSync('bun run push', { stdio: 'inherit', cwd: process.cwd() });
        logger.info('✅ Migrations applied successfully!');
      } catch (migrationError) {
        logger.error('❌ Failed to apply migrations:', migrationError);
        throw migrationError;
      }
    }

    // 3. Migrar dados do Supabase (se disponível)
    logger.info('📊 Step 3: Migrating data from Supabase...');
    try {
      // Importar dinamicamente para evitar erro de conexão
      const { migrateData } = await import('./migrate-data.js');
      await migrateData();
      logger.info('✅ Data migration completed successfully!');
    } catch (error) {
      logger.warn('⚠️ Data migration failed (this is normal if Supabase is not available):', error);
      logger.info('ℹ️ You can run data migration later with: bun run migrate-data');
    }

    logger.info('🎉 Complete Neon database setup finished successfully!');
    logger.info('📝 Next steps:');
    logger.info('   1. Set USE_DRIZZLE=true in your .env to enable Drizzle');
    logger.info('   2. Test your application');
    logger.info('   3. Claim your database if you want to keep it permanently');

  } catch (error) {
    logger.error('❌ Complete setup failed:', error);
    throw error;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupCompleteNeonDatabase()
    .then(() => {
      logger.info('🎯 Setup script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('💥 Setup script failed:', error);
      process.exit(1);
    });
}
