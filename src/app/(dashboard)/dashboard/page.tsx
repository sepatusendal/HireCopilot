import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Compass, FileStack, Sparkles, Target } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { PipelineOverview } from "@/features/dashboard/components/PipelineOverview";
import { AIActivityFeed } from "@/features/dashboard/components/AIActivityFeed";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const userId = session.user.id;

  const [totalApplications, activeInterviews, newJobsMatched] = await Promise.all([
    prisma.application.count({ where: { userId } }),
    prisma.application.count({ where: { userId, status: "INTERVIEW" } }),
    prisma.application.count({ where: { userId, status: "NEW" } }),
  ]);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${session.user.name.split(" ")[0]}`}
        description="Here's what your AI recruiter has been working on."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="New Matches" value={newJobsMatched} icon={Compass} accent="jobs" />
        <StatCard label="Total Applications" value={totalApplications} icon={FileStack} accent="ai" />
        <StatCard label="Active Interviews" value={activeInterviews} icon={Target} accent="interview" />
        <StatCard label="AI Recommendation" value="Complete profile" icon={Sparkles} accent="mission" />
      </div>

      <div className="mb-6">
        <PipelineOverview userId={userId} />
      </div>

      <AIActivityFeed userId={userId} />
    </div>
  );
}
