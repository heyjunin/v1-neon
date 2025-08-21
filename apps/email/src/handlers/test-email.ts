import {
  EmailService,
  createEmailConfig,
  validateEmailConfig,
  type TestEmailRequest,
} from "@v1/email";
import type { Context } from "hono";

const emailConfig = createEmailConfig();
validateEmailConfig(emailConfig);

const emailService = new EmailService(emailConfig);

export const testEmailHandler = async (c: Context) => {
  try {
    const body = (await c.req.json()) as TestEmailRequest;
    const { email, type = "welcome" } = body;

    if (!email) {
      return c.json({ error: "Email is required" }, 400);
    }

    const result = await emailService.sendTestEmail(email, type);

    return c.json({
      success: true,
      message: "Test email sent",
      emailId: result.data?.id,
    });
  } catch (error) {
    console.error("Error sending test email:", error);
    return c.json({ error: "Failed to send test email" }, 500);
  }
};
