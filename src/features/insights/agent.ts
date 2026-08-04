import type { Application, Job, Profile, Skill } from "@prisma/client";
import { matchResultSchema } from "@/lib/ai/types";

export interface GeneratedInsight {
  type: string;
  title: string;
  description: string;
  data: Record<string, unknown>;
}

type ApplicationWithJob = Application & { job: Job };

/**
 * Purely deterministic aggregation over data the Match Agent already
 * produced and stored (matchDetails on each Application) — no new AI call.
 * Every number here traces back to a real, already-explained match result,
 * so there's nothing for the AI to invent.
 */
export function generateInsights(
  applications: ApplicationWithJob[],
  profile: (Profile & { skills: Skill[] }) | null
): GeneratedInsight[] {
  const insights: GeneratedInsight[] = [];
  const knownSkills = new Set((profile?.skills ?? []).map((s) => s.name.toLowerCase()));

  const missingSkillCounts = new Map<string, number>();
  const strengthCounts = new Map<string, number>();
  let scoreSum = 0;
  let scoreCount = 0;

  for (const application of applications) {
    const parsed = matchResultSchema.safeParse(application.matchDetails);
    if (!parsed.success) continue;

    scoreSum += parsed.data.matchScore;
    scoreCount += 1;

    for (const skill of parsed.data.missingSkills) {
      const key = skill.trim();
      if (!key) continue;
      missingSkillCounts.set(key, (missingSkillCounts.get(key) ?? 0) + 1);
    }
    for (const strength of parsed.data.strengths) {
      const key = strength.trim();
      if (!key) continue;
      strengthCounts.set(key, (strengthCounts.get(key) ?? 0) + 1);
    }
  }

  const topMissingSkills = [...missingSkillCounts.entries()]
    .filter(([skill]) => !knownSkills.has(skill.toLowerCase()))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  if (topMissingSkills.length > 0) {
    insights.push({
      type: "skill_gap",
      title: "Skill gaps across your applications",
      description: `Across ${scoreCount} scored applications, these skills come up as missing most often: ${topMissingSkills
        .map(([skill, count]) => `${skill} (${count}×)`)
        .join(", ")}.`,
      data: { skills: topMissingSkills.map(([skill, count]) => ({ skill, count })) },
    });
  }

  const salaries = applications
    .map((a) => a.job)
    .filter((job) => job.salaryMin != null || job.salaryMax != null);
  if (salaries.length > 0) {
    const avgMin = Math.round(
      salaries.filter((j) => j.salaryMin != null).reduce((sum, j) => sum + j.salaryMin!, 0) /
        (salaries.filter((j) => j.salaryMin != null).length || 1)
    );
    const avgMax = Math.round(
      salaries.filter((j) => j.salaryMax != null).reduce((sum, j) => sum + j.salaryMax!, 0) /
        (salaries.filter((j) => j.salaryMax != null).length || 1)
    );
    insights.push({
      type: "salary_trend",
      title: "Salary range across jobs you've looked at",
      description: `Jobs with a listed salary range average roughly ${avgMin.toLocaleString()}–${avgMax.toLocaleString()} across ${salaries.length} listings. Ranges vary a lot by company — treat this as a rough anchor, not a quote.`,
      data: { avgMin, avgMax, sampleSize: salaries.length },
    });
  }

  const topStrengths = [...strengthCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  if (topStrengths.length > 0) {
    insights.push({
      type: "strength",
      title: "Your recurring strengths",
      description: `The Match Agent has repeatedly flagged these as strengths: ${topStrengths
        .map(([s, count]) => `${s} (${count}×)`)
        .join(", ")}. Worth leading with these in cover letters and interviews.`,
      data: { strengths: topStrengths.map(([strength, count]) => ({ strength, count })) },
    });
  }

  if (scoreCount > 0) {
    const avgScore = Math.round(scoreSum / scoreCount);
    insights.push({
      type: "match_trend",
      title: "Average match score",
      description: `Your average match score across ${scoreCount} scored applications is ${avgScore}%. ${
        avgScore < 50
          ? "Consider being more selective about which jobs you pursue, or closing the skill gaps above."
          : "You're generally applying to roles that fit well."
      }`,
      data: { avgScore, scoreCount },
    });
  }

  return insights;
}
