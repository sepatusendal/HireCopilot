"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function markNotificationReadAction(notificationId: string): Promise<{ success: boolean }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false };

  await prisma.notification.updateMany({
    where: { id: notificationId, userId: session.user.id },
    data: { read: true },
  });
  revalidatePath("/", "layout");

  return { success: true };
}

export async function markAllNotificationsReadAction(): Promise<{ success: boolean }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false };

  await prisma.notification.updateMany({ where: { userId: session.user.id, read: false }, data: { read: true } });
  revalidatePath("/", "layout");

  return { success: true };
}
