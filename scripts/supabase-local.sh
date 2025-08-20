#!/bin/bash

echo "🔄 Switching to Supabase LOCAL environment..."

# Verificar se estamos no diretório raiz do projeto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Configurar variáveis de ambiente para cada app
echo "📝 Setting up environment files for each app..."

# App principal
if [ -f "apps/app/env.local.example" ]; then
    if [ ! -f "apps/app/.env.local" ]; then
        cp apps/app/env.local.example apps/app/.env.local
        echo "✅ Created apps/app/.env.local"
    fi
    if [ ! -f "apps/app/.env" ]; then
        cp apps/app/env.local.example apps/app/.env
        echo "✅ Created apps/app/.env"
    fi
fi

# Web app
if [ -f "apps/web/env.local.example" ]; then
    if [ ! -f "apps/web/.env.local" ]; then
        cp apps/web/env.local.example apps/web/.env.local
        echo "✅ Created apps/web/.env.local"
    fi
    if [ ! -f "apps/web/.env" ]; then
        cp apps/web/env.local.example apps/web/.env
        echo "✅ Created apps/web/.env"
    fi
fi

# Email service
if [ -f "apps/email/env.local.example" ]; then
    if [ ! -f "apps/email/.env.local" ]; then
        cp apps/email/env.local.example apps/email/.env.local
        echo "✅ Created apps/email/.env.local"
    fi
    if [ ! -f "apps/email/.env" ]; then
        cp apps/email/env.local.example apps/email/.env
        echo "✅ Created apps/email/.env"
    fi
fi

# Verificar se Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Verificar se Docker está rodando
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Verificar se Supabase local está rodando
if ! docker ps | grep -q "supabase"; then
    echo "🚀 Starting Supabase local..."
    cd apps/api/supabase
    
    # Iniciar Supabase local
    supabase start
    
    # Voltar para o diretório raiz
    cd ../../..
    
    echo "✅ Supabase local started successfully"
else
    echo "✅ Supabase local is already running"
fi

echo ""
echo "🎉 Successfully switched to Supabase LOCAL environment!"
echo ""
echo "📊 Dashboard: http://localhost:54323"
echo "🔗 API: http://localhost:54321"
echo "🗄️  Database: postgresql://postgres:postgres@localhost:54322/postgres"
echo ""
echo "💡 Next steps:"
echo "   1. Run 'bun run dev' to start the development server"
echo "   2. Access the dashboard at http://localhost:54323"
echo "   3. Use 'bun run supabase:remote' to switch back to remote"
