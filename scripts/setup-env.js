#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Script para copiar automaticamente arquivos .env.example para .env
 * nos diretórios necessários do projeto
 */

const envDirectories = ["apps/api", "apps/app", "apps/web", "apps/email"];

function copyEnvFile(directory) {
  const examplePath = path.join(directory, ".env.example");
  const envPath = path.join(directory, ".env");

  try {
    // Verifica se o arquivo .env.example existe
    if (!fs.existsSync(examplePath)) {
      console.log(`⚠️  Arquivo .env.example não encontrado em ${directory}`);
      return false;
    }

    // Verifica se o arquivo .env já existe
    if (fs.existsSync(envPath)) {
      console.log(`⚠️  Arquivo .env já existe em ${directory} - pulando...`);
      return false;
    }

    // Copia o arquivo
    fs.copyFileSync(examplePath, envPath);
    console.log(`✅ Copiado .env.example para .env em ${directory}`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao copiar arquivo em ${directory}:`, error.message);
    return false;
  }
}

function main() {
  console.log("🚀 Iniciando setup dos arquivos .env...\n");

  let successCount = 0;
  let totalCount = envDirectories.length;

  envDirectories.forEach((directory) => {
    if (copyEnvFile(directory)) {
      successCount++;
    }
  });

  console.log(`\n📊 Resumo:`);
  console.log(`   - Total de diretórios processados: ${totalCount}`);
  console.log(`   - Arquivos copiados com sucesso: ${successCount}`);
  console.log(`   - Arquivos pulados: ${totalCount - successCount}`);

  if (successCount > 0) {
    console.log(`\n💡 Próximos passos:`);
    console.log(
      `   1. Edite os arquivos .env criados com suas variáveis de ambiente`,
    );
    console.log(`   2. Execute 'bun install' para instalar as dependências`);
    console.log(`   3. Execute 'bun run dev' para iniciar o desenvolvimento`);
  }

  console.log("\n✨ Setup concluído!");
}

// Executa o script
if (require.main === module) {
  main();
}

module.exports = { copyEnvFile, envDirectories };
