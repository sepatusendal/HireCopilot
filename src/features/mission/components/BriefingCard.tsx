import { CheckCircle2, Compass, FileCheck, MessageSquare } from "lucide-react";
import type { DailyBriefing } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dailyBriefingSummarySchema } from "@/features/mission/schema";

export function BriefingCard({ briefing }: { briefing: DailyBriefing }) {
  const parsed = dailyBriefingSummarySchema.safeParse(briefing.summary);
  if (!parsed.success) return null;
  const s = parsed.data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{s.greeting}</CardTitle>
        <p className="text-xs text-muted-foreground">Mission for {briefing.date.toLocaleDateString()}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <MiniStat icon={Compass} label="New matches" value={s.newMatches} />
          <MiniStat icon={FileCheck} label="Ready to apply" value={s.readyToApply} />
          <MiniStat icon={MessageSquare} label="Active interviews" value={s.activeInterviews} />
        </div>

        {s.topInsight && (
          <div className="rounded-[var(--radius-brutal)] border-[var(--border-width)] border-dashed border-border p-3">
            <p className="mb-1 text-xs font-bold uppercase text-muted-foreground">Top insight</p>
            <p className="text-sm">{s.topInsight}</p>
          </div>
        )}

        <div>
          <p className="mb-1.5 text-xs font-bold uppercase text-muted-foreground">Today&apos;s focus</p>
          <ul className="flex flex-col gap-1.5">
            {s.recommendedActions.map((action, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-mission" />
                {action}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniStat({ icon: Icon, label, value }: { icon: typeof Compass; label: string; value: number }) {
  return (
    <div className="rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-surface p-2.5">
      <Icon className="mx-auto mb-1 size-4 text-ai" />
      <p className="text-lg font-extrabold">{value}</p>
      <p className="text-[10px] font-bold uppercase text-muted-foreground">{label}</p>
    </div>
  );
}
