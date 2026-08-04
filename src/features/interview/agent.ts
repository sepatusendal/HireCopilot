import { generateInterviewPrep } from "@/lib/ai";
import { toJobProfileInput, type JobWithCompany, type ProfileWithRelations } from "@/lib/ai/mappers";
import type { interviewPrepContentSchema } from "@/features/interview/schema";
import type { z } from "zod";

export type InterviewPrepContent = z.infer<typeof interviewPrepContentSchema>;

/**
 * Calls the AI for company/role framing and STAR stories, then anchors the
 * STAR stories to the candidate's real profile.experiences (positionally,
 * same pattern as the Resume Agent) — the AI can rephrase, it can't invent
 * a story that isn't grounded in a real experience description.
 */
export async function generateInterviewPrepForApplication(
  job: JobWithCompany,
  profile: ProfileWithRelations
): Promise<InterviewPrepContent> {
  const result = await generateInterviewPrep(toJobProfileInput(job, profile));

  const starStories = profile.experiences.map((experience, index) => {
    const aiStory = result.starStories[index];
    return {
      title: aiStory?.title || `${experience.title} at ${experience.company}`,
      situation: aiStory?.situation ?? experience.description ?? "",
      task: aiStory?.task ?? "",
      action: aiStory?.action ?? "",
      result: aiStory?.result ?? "",
    };
  });

  return {
    companySummary: result.companySummary,
    productOverview: result.productOverview,
    companyCulture: result.companyCulture,
    salaryInsight: result.salaryInsight,
    starStories,
    behavioralQuestions: result.behavioralQuestions,
    technicalQuestions: result.technicalQuestions,
    questionsToAsk: result.questionsToAsk,
  };
}
