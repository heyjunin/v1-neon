import { Hono } from "hono";
import { healthHandler } from "../handlers/health";
import { webhookHandler } from "../handlers/webhook";
import { testEmailHandler } from "../handlers/test-email";

const app = new Hono();

// Rotas principais
app.get("/", (c) => {
  return c.json({
    message: "Email Service API",
    version: "1.0.0",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", healthHandler);
app.post("/webhook/send-email", webhookHandler);
app.post("/send-test-email", testEmailHandler);

export default app;
