#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log("🔧 Setting up Supabase webhook for Engine API...\n");

try {
  // Navegar para o diretório do Supabase
  const supabasePath = path.join(__dirname, "../apps/api/supabase");

  console.log("📦 Applying webhook migration for Engine API...");
  execSync("supabase db reset", { stdio: "inherit", cwd: supabasePath });

  console.log("✅ Engine webhook setup completed successfully!");
  console.log("\n📝 What was configured:");
  console.log("   - Trigger on auth.users INSERT");
  console.log(
    "   - Webhook calls: http://localhost:3004/webhooks/supabase",
  );
  console.log("   - Automatic user sync to Neon database via Engine API");

  console.log("\n🚀 Next steps:");
  console.log("   1. Start Engine API: cd apps/engine && bun run dev");
  console.log("   2. Create a user in Supabase");
  console.log("   3. Check Engine API logs to confirm webhook is working");
  console.log("   4. Test endpoint: http://localhost:3004/webhooks/supabase/test");
} catch (error) {
  console.error("❌ Engine webhook setup failed:", error.message);
  console.log("\n💡 Alternative setup:");
  console.log("   1. Start Supabase: bun run supabase:start");
  console.log("   2. Apply migration manually in Supabase Studio");
  console.log("   3. Or run: supabase db reset");
  process.exit(1);
}
