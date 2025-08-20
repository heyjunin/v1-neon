#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Setting up Neon database for v1-neon project...\n');

try {
  // Navegar para o diretório do pacote database
  const databasePath = path.join(__dirname, '../packages/database');
  
  console.log('📦 Installing dependencies...');
  execSync('bun install', { stdio: 'inherit', cwd: databasePath });
  
  console.log('🔧 Running complete Neon setup...');
  execSync('bun run setup-complete', { stdio: 'inherit', cwd: databasePath });
  
  console.log('\n✅ Neon database setup completed successfully!');
  console.log('\n📝 Next steps:');
  console.log('   1. Add USE_DRIZZLE=true to your .env file to enable Drizzle');
  console.log('   2. Start your development server: bun run dev');
  console.log('   3. Test your application');
  console.log('   4. Claim your database if you want to keep it permanently');
  
} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}
