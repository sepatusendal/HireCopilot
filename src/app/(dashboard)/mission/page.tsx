import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/PageHeader";
import { StateWrapper } from "@/components/shared/StateWrapper";
import { BriefingCard } from "@/features/mission/components/BriefingCard";
import { GenerateBriefingButton } from "@/features/mission/components/GenerateBriefingButton";

export default async function MissionPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const briefing = await prisma.dailyBriefing.findFirst({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Today's Mission"
        description="What your AI recruiter wants you to focus on today."
        action={<GenerateBriefingButton />}
      />
      <StateWrapper
        isEmpty={!briefing}
        emptyFallback={
          <div className="flex flex-col items-start gap-2 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-dashed border-border p-10">
            <p className="text-lg font-extrabold">No mission generated yet.</p>
            <p className="text-sm text-muted-foreground">
              Click &quot;Generate today&apos;s mission&quot; above to get your daily briefing.
            </p>
          </div>
        }
      >
        {briefing && <BriefingCard briefing={briefing} />}
      </StateWrapper>
    </div>
  );
}
