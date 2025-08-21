import { logger } from "@v1/logger";
import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

interface NeonLaunchpadResult {
  connectionString: string;
  claimUrl: string;
  expiration: string;
}

export async function provisionNeonDatabase(): Promise<NeonLaunchpadResult> {
  try {
    logger.info("Provisioning Neon database using Neon Launchpad...");

    // Verificar se o neondb CLI está disponível
    try {
      execSync("npx neondb --help", { stdio: "ignore" });
    } catch (error) {
      logger.info("Installing neondb CLI...");
      execSync("npm install -g neondb", { stdio: "inherit" });
    }

    // Executar o comando neondb para provisionar o banco
    logger.info("Creating Neon database...");
    const result = execSync("npx neondb --yes", {
      encoding: "utf8",
      cwd: process.cwd(),
    });

    logger.info("Neon database created successfully!");

    // Ler o arquivo .env criado pelo neondb
    const envPath = join(process.cwd(), ".env");
    if (!existsSync(envPath)) {
      throw new Error("Failed to create .env file");
    }

    const envContent = readFileSync(envPath, "utf8");

    // Extrair DATABASE_URL
    const databaseUrlMatch = envContent.match(/DATABASE_URL=(.+)/);
    if (!databaseUrlMatch) {
      throw new Error("DATABASE_URL not found in .env.neon-temp");
    }
    const connectionString = databaseUrlMatch[1] || "";

    // Extrair Claim URL (está em comentário)
    const claimUrlMatch = envContent.match(
      /# Claim it now to your account: (.+)/,
    );
    const claimUrl = claimUrlMatch ? claimUrlMatch[1] : "";

    // Extrair expiração (está em comentário)
    const expirationMatch = envContent.match(/# Claimable DB expires at: (.+)/);
    const expiration = expirationMatch ? expirationMatch[1] : "72 hours";

    // Não remover o arquivo .env pois pode ser útil para desenvolvimento

    const neonResult: NeonLaunchpadResult = {
      connectionString,
      claimUrl: claimUrl || "",
      expiration: expiration || "72 hours",
    };

    logger.info("Neon database provisioned successfully!");
    logger.info(`Connection string: ${connectionString}`);
    logger.info(`Claim URL: ${claimUrl}`);
    logger.info(`Expires: ${expiration}`);

    return neonResult;
  } catch (error) {
    logger.error("Failed to provision Neon database:", error);
    throw error;
  }
}

export async function setupNeonEnvironment(): Promise<void> {
  try {
    logger.info("Setting up Neon environment...");

    // Provisionar o banco
    const neonResult = await provisionNeonDatabase();

    // Atualizar o .env principal
    const envPath = join(process.cwd(), "../../.env");
    let envContent = "";

    if (existsSync(envPath)) {
      envContent = readFileSync(envPath, "utf8");
    }

    // Adicionar ou atualizar DATABASE_URL
    if (envContent.includes("DATABASE_URL=")) {
      envContent = envContent.replace(
        /DATABASE_URL=.*/,
        `DATABASE_URL=${neonResult.connectionString}`,
      );
    } else {
      envContent += `\nDATABASE_URL=${neonResult.connectionString}`;
    }

    // Adicionar comentários informativos
    envContent += `\n# Neon Launchpad Database`;
    envContent += `\n# Claim URL: ${neonResult.claimUrl}`;
    envContent += `\n# Expires: ${neonResult.expiration}`;
    envContent += `\n# To claim this database, visit the Claim URL above`;

    // Escrever o arquivo .env atualizado
    writeFileSync(envPath, envContent);

    logger.info("Environment file updated successfully!");
    logger.info(`Database will expire in: ${neonResult.expiration}`);
    logger.info(
      `To claim this database permanently, visit: ${neonResult.claimUrl}`,
    );
  } catch (error) {
    logger.error("Failed to setup Neon environment:", error);
    throw error;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupNeonEnvironment()
    .then(() => {
      logger.info("Neon setup completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      logger.error("Neon setup failed:", error);
      process.exit(1);
    });
}
