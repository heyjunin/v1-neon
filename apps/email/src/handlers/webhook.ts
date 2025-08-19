import type { Context } from "hono";
import { EmailService } from "../services/email-service";
import { WebhookService } from "../services/webhook-service";

const emailService = new EmailService();
const webhookService = new WebhookService();

export const webhookHandler = async (c: Context) => {
  if (c.req.method !== "POST") {
    return new Response("not allowed", { status: 400 });
  }

  const payload = await c.req.text();
  const headers = Object.fromEntries(Object.entries(c.req.header()));

  try {
    const verifiedPayload = webhookService.verify(payload, headers);
    await emailService.processWebhook(verifiedPayload);

    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", "application/json");

    return new Response(JSON.stringify({}), {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return c.json(
      { error: "Internal server error" },
      500
    );
  }
};
