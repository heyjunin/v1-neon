import { createUser } from "@v1/database/mutations";
import { logger } from "@v1/logger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { type, table, record, old_record } = payload;

    logger.info("Webhook received:", { type, table, recordId: record?.id });

    // Verificar se é um evento de criação de usuário
    if (type === "INSERT" && table === "users") {
      // Criar usuário diretamente no banco Neon usando Drizzle
      try {
        const user = await createUser({
          id: record.id,
          email: record.email,
          fullName: record.full_name,
          avatarUrl: record.avatar_url,
          createdAt: new Date(record.created_at),
          updatedAt: new Date(record.updated_at),
        });

        logger.info("User created successfully in Neon database:", user.id);
      } catch (error) {
        logger.error("Failed to create user in Neon database:", error);
        return NextResponse.json(
          {
            error: "Failed to create user in database",
            details: error instanceof Error ? error.message : "Unknown error",
          },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Webhook processing error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
