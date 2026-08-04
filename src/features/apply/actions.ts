"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { runApplyAgent } from "@/features/apply/agent";
import { uploadDocument } from "@/lib/storage";
import { notifyAndEmail } from "@/features/notifications/service";

export interface ApplyActionResult {
  success: boolean;
  message?: string;
}

/**
 * Only ever runs for an Application already in READY status — the Approval
 * Queue gate from HireCopilot.md's workflow (Approval Queue → Submit). The
 * user moving a card to Ready IS the approval; this function never submits
 * anything the user hasn't explicitly staged for submission.
 */
export async function applyToJobAction(applicationId: string): Promise<ApplyActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { success: false, message: "You need to be signed in." };
  }
  const userId = session.user.id;

  const application = await prisma.application.findFirst({
    where: { id: applicationId, userId },
    include: { job: true, resume: true, coverLetter: true },
  });
  if (!application) {
    return { success: false, message: "Application not found." };
  }
  if (application.status !== "READY") {
    return { success: false, message: "Move this application to \"Ready\" first — that's the approval to submit." };
  }

  const profile = await prisma.profile.findUnique({ where: { userId } });

  let submitted = false;
  let proofUrl: string | null = null;
  let errorMessage: string | null = null;

  try {
    const result = await runApplyAgent({
      application,
      job: application.job,
      user: session.user as unknown as { id: string; name: string; email: string; emailVerified: boolean; image: string | null; createdAt: Date; updatedAt: Date },
      profile,
      resume: application.resume,
      coverLetter: application.coverLetter,
    });
    submitted = result.submitted;
    proofUrl = await uploadDocument(`applications/${applicationId}/proof-${Date.now()}.png`, result.screenshot, "image/png");
  } catch (error) {
    console.error(`Apply Agent failed for application ${applicationId}:`, error);
    errorMessage = error instanceof Error ? error.message : "The Apply Agent hit an unexpected error.";
  }

  await prisma.application.update({
    where: { id: applicationId },
    data: {
      applyStatus: errorMessage ? "failed" : submitted ? "submitted" : "form_filled_not_submitted",
      applyProofUrl: proofUrl,
      submittedAt: submitted ? new Date() : null,
      status: submitted ? "APPLIED" : application.status,
      appliedAt: submitted ? new Date() : application.appliedAt,
    },
  });

  await notifyAndEmail({
    userId,
    userEmail: session.user.email,
    type: "apply_result",
    title: submitted ? "Application submitted" : "Apply Agent needs a look",
    message: errorMessage
      ? `Apply Agent couldn't finish for "${application.job.title}": ${errorMessage}`
      : submitted
        ? `Apply Agent submitted your application for "${application.job.title}".`
        : `Apply Agent filled the form for "${application.job.title}" but couldn't find a submit button — check the proof screenshot and finish it manually.`,
    link: "/applications",
    email: true,
  });

  revalidatePath("/applications");

  if (errorMessage) {
    return { success: false, message: errorMessage };
  }

  return { success: true, message: submitted ? "Submitted." : "Form filled — submit button not found, finish manually." };
}
