import type { Activity, Application, ApplicationStatus } from "@prisma/client";
import { ALL_STATUSES } from "@/features/applications/constants";
import { matchResultSchema } from "@/lib/ai/types";

export function computeFunnel(applications: Application[]): { status: ApplicationStatus; count: number }[] {
  return ALL_STATUSES.map((status) => ({
    status,
    count: applications.filter((a) => a.status === status).length,
  }));
}

export interface MatchScorePoint {
  label: string;
  avgScore: number;
  count: number;
}

export function computeMatchScoreTrend(applications: Application[]): MatchScorePoint[] {
  const byMonth = new Map<string, number[]>();

  for (const application of applications) {
    const parsed = matchResultSchema.safeParse(application.matchDetails);
    if (!parsed.success) continue;

    const key = `${application.createdAt.getFullYear()}-${String(application.createdAt.getMonth() + 1).padStart(2, "0")}`;
    const scores = byMonth.get(key) ?? [];
    scores.push(parsed.data.matchScore);
    byMonth.set(key, scores);
  }

  return [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, scores]) => {
      const [year, month] = key.split("-");
      const label = new Date(Number(year), Number(month) - 1, 1).toLocaleDateString(undefined, { month: "short" });
      return { label, avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length), count: scores.length };
    });
}

export interface ActivityWeekPoint {
  label: string;
  count: number;
}

export function computeActivityByWeek(activities: Activity[]): ActivityWeekPoint[] {
  const now = new Date();
  const weeks: ActivityWeekPoint[] = [];

  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - i * 7 - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const count = activities.filter((a) => a.createdAt >= weekStart && a.createdAt < weekEnd).length;
    weeks.push({ label: weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric" }), count });
  }

  return weeks;
}

export function computeConversionRate(applications: Application[]): number {
  if (applications.length === 0) return 0;
  const advanced = applications.filter((a) =>
    (["INTERVIEW", "TECHNICAL_TEST", "OFFER"] as ApplicationStatus[]).includes(a.status)
  ).length;
  return Math.round((advanced / applications.length) * 100);
}
