#!/bin/bash

echo "🔄 Switching to Supabase REMOTE environment..."

# Verificar se estamos no diretório raiz do projeto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Configurar variáveis de ambiente para cada app
echo "📝 Setting up environment files for each app..."

# App principal
if [ -f "apps/app/env.remote.example" ]; then
    if [ ! -f "apps/app/.env.remote" ]; then
        echo "❌ Error: apps/app/.env.remote file not found"
        echo ""
        echo "📝 Please create apps/app/.env.remote with your remote Supabase configuration:"
        echo "   cp apps/app/env.remote.example apps/app/.env.remote"
        echo "   Then update the values for your remote environment"
        exit 1
    fi
    if [ ! -f "apps/app/.env" ]; then
        cp apps/app/.env.remote apps/app/.env
        echo "✅ Created apps/app/.env from remote config"
    else
        cp apps/app/.env.remote apps/app/.env
        echo "✅ Updated apps/app/.env with remote config"
    fi
fi

# Web app
if [ -f "apps/web/env.remote.example" ]; then
    if [ ! -f "apps/web/.env.remote" ]; then
        echo "❌ Error: apps/web/.env.remote file not found"
        echo ""
        echo "📝 Please create apps/web/.env.remote with your remote Supabase configuration:"
        echo "   cp apps/web/env.remote.example apps/web/.env.remote"
        echo "   Then update the values for your remote environment"
        exit 1
    fi
    if [ ! -f "apps/web/.env" ]; then
        cp apps/web/.env.remote apps/web/.env
        echo "✅ Created apps/web/.env from remote config"
    else
        cp apps/web/.env.remote apps/web/.env
        echo "✅ Updated apps/web/.env with remote config"
    fi
fi

# Email service
if [ -f "apps/email/env.remote.example" ]; then
    if [ ! -f "apps/email/.env.remote" ]; then
        echo "❌ Error: apps/email/.env.remote file not found"
        echo ""
        echo "📝 Please create apps/email/.env.remote with your remote configuration:"
        echo "   cp apps/email/env.remote.example apps/email/.env.remote"
        echo "   Then update the values for your remote environment"
        exit 1
    fi
    if [ ! -f "apps/email/.env" ]; then
        cp apps/email/.env.remote apps/email/.env
        echo "✅ Created apps/email/.env from remote config"
    else
        cp apps/email/.env.remote apps/email/.env
        echo "✅ Updated apps/email/.env with remote config"
    fi
fi

# Parar Supabase local se estiver rodando
if docker ps | grep -q "supabase"; then
    echo "🛑 Stopping Supabase local..."
    cd apps/api/supabase
    supabase stop
    cd ../../..
    echo "✅ Supabase local stopped"
fi

# Extrair URL do arquivo .env para mostrar
SUPABASE_URL=$(grep "NEXT_PUBLIC_SUPABASE_URL=" .env | cut -d '=' -f2)
PROJECT_ID=$(grep "SUPABASE_PROJECT_ID=" .env | cut -d '=' -f2)

echo ""
echo "🎉 Successfully switched to Supabase REMOTE environment!"
echo ""
echo "🔗 URL: $SUPABASE_URL"
echo "📊 Project ID: $PROJECT_ID"
echo "📊 Dashboard: https://supabase.com/dashboard/project/$PROJECT_ID"
echo ""
echo "💡 Next steps:"
echo "   1. Run 'bun run dev' to start the development server"
echo "   2. Access the dashboard at https://supabase.com/dashboard"
echo "   3. Use 'bun run supabase:local' to switch back to local"
