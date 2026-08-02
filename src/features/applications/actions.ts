"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type { ApplicationStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { STATUS_LABELS } from "@/features/applications/constants";

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

  await prisma.$transaction([
    prisma.application.update({
      where: { id: applicationId },
      data: { status, appliedAt: status === "APPLIED" ? new Date() : application.appliedAt },
    }),
    prisma.activity.create({
      data: {
        userId: session.user.id,
        type: "status_change",
        message: `Moved "${application.job.title}" to ${STATUS_LABELS[status]}.`,
      },
    }),
  ]);

  revalidatePath("/applications");
  revalidatePath("/dashboard");

  return { success: true };
}
