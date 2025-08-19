export const config = {
  port: parseInt(process.env.PORT || "3002"),
  resend: {
    apiKey: process.env.RESEND_API_KEY,
    fromEmail: "Create v1 <onboarding@resend.dev>",
  },
  webhook: {
    secret: process.env.SEND_EMAIL_HOOK_SECRET,
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
} as const;

export function validateConfig() {
  const requiredVars = [
    { key: "RESEND_API_KEY", value: config.resend.apiKey },
    { key: "SEND_EMAIL_HOOK_SECRET", value: config.webhook.secret },
  ];

  const missing = requiredVars.filter(({ value }) => !value);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.map(v => v.key).join(", ")}`
    );
  }
}
