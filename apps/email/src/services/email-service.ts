import { render } from "@react-email/components";
import WelcomeEmail from "@v1/email/emails/welcome";
import React from "react";
import { Resend } from "resend";
import { config } from "../config";
import type { WebhookPayload } from "../types/email";

export class EmailService {
  private resend: Resend;

  constructor() {
    if (!config.resend.apiKey) {
      throw new Error("RESEND_API_KEY is required");
    }
    this.resend = new Resend(config.resend.apiKey);
  }

  async sendWelcomeEmail(userEmail: string) {
    const html = await render(React.createElement(WelcomeEmail));

    const result = await this.resend.emails.send({
      from: config.resend.fromEmail,
      to: [userEmail],
      subject: "Welcome to v1",
      html,
    });

    return result;
  }

  async sendTestEmail(email: string, type: string = "welcome") {
    let subject = "";
    let html = "";

    switch (type) {
      case "welcome":
        subject = "Welcome to v1";
        html = await render(React.createElement(WelcomeEmail));
        break;
      default:
        throw new Error("Invalid email type");
    }

    const result = await this.resend.emails.send({
      from: config.resend.fromEmail,
      to: [email],
      subject,
      html,
    });

    return result;
  }

  async processWebhook(payload: WebhookPayload) {
    const { user, email_data } = payload;
    const { email_action_type } = email_data;

    switch (email_action_type) {
      case "signup":
        return await this.sendWelcomeEmail(user.email);

      // Add other email actions here
      // case 'reset_password':
      // case 'magic_link':
      default:
        throw new Error("Invalid email action type");
    }
  }
}
