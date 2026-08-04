import { answerQuestionnaire, type QuestionnaireQuestion } from "@/lib/ai";
import { toQuestionnaireInput, type JobWithCompany, type ProfileWithAnswers } from "@/lib/ai/mappers";
import type { QuestionnaireAnswersContent } from "@/features/questionnaire/schema";

/**
 * Answers standard application questions grounded in the candidate's real
 * profile and previously-saved answers. Never trusts the AI to invent a fact
 * like a salary number or visa status — if it can't ground an answer, it
 * flags needsUserInput instead of guessing (enforced by the prompt; here we
 * just pass that flag through untouched).
 */
export async function answerQuestionnaireForApplication(
  job: JobWithCompany,
  profile: ProfileWithAnswers,
  questions: QuestionnaireQuestion[]
): Promise<QuestionnaireAnswersContent> {
  const result = await answerQuestionnaire(toQuestionnaireInput(job, profile, questions));

  return questions.map((q, index) => {
    const aiAnswer = result.answers[index];
    return {
      question: q.question,
      category: q.category,
      answer: aiAnswer?.answer ?? "Needs your input",
      needsUserInput: aiAnswer?.needsUserInput ?? true,
    };
  });
}
