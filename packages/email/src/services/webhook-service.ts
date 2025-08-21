import { Webhook } from "standardwebhooks";
import type { EmailConfig, WebhookPayload } from "../types/email";

export class WebhookService {
  private webhook: Webhook;
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    if (!config.webhook.secret) {
      throw new Error("SEND_EMAIL_HOOK_SECRET is required");
    }
    this.config = config;
    this.webhook = new Webhook(config.webhook.secret);
  }

  verify(payload: string, headers: Record<string, string>): WebhookPayload {
    return this.webhook.verify(payload, headers) as WebhookPayload;
  }
}
