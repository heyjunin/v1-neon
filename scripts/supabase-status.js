const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function getCurrentEnvironment() {
  const appEnvPath = path.join(process.cwd(), "apps/app/.env");
  const webEnvPath = path.join(process.cwd(), "apps/web/.env");
  const emailEnvPath = path.join(process.cwd(), "apps/email/.env");

  let envContent = "";
  let envPath = "";

  // Verificar qual app tem arquivo .env
  if (fs.existsSync(appEnvPath)) {
    envPath = appEnvPath;
    envContent = fs.readFileSync(appEnvPath, "utf8");
  } else if (fs.existsSync(webEnvPath)) {
    envPath = webEnvPath;
    envContent = fs.readFileSync(webEnvPath, "utf8");
  } else if (fs.existsSync(emailEnvPath)) {
    envPath = emailEnvPath;
    envContent = fs.readFileSync(emailEnvPath, "utf8");
  }

  if (!envContent) {
    console.log("❌ No .env file found in any app directory");
    console.log(
      '💡 Run "bun run supabase:local" or "bun run supabase:remote" to configure',
    );
    return;
  }

  const useLocal = envContent.includes("USE_SUPABASE_LOCAL=true");

  console.log("🔍 Supabase Environment Status");
  console.log("================================");

  if (useLocal) {
    console.log("🏠 Environment: LOCAL");

    // Verificar se Supabase local está rodando
    try {
      const dockerOutput = execSync(
        'docker ps --filter "name=supabase" --format "table {{.Names}}\t{{.Status}}"',
        { encoding: "utf8" },
      );

      if (dockerOutput.includes("supabase")) {
        console.log("✅ Status: Running");
        console.log("📊 Dashboard: http://localhost:54323");
        console.log("🔗 API: http://localhost:54321");
        console.log(
          "🗄️  Database: postgresql://postgres:postgres@localhost:54322/postgres",
        );
      } else {
        console.log("❌ Status: Not running");
        console.log('💡 Run "bun run supabase:local" to start');
      }
    } catch (error) {
      console.log("❌ Status: Docker not available");
      console.log("💡 Make sure Docker is running");
    }
  } else {
    console.log("☁️  Environment: REMOTE");

    // Extrair informações do arquivo .env
    const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
    const projectIdMatch = envContent.match(/SUPABASE_PROJECT_ID=(.+)/);

    if (urlMatch) {
      console.log(`🔗 URL: ${urlMatch[1]}`);
    }

    if (projectIdMatch) {
      console.log(`📊 Project ID: ${projectIdMatch[1]}`);
      console.log(
        `📊 Dashboard: https://supabase.com/dashboard/project/${projectIdMatch[1]}`,
      );
    }

    console.log("✅ Status: Connected (remote)");
  }

  console.log("");
  console.log("💡 Commands:");
  console.log("   bun run supabase:local    - Switch to local environment");
  console.log("   bun run supabase:remote   - Switch to remote environment");
  console.log("   bun run supabase:status   - Show this status");
}

function checkDockerStatus() {
  try {
    execSync("docker info", { stdio: "ignore" });
    return true;
  } catch (error) {
    return false;
  }
}

function checkSupabaseCLI() {
  try {
    execSync("supabase --version", { stdio: "ignore" });
    return true;
  } catch (error) {
    return false;
  }
}

// Executar verificação
getCurrentEnvironment();

// Verificações adicionais
console.log("🔧 System Checks:");
console.log(
  `   Docker: ${checkDockerStatus() ? "✅ Available" : "❌ Not available"}`,
);
console.log(
  `   Supabase CLI: ${checkSupabaseCLI() ? "✅ Installed" : "❌ Not installed"}`,
);

if (!checkDockerStatus()) {
  console.log("");
  console.log("⚠️  Docker is required for local development");
  console.log("💡 Install Docker from https://docker.com");
}

if (!checkSupabaseCLI()) {
  console.log("");
  console.log("⚠️  Supabase CLI is required for local development");
  console.log("💡 Install with: npm install -g supabase");
}
