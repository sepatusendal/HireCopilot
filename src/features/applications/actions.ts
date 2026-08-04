"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type { ApplicationStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { STATUS_LABELS } from "@/features/applications/constants";
import { buildNotificationCreate } from "@/features/notifications/service";
import { sendEmail } from "@/lib/email";

const NOTIFY_STATUSES: ApplicationStatus[] = ["INTERVIEW", "OFFER", "REJECTED"];

export async function updateApplicationStatusAction(
  applicationId: string,
  status: ApplicationStatus
): Promise<{ success: boolean; message?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { success: false, message: "You need to be signed in." };
  }

  const application = await prisma.application.findFirst({
    where: { id: applicationId, userId: session.user.id },
    include: { job: true },
  });

  if (!application) {
    return { success: false, message: "Application not found." };
  }

  const message = `Moved "${application.job.title}" to ${STATUS_LABELS[status]}.`;

  await prisma.$transaction([
    prisma.application.update({
      where: { id: applicationId },
      data: { status, appliedAt: status === "APPLIED" ? new Date() : application.appliedAt },
    }),
    prisma.activity.create({
      data: { userId: session.user.id, type: "status_change", message },
    }),
    ...(NOTIFY_STATUSES.includes(status)
      ? [
          buildNotificationCreate({
            userId: session.user.id,
            type: "status_change",
            title: STATUS_LABELS[status],
            message,
            link: "/applications",
          }),
        ]
      : []),
  ]);

  if (NOTIFY_STATUSES.includes(status)) {
    await sendEmail(session.user.email, `HireCopilot: ${STATUS_LABELS[status]}`, `<p>${message}</p>`);
  }

  revalidatePath("/applications");
  revalidatePath("/dashboard");

  return { success: true };
}
