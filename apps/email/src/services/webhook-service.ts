import { Webhook } from "standardwebhooks";
import { config } from "../config";
import type { WebhookPayload } from "../types/email";

export class WebhookService {
  private webhook: Webhook;

  constructor() {
    if (!config.webhook.secret) {
      throw new Error("SEND_EMAIL_HOOK_SECRET is required");
    }
    this.webhook = new Webhook(config.webhook.secret);
  }

  verify(payload: string, headers: Record<string, string>): WebhookPayload {
    return this.webhook.verify(payload, headers) as WebhookPayload;
  }
}
