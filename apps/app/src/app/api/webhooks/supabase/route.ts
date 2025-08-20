import { createDatabaseAdapter } from "@v1/database/adapters";
import { logger } from "@v1/logger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { type, table, record, old_record } = payload;

    logger.info('Webhook received:', { type, table, recordId: record?.id });

    // Verificar se é um evento de criação de usuário
    if (type === 'INSERT' && table === 'users') {
      const adapter = createDatabaseAdapter();
      
      // Criar usuário no banco principal (Neon ou Supabase baseado na configuração)
      const result = await adapter.createUser({
        id: record.id,
        email: record.email,
        fullName: record.full_name,
        avatarUrl: record.avatar_url,
        createdAt: new Date(record.created_at),
        updatedAt: new Date(record.updated_at)
      });

      if (result.error) {
        logger.error('Failed to create user in database:', result.error);
        return NextResponse.json(
          { error: 'Failed to create user', details: result.error }, 
          { status: 500 }
        );
      }

      logger.info('User created successfully in database:', record.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}
