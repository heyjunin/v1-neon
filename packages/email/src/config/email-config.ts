import type { EmailConfig } from "../types/email";

export function createEmailConfig(): EmailConfig {
  return {
    resend: {
      apiKey: process.env.RESEND_API_KEY || "",
      fromEmail:
        process.env.RESEND_FROM_EMAIL || "Create v1 <onboarding@resend.dev>",
    },
    webhook: {
      secret: process.env.SEND_EMAIL_HOOK_SECRET || "",
    },
  };
}

export function validateEmailConfig(config: EmailConfig): void {
  const requiredVars = [
    { key: "RESEND_API_KEY", value: config.resend.apiKey },
    { key: "SEND_EMAIL_HOOK_SECRET", value: config.webhook.secret },
  ];

  const missing = requiredVars.filter(({ value }) => !value);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.map((v) => v.key).join(", ")}`,
    );
  }
}
