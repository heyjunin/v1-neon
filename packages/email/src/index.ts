// Services
export { EmailService } from "./services/email-service";
export { WebhookService } from "./services/webhook-service";

// Configuration
export { createEmailConfig, validateEmailConfig } from "./config/email-config";

// Types
export type {
  EmailConfig,
  EmailResponse,
  TestEmailRequest,
  WebhookPayload,
} from "./types/email";

// Templates
export { default as WelcomeEmail } from "./templates/welcome";

// Components
export { Logo } from "./components/logo";
