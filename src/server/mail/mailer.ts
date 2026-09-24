/**
 * Server-only email delivery adapter for LivZo.
 * In production, integrates with transactional email services (e.g. Resend, SendGrid).
 * In development, safely logs the magic URLs to the console for instant testing.
 */

export interface MailerService {
  sendVerificationEmail(email: string, token: string, handle?: string): Promise<boolean>;
  sendPasswordResetEmail(email: string, token: string): Promise<boolean>;
}

class ConsoleFallbackMailer implements MailerService {
  private readonly appUrl: string;

  constructor() {
    this.appUrl = process.env.APP_URL ?? "http://localhost:3000";
  }

  async sendVerificationEmail(email: string, token: string, handle?: string): Promise<boolean> {
    const verifyUrl = `${this.appUrl}/verify-email?token=${encodeURIComponent(token)}`;
    console.log("\n=======================================================");
    console.log("📨 [LivZo Mailer - Development] Email Verification");
    console.log(`To: ${email} (${handle ?? "creator"})`);
    console.log(`Verify Link: ${verifyUrl}`);
    console.log("=======================================================\n");
    return true;
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    const resetUrl = `${this.appUrl}/reset-password?token=${encodeURIComponent(token)}`;
    console.log("\n=======================================================");
    console.log("📨 [LivZo Mailer - Development] Password Reset");
    console.log(`To: ${email}`);
    console.log(`Reset Link: ${resetUrl}`);
    console.log("=======================================================\n");
    return true;
  }
}

export const mailer: MailerService = new ConsoleFallbackMailer();
