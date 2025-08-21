const { execSync } = require("child_process");
const path = require("path");

console.log("📦 Setting up Cloudflare R2 storage package...\n");

try {
  // Navegar para o diretório do package storage
  const storagePath = path.join(__dirname, "../packages/storage");

  console.log("📦 Installing dependencies...");
  execSync("bun install", { stdio: "inherit", cwd: storagePath });

  console.log("✅ Storage package setup completed successfully!");
  console.log("\n📝 What was installed:");
  console.log("   - @aws-sdk/client-s3 (for R2 compatibility)");
  console.log("   - @aws-sdk/s3-request-presigner (for presigned URLs)");
  console.log("   - sharp (for image transformations)");
  console.log("   - mime-types (for file type detection)");

  console.log("\n🚀 Next steps:");
  console.log("   1. Configure Cloudflare R2 credentials in .env:");
  console.log("      R2_ACCOUNT_ID=your_account_id");
  console.log("      R2_ACCESS_KEY_ID=your_access_key_id");
  console.log("      R2_SECRET_ACCESS_KEY=your_secret_access_key");
  console.log("      R2_BUCKET_NAME=your_bucket_name");
  console.log("   2. Create a bucket in Cloudflare R2");
  console.log("   3. Test the upload functionality");
  console.log("   4. Check the README.md for detailed usage");
} catch (error) {
  console.error("❌ Storage setup failed:", error.message);
  console.log("\n💡 Manual setup:");
  console.log("   1. cd packages/storage");
  console.log("   2. bun install");
  console.log("   3. Configure environment variables");
  process.exit(1);
}
