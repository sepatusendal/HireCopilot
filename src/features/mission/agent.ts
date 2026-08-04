import type { Application, Insight } from "@prisma/client";
import type { DailyBriefingSummary } from "@/features/mission/schema";

/**
 * Purely templated from real counts already in the DB — no AI call. A daily
 * briefing is a summary of facts, not a judgment call, so there's nothing
 * here that benefits from an LLM and everything to lose if it hallucinates
 * a number that doesn't match what's actually on the board.
 */
export function generateDailyBriefing(
  userName: string,
  applications: Application[],
  latestInsight: Insight | null
): DailyBriefingSummary {
  const newMatches = applications.filter((a) => a.status === "NEW").length;
  const readyToApply = applications.filter((a) => a.status === "READY").length;
  const activeInterviews = applications.filter((a) =>
    (["INTERVIEW", "TECHNICAL_TEST"] as const).includes(a.status as "INTERVIEW" | "TECHNICAL_TEST")
  ).length;
  const interviewPrepMissing = applications.filter(
    (a) => a.status === "INTERVIEW" && !a.interviewPrepId
  ).length;

  const recommendedActions: string[] = [];
  if (newMatches > 0) recommendedActions.push(`Review and score ${newMatches} new job match${newMatches === 1 ? "" : "es"}.`);
  if (readyToApply > 0) recommendedActions.push(`Submit ${readyToApply} application${readyToApply === 1 ? "" : "s"} sitting in Ready.`);
  if (interviewPrepMissing > 0)
    recommendedActions.push(`Generate interview prep for ${interviewPrepMissing} upcoming interview${interviewPrepMissing === 1 ? "" : "s"}.`);
  if (recommendedActions.length === 0) recommendedActions.push("Nothing urgent — good time to sync new jobs on Discover.");

  return {
    newMatches,
    readyToApply,
    activeInterviews,
    interviewPrepMissing,
    topInsight: latestInsight ? latestInsight.description : null,
    recommendedActions,
    greeting: `Good morning, ${userName.split(" ")[0]}.`,
  };
}
