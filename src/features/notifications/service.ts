import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export interface NotifyInput {
  userId: string;
  userEmail?: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  email?: boolean;
}

/**
 * Creates the in-app Notification row (returned so callers can bundle it into
 * a $transaction alongside their own writes, same pattern as Activity logging)
 * and fires an email in the background for events worth interrupting someone
 * for. Call sites decide `email: true` only for high-signal events.
 */
export function buildNotificationCreate(input: NotifyInput) {
  return prisma.notification.create({
    data: { userId: input.userId, type: input.type, title: input.title, message: input.message, link: input.link },
  });
}

export async function notifyAndEmail(input: NotifyInput): Promise<void> {
  await buildNotificationCreate(input);
  if (input.email && input.userEmail) {
    await sendEmail(input.userEmail, input.title, `<p>${input.message}</p>`);
  }
}
