import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StateWrapper } from "@/components/shared/StateWrapper";

const PIPELINE_STAGES = [
  "NEW",
  "INTERESTED",
  "READY",
  "APPLIED",
  "VIEWED",
  "RECRUITER_CONTACT",
  "INTERVIEW",
  "TECHNICAL_TEST",
  "OFFER",
] as const;

const STAGE_LABELS: Record<(typeof PIPELINE_STAGES)[number], string> = {
  NEW: "New",
  INTERESTED: "Interested",
  READY: "Ready",
  APPLIED: "Applied",
  VIEWED: "Viewed",
  RECRUITER_CONTACT: "Recruiter Contact",
  INTERVIEW: "Interview",
  TECHNICAL_TEST: "Technical Test",
  OFFER: "Offer",
};

export async function PipelineOverview({ userId }: { userId: string }) {
  const counts = await prisma.application.groupBy({
    by: ["status"],
    where: { userId },
    _count: { _all: true },
  });

  const countsByStage = new Map(counts.map((c) => [c.status, c._count._all]));
  const total = counts.reduce((sum, c) => sum + c._count._all, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <StateWrapper isEmpty={total === 0}>
          <div className="flex flex-wrap gap-3">
            {PIPELINE_STAGES.map((stage) => (
              <div
                key={stage}
                className="flex min-w-[7rem] flex-1 flex-col gap-1 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-surface px-4 py-3"
              >
                <span className="text-xs font-bold uppercase text-muted-foreground">
                  {STAGE_LABELS[stage]}
                </span>
                <span className="text-2xl font-extrabold">{countsByStage.get(stage) ?? 0}</span>
              </div>
            ))}
          </div>
        </StateWrapper>
      </CardContent>
    </Card>
  );
}
