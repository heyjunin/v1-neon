export interface WebhookPayload {
  user: {
    email: string;
  };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
    token_new: string;
    token_hash_new: string;
  };
}

export interface TestEmailRequest {
  email: string;
  type?: "welcome" | "reset_password" | "magic_link";
}

export interface EmailResponse {
  success: boolean;
  message: string;
  emailId?: string;
}

export interface EmailConfig {
  resend: {
    apiKey: string;
    fromEmail: string;
  };
  webhook: {
    secret: string;
  };
}
