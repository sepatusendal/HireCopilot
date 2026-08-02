import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ApplicationStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/PageHeader";
import { StateWrapper } from "@/components/shared/StateWrapper";
import { ALL_STATUSES } from "@/features/applications/constants";
import { PipelineBoard } from "@/features/applications/components/PipelineBoard";
import type { ApplicationWithJob } from "@/features/applications/components/ApplicationCard";

export default async function ApplicationsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id },
    include: { job: { include: { company: true } } },
    orderBy: { updatedAt: "desc" },
  });

  const applicationsByStatus = Object.fromEntries(
    ALL_STATUSES.map((status) => [status, applications.filter((a) => a.status === status)])
  ) as Record<ApplicationStatus, ApplicationWithJob[]>;

  return (
    <div>
      <PageHeader title="Applications" description="Every application, tracked from New to Offer." />
      <StateWrapper
        isEmpty={applications.length === 0}
        emptyFallback={
          <div className="flex flex-col items-start gap-2 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-dashed border-border p-10">
            <p className="text-lg font-extrabold">Nothing to track yet.</p>
            <p className="text-sm text-muted-foreground">
              Sync jobs on Discover first — matched jobs show up here as New.
            </p>
          </div>
        }
      >
        <PipelineBoard applicationsByStatus={applicationsByStatus} />
      </StateWrapper>
    </div>
  );
}
