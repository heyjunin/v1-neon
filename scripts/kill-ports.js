#!/usr/bin/env node

/**
 * 🚀 V1 Monorepo - Kill Ports Script
 * 
 * Este script mata todos os processos que estão ocupando as portas
 * utilizadas pelos apps do monorepo V1 antes de iniciar o desenvolvimento.
 * 
 * Mapeamento de Portas:
 * - 3000: @v1/app (Next.js App)
 * - 3001: @v1/web (Next.js Web)
 * - 3003: @v1/react-app (Vite React App)
 * - 54321: Supabase API (Local)
 * - 54322: Supabase Database (Local)
 * - 54323: Supabase Studio (Local)
 * - 54327: Supabase Analytics (Local)
 * - 54328: Supabase Vector (Local)
 */

const { execSync, spawn } = require('child_process');
const { platform } = require('os');

// Mapeamento de portas do monorepo V1
const PORT_MAPPING = {
  // Apps principais
  3000: '@v1/app (Next.js App)',
  3001: '@v1/web (Next.js Web)', 
  3002: '@v1/email-app (Hono Email Service)',
  3003: '@v1/react-app (Vite React App)',
  3004: '@v1/engine (Hono API)',
  3005: '@v1/email (React Email Dev)',
  
  // Supabase Local
  54321: 'Supabase API (Local)',
  54322: 'Supabase Database (Local)',
  54323: 'Supabase Studio (Local)',
  54327: 'Supabase Analytics (Local)',
  54328: 'Supabase Vector (Local)',
  
  // Portas comuns que podem conflitar
  5173: 'Vite default (pode ser usada por outros projetos)',
  8080: 'Porta comum (pode ser usada por outros projetos)',
  8000: 'Porta comum (pode ser usada por outros projetos)',
};

const PORTS = Object.keys(PORT_MAPPING).map(Number);

// Cores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader() {
  console.log('\n' + '='.repeat(60));
  log('🚀 V1 Monorepo - Kill Ports Script', 'bright');
  log('='.repeat(60), 'cyan');
  console.log();
}

function logPortMapping() {
  log('📋 Mapeamento de Portas:', 'bright');
  console.log();
  
  Object.entries(PORT_MAPPING).forEach(([port, description]) => {
    log(`  ${port.padStart(5)} → ${description}`, 'blue');
  });
  console.log();
}

function isPortInUse(port) {
  try {
    if (platform() === 'win32') {
      // Windows
      const result = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
      return result.trim().length > 0;
    } else {
      // macOS/Linux
      const result = execSync(`lsof -i :${port}`, { encoding: 'utf8' });
      return result.trim().length > 0;
    }
  } catch (error) {
    return false;
  }
}

function getProcessInfo(port) {
  try {
    if (platform() === 'win32') {
      // Windows
      const result = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
      const lines = result.trim().split('\n');
      if (lines.length > 0) {
        const parts = lines[0].trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== 'PID') {
          try {
            const processInfo = execSync(`tasklist /FI "PID eq ${pid}" /FO CSV`, { encoding: 'utf8' });
            const processLines = processInfo.trim().split('\n');
            if (processLines.length > 1) {
              const processData = processLines[1].split(',');
              return {
                pid,
                name: processData[0].replace(/"/g, ''),
                description: processData[1] ? processData[1].replace(/"/g, '') : 'N/A'
              };
            }
          } catch (e) {
            return { pid, name: 'Unknown', description: 'N/A' };
          }
        }
      }
    } else {
      // macOS/Linux
      const result = execSync(`lsof -i :${port}`, { encoding: 'utf8' });
      const lines = result.trim().split('\n');
      if (lines.length > 1) {
        const parts = lines[1].trim().split(/\s+/);
        return {
          pid: parts[1],
          name: parts[0],
          description: parts[9] || 'N/A'
        };
      }
    }
  } catch (error) {
    // Porta não está em uso
  }
  return null;
}

function killProcess(port, processInfo) {
  try {
    if (platform() === 'win32') {
      // Windows
      execSync(`taskkill /PID ${processInfo.pid} /F`, { stdio: 'pipe' });
    } else {
      // macOS/Linux
      execSync(`kill -9 ${processInfo.pid}`, { stdio: 'pipe' });
    }
    return true;
  } catch (error) {
    return false;
  }
}

function killPort(port) {
  const processInfo = getProcessInfo(port);
  
  if (!processInfo) {
    log(`  ✅ Porta ${port} está livre`, 'green');
    return { killed: false, message: 'Porta livre' };
  }

  log(`  🔍 Porta ${port} em uso por:`, 'yellow');
  log(`     PID: ${processInfo.pid}`, 'cyan');
  log(`     Processo: ${processInfo.name}`, 'cyan');
  log(`     Descrição: ${processInfo.description}`, 'cyan');

  const killed = killProcess(port, processInfo);
  
  if (killed) {
    log(`  ✅ Processo na porta ${port} morto com sucesso`, 'green');
    return { killed: true, message: 'Processo morto' };
  } else {
    log(`  ❌ Falha ao matar processo na porta ${port}`, 'red');
    return { killed: false, message: 'Falha ao matar processo' };
  }
}

function main() {
  logHeader();
  logPortMapping();

  log('🔍 Verificando portas em uso...', 'bright');
  console.log();

  const results = [];
  let totalKilled = 0;

  for (const port of PORTS) {
    log(`Verificando porta ${port} (${PORT_MAPPING[port]})...`, 'blue');
    
    if (isPortInUse(port)) {
      const result = killPort(port);
      results.push({ port, ...result });
      
      if (result.killed) {
        totalKilled++;
      }
    } else {
      log(`  ✅ Porta ${port} está livre`, 'green');
      results.push({ port, killed: false, message: 'Porta livre' });
    }
    
    console.log();
  }

  // Resumo
  log('📊 Resumo:', 'bright');
  console.log();
  
  const killedPorts = results.filter(r => r.killed);
  const freePorts = results.filter(r => !r.killed && r.message === 'Porta livre');
  const failedPorts = results.filter(r => !r.killed && r.message !== 'Porta livre');

  if (killedPorts.length > 0) {
    log(`✅ ${killedPorts.length} processo(s) morto(s):`, 'green');
    killedPorts.forEach(({ port }) => {
      log(`   - Porta ${port} (${PORT_MAPPING[port]})`, 'green');
    });
    console.log();
  }

  if (freePorts.length > 0) {
    log(`🟢 ${freePorts.length} porta(s) livre(s):`, 'cyan');
    freePorts.forEach(({ port }) => {
      log(`   - Porta ${port} (${PORT_MAPPING[port]})`, 'cyan');
    });
    console.log();
  }

  if (failedPorts.length > 0) {
    log(`⚠️  ${failedPorts.length} porta(s) com problemas:`, 'yellow');
    failedPorts.forEach(({ port, message }) => {
      log(`   - Porta ${port} (${PORT_MAPPING[port]}): ${message}`, 'yellow');
    });
    console.log();
  }

  log(`🎯 Total: ${totalKilled} processo(s) morto(s) de ${PORTS.length} porta(s) verificada(s)`, 'bright');
  
  if (totalKilled > 0) {
    log('\n🚀 Pronto! Agora você pode executar "bun run dev" sem conflitos de porta.', 'green');
  } else {
    log('\n✅ Todas as portas estão livres! Pode executar "bun run dev" normalmente.', 'green');
  }

  console.log();
  log('='.repeat(60), 'cyan');
  console.log();
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { main, PORT_MAPPING, PORTS };
