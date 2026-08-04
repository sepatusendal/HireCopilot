import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { TrendingUp, Percent } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/PageHeader";
import { StateWrapper } from "@/components/shared/StateWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/features/dashboard/components/StatCard";
import {
  computeActivityByWeek,
  computeConversionRate,
  computeFunnel,
  computeMatchScoreTrend,
} from "@/features/analytics/agent";
import { FunnelBarChart } from "@/features/analytics/components/FunnelBarChart";
import { MatchScoreTrendChart } from "@/features/analytics/components/MatchScoreTrendChart";
import { ActivityBarChart } from "@/features/analytics/components/ActivityBarChart";

export default async function AnalyticsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const userId = session.user.id;

  const [applications, activities] = await Promise.all([
    prisma.application.findMany({ where: { userId } }),
    prisma.activity.findMany({ where: { userId } }),
  ]);

  const funnel = computeFunnel(applications);
  const matchTrend = computeMatchScoreTrend(applications);
  const activityByWeek = computeActivityByWeek(activities);
  const conversionRate = computeConversionRate(applications);

  return (
    <div>
      <PageHeader title="Analytics" description="How your job search is trending over time." />
      <StateWrapper
        isEmpty={applications.length === 0}
        emptyFallback={
          <div className="flex flex-col items-start gap-2 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-dashed border-border p-10">
            <p className="text-lg font-extrabold">Nothing to analyze yet.</p>
            <p className="text-sm text-muted-foreground">Sync jobs and track a few applications first.</p>
          </div>
        }
      >
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard label="Total Applications" value={applications.length} icon={TrendingUp} accent="ai" />
          <StatCard label="Interview+ Conversion" value={`${conversionRate}%`} icon={Percent} accent="interview" />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <FunnelBarChart data={funnel} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average match score</CardTitle>
            </CardHeader>
            <CardContent>
              <MatchScoreTrendChart data={matchTrend} />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Activity, last 8 weeks</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityBarChart data={activityByWeek} />
            </CardContent>
          </Card>
        </div>
      </StateWrapper>
    </div>
  );
}
