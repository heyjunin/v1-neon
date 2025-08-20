const { execSync } = require('child_process');
const path = require('path');

console.log('🔧 Setting up Supabase webhook for local development...\n');

try {
  // Navegar para o diretório do Supabase
  const supabasePath = path.join(__dirname, '../apps/api/supabase');
  
  console.log('📦 Applying webhook migration...');
  execSync('supabase db reset', { stdio: 'inherit', cwd: supabasePath });
  
  console.log('✅ Webhook setup completed successfully!');
  console.log('\n📝 What was configured:');
  console.log('   - Trigger on auth.users INSERT');
  console.log('   - Webhook calls: http://localhost:3000/api/webhooks/supabase');
  console.log('   - Automatic user sync to Neon database');
  
  console.log('\n🚀 Next steps:');
  console.log('   1. Start your app: bun run dev');
  console.log('   2. Create a user in Supabase');
  console.log('   3. Check logs to confirm webhook is working');
  
} catch (error) {
  console.error('❌ Webhook setup failed:', error.message);
  console.log('\n💡 Alternative setup:');
  console.log('   1. Start Supabase: bun run supabase:start');
  console.log('   2. Apply migration manually in Supabase Studio');
  console.log('   3. Or run: supabase db reset');
  process.exit(1);
}
