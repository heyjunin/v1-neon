import { OpenAPIHono } from "@hono/zod-openapi";
import { createUser } from "@v1/database/mutations";
import { logger } from "@v1/logger";
import { z } from "zod";

const webhookRoutes = new OpenAPIHono();

// Schema para validação do payload do webhook
const WebhookPayloadSchema = z.object({
  type: z.string(),
  table: z.string(),
  record: z.object({
    id: z.string(),
    email: z.string().email(),
    full_name: z.string().optional(),
    avatar_url: z.string().url().optional(),
    created_at: z.string(),
    updated_at: z.string(),
  }).optional(),
  old_record: z.any().optional(),
});

// Rota para webhook do Supabase Auth
webhookRoutes.post("/supabase", async (c) => {
  try {
    const payload = await c.req.json();
    const { type, table, record, old_record } = payload;

    logger.info("Webhook received:", { type, table, recordId: record?.id });

    // Verificar se é um evento de criação de usuário
    if (type === "INSERT" && table === "users" && record) {
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
        return c.json(
          {
            error: "Failed to create user in database",
            details: error instanceof Error ? error.message : "Unknown error",
          },
          500,
        );
      }
    }

    return c.json({ success: true });
  } catch (error) {
    logger.error("Webhook processing error:", error);
    return c.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

// Rota de teste para verificar se o webhook está funcionando
webhookRoutes.get("/supabase/test", async (c) => {
  return c.json({
    message: "Supabase webhook endpoint is working",
    endpoint: "/webhooks/supabase",
    method: "POST",
    description: "Receives webhooks from Supabase Auth for user synchronization",
  });
});

export { webhookRoutes };
