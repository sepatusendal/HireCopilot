import { Resend } from "resend";

let client: Resend | undefined;
function getClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  client ??= new Resend(process.env.RESEND_API_KEY);
  return client;
}

/**
 * No-ops silently if RESEND_API_KEY isn't set — email is a nice-to-have on
 * top of in-app notifications, never a hard dependency for the app to work.
 */
export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const resend = getClient();
  if (!resend) return;

  const from = process.env.RESEND_FROM_EMAIL || "HireCopilot <onboarding@resend.dev>";

  try {
    await resend.emails.send({ from, to, subject, html });
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
  }
}
