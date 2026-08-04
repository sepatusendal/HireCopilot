import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/PageHeader";
import { StateWrapper } from "@/components/shared/StateWrapper";
import { InsightCard } from "@/features/insights/components/InsightCard";
import { RefreshInsightsButton } from "@/features/insights/components/RefreshInsightsButton";

export default async function AIInsightsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const insights = await prisma.insight.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="AI Insights"
        description="Skill gaps, trending technologies, and salary trends — computed from your own match history."
        action={<RefreshInsightsButton />}
      />
      <StateWrapper
        isEmpty={insights.length === 0}
        emptyFallback={
          <div className="flex flex-col items-start gap-2 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-dashed border-border p-10">
            <p className="text-lg font-extrabold">No insights yet.</p>
            <p className="text-sm text-muted-foreground">
              Score a few jobs on Discover, then click &quot;Refresh insights&quot; above.
            </p>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </StateWrapper>
    </div>
  );
}
