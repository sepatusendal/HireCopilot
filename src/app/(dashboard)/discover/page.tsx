import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/PageHeader";
import { StateWrapper } from "@/components/shared/StateWrapper";
import { SyncJobsButton } from "@/features/discovery/components/SyncJobsButton";
import { DiscoverBoard } from "@/features/discovery/components/DiscoverBoard";

// Sync jobs can call the AI fallback chain multiple times in one request —
// bump past Vercel's 10s default to the Hobby-plan ceiling of 60s.
export const maxDuration = 60;

export default async function DiscoverPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id, status: "NEW" },
    include: { job: { include: { company: true } } },
    orderBy: { matchScore: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Discover"
        description="Jobs your AI recruiter finds and scores for you."
        action={<SyncJobsButton />}
      />

      <StateWrapper
        isEmpty={applications.length === 0}
        emptyFallback={
          <div className="flex flex-col items-start gap-2 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-dashed border-border p-10">
            <p className="text-lg font-extrabold">No scored jobs yet.</p>
            <p className="text-sm text-muted-foreground">
              Click &quot;Sync jobs&quot; to have your AI recruiter fetch and score fresh listings against your profile.
            </p>
          </div>
        }
      >
        <DiscoverBoard applications={applications} />
      </StateWrapper>
    </div>
  );
}
