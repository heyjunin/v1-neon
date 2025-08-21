#!/bin/bash

# 🚀 V1 Monorepo - Safe Dev Script
# 
# Este script mata todos os processos nas portas usadas pelo monorepo
# antes de iniciar o desenvolvimento, evitando conflitos de porta.

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${2:-$NC}$1${NC}"
}

# Header
log "🚀 V1 Monorepo - Safe Dev Script" "$BLUE"
log "==================================================" "$CYAN"
echo

# Verificar se estamos no diretório raiz do projeto
if [ ! -f "package.json" ] || [ ! -f "turbo.json" ]; then
    log "❌ Erro: Execute este script no diretório raiz do projeto V1" "$RED"
    exit 1
fi

# Verificar se o script kill-ports.js existe
if [ ! -f "scripts/kill-ports.js" ]; then
    log "❌ Erro: Script kill-ports.js não encontrado" "$RED"
    exit 1
fi

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    log "❌ Erro: Node.js não está instalado" "$RED"
    exit 1
fi

log "🔍 Verificando e matando processos nas portas do monorepo..." "$YELLOW"
echo

# Executar o script kill-ports.js
node scripts/kill-ports.js

# Aguardar um pouco para garantir que os processos foram mortos
log "⏳ Aguardando 2 segundos para garantir que os processos foram mortos..." "$YELLOW"
sleep 2

echo
log "🚀 Iniciando desenvolvimento..." "$GREEN"
log "Executando: bun run dev" "$CYAN"
echo

# Executar o comando dev original
exec bun run dev
