import { z } from "zod";

export const interviewPrepContentSchema = z.object({
  companySummary: z.string(),
  productOverview: z.string(),
  companyCulture: z.string(),
  salaryInsight: z.string(),
  starStories: z.array(
    z.object({
      title: z.string(),
      situation: z.string(),
      task: z.string(),
      action: z.string(),
      result: z.string(),
    })
  ),
  behavioralQuestions: z.array(z.string()),
  technicalQuestions: z.array(z.string()),
  questionsToAsk: z.array(z.string()),
});
