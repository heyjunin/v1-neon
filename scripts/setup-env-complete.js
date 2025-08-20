const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Setting up complete environment configuration...\n');

const apps = [
  {
    name: 'App Principal',
    path: 'apps/app',
    files: ['env.local.example', 'env.remote.example']
  },
  {
    name: 'Web App',
    path: 'apps/web',
    files: ['env.local.example', 'env.remote.example']
  },
  {
    name: 'Email Service',
    path: 'apps/email',
    files: ['env.local.example', 'env.remote.example']
  }
];

function setupApp(app) {
  console.log(`📝 Setting up ${app.name}...`);
  
  const appPath = path.join(process.cwd(), app.path);
  
  // Verificar se o diretório existe
  if (!fs.existsSync(appPath)) {
    console.log(`⚠️  Directory ${app.path} not found, skipping...`);
    return;
  }
  
  // Copiar arquivos de exemplo
  app.files.forEach(file => {
    const examplePath = path.join(appPath, file);
    const localPath = path.join(appPath, file.replace('.example', ''));
    
    if (fs.existsSync(examplePath)) {
      if (!fs.existsSync(localPath)) {
        fs.copyFileSync(examplePath, localPath);
        console.log(`✅ Created ${app.path}/${file.replace('.example', '')}`);
      } else {
        console.log(`ℹ️  ${app.path}/${file.replace('.example', '')} already exists`);
      }
    } else {
      console.log(`⚠️  ${app.path}/${file} not found`);
    }
  });
  
  // Criar .env se não existir
  const envPath = path.join(appPath, '.env');
  const localEnvPath = path.join(appPath, '.env.local');
  
  if (!fs.existsSync(envPath) && fs.existsSync(localEnvPath)) {
    fs.copyFileSync(localEnvPath, envPath);
    console.log(`✅ Created ${app.path}/.env from local config`);
  }
}

function main() {
  try {
    // Configurar cada app
    apps.forEach(setupApp);
    
    console.log('\n🎉 Environment setup completed!');
    console.log('\n📋 Next steps:');
    console.log('   1. Update the environment files with your actual values');
    console.log('   2. Run "bun run supabase:local" to start local development');
    console.log('   3. Run "bun run supabase:remote" to switch to remote');
    console.log('   4. Run "bun run supabase:status" to check current status');
    
    console.log('\n📁 Environment files created:');
    apps.forEach(app => {
      console.log(`   - ${app.path}/.env.local`);
      console.log(`   - ${app.path}/.env.remote`);
      console.log(`   - ${app.path}/.env`);
    });
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

main();
