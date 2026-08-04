import { z } from "zod";

export const dailyBriefingSummarySchema = z.object({
  newMatches: z.number().int(),
  readyToApply: z.number().int(),
  activeInterviews: z.number().int(),
  interviewPrepMissing: z.number().int(),
  topInsight: z.string().nullable(),
  recommendedActions: z.array(z.string()),
  greeting: z.string(),
});

export type DailyBriefingSummary = z.infer<typeof dailyBriefingSummarySchema>;
