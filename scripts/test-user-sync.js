#!/usr/bin/env node

/**
 * Script para testar a sincronização de usuários entre Supabase e Neon
 * 
 * Uso: node scripts/test-user-sync.js
 */

import { createClient } from '@supabase/supabase-js';
import { createUser, updateUser } from '../packages/database/src/mutations/index.js';
import { getUserByEmail } from '../packages/database/src/queries/index.js';

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUserSync() {
  try {
    console.log('🧪 Testando sincronização de usuários...\n');

    // 1. Testar busca de usuário por email
    console.log('1. Testando busca de usuário por email...');
    const testEmail = 'test@example.com';
    const existingUser = await getUserByEmail(testEmail);
    
    if (existingUser) {
      console.log(`✅ Usuário encontrado: ${existingUser.fullName} (${existingUser.email})`);
    } else {
      console.log(`ℹ️  Usuário não encontrado para email: ${testEmail}`);
    }

    // 2. Testar criação de usuário
    console.log('\n2. Testando criação de usuário...');
    const newUserData = {
      id: 'test-user-id-' + Date.now(),
      email: 'test-user-' + Date.now() + '@example.com',
      fullName: 'Test User',
      avatarUrl: 'https://example.com/avatar.jpg'
    };

    try {
      const createdUser = await createUser(newUserData);
      console.log(`✅ Usuário criado: ${createdUser.fullName} (${createdUser.email})`);
    } catch (error) {
      console.log(`❌ Erro ao criar usuário: ${error.message}`);
    }

    // 3. Testar atualização de usuário
    console.log('\n3. Testando atualização de usuário...');
    if (existingUser) {
      try {
        const updatedUser = await updateUser(existingUser.id, {
          fullName: 'Updated Test User',
          avatarUrl: 'https://example.com/updated-avatar.jpg'
        });
        console.log(`✅ Usuário atualizado: ${updatedUser?.fullName}`);
      } catch (error) {
        console.log(`❌ Erro ao atualizar usuário: ${error.message}`);
      }
    }

    // 4. Testar conexão com Supabase
    console.log('\n4. Testando conexão com Supabase...');
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.log(`❌ Erro na conexão com Supabase: ${error.message}`);
    } else if (user) {
      console.log(`✅ Usuário autenticado no Supabase: ${user.email}`);
    } else {
      console.log('ℹ️  Nenhum usuário autenticado no Supabase');
    }

    console.log('\n✅ Teste de sincronização concluído!');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
    process.exit(1);
  }
}

// Executar o teste
testUserSync();
