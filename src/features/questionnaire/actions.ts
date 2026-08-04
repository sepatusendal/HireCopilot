"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { answerQuestionnaireForApplication } from "@/features/questionnaire/agent";
import { STANDARD_QUESTIONS } from "@/features/questionnaire/constants";
import { questionnaireAnswersContentSchema } from "@/features/questionnaire/schema";

export interface QuestionnaireActionResult {
  success: boolean;
  message?: string;
}

export async function generateQuestionnaireAction(applicationId: string): Promise<QuestionnaireActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { success: false, message: "You need to be signed in." };
  }
  const userId = session.user.id;

  const application = await prisma.application.findFirst({
    where: { id: applicationId, userId },
    include: { job: { include: { company: true } } },
  });
  if (!application) {
    return { success: false, message: "Application not found." };
  }

  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: { skills: true, experiences: true, questionnaireAnswers: true },
  });
  if (!profile) {
    return {
      success: false,
      message: "Add your profile in Settings first — the Questionnaire Agent needs it to answer honestly.",
    };
  }

  let content: Awaited<ReturnType<typeof answerQuestionnaireForApplication>>;
  try {
    content = await answerQuestionnaireForApplication(application.job, profile, STANDARD_QUESTIONS);
  } catch (error) {
    console.error(`Failed to answer questionnaire for application ${applicationId}:`, error);
    return {
      success: false,
      message: "The AI provider timed out or is temporarily unavailable. Try again in a moment.",
    };
  }

  await prisma.application.update({
    where: { id: applicationId },
    data: { answers: content },
  });

  revalidatePath("/applications");

  return { success: true };
}

export async function saveQuestionnaireAnswerAction(
  applicationId: string,
  question: string,
  answer: string
): Promise<QuestionnaireActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { success: false, message: "You need to be signed in." };
  }
  const userId = session.user.id;

  const application = await prisma.application.findFirst({ where: { id: applicationId, userId } });
  if (!application) {
    return { success: false, message: "Application not found." };
  }

  const parsed = questionnaireAnswersContentSchema.safeParse(application.answers);
  const current = parsed.success ? parsed.data : [];
  const updated = current.map((a) => (a.question === question ? { ...a, answer, needsUserInput: false } : a));

  const profile = await prisma.profile.findUnique({ where: { userId } });

  await prisma.$transaction([
    prisma.application.update({ where: { id: applicationId }, data: { answers: updated } }),
    ...(profile
      ? [
          prisma.questionnaireAnswer.upsert({
            where: { profileId_question: { profileId: profile.id, question } },
            create: { profileId: profile.id, question, answer, category: current.find((a) => a.question === question)?.category },
            update: { answer },
          }),
        ]
      : []),
  ]);

  revalidatePath("/applications");

  return { success: true };
}
