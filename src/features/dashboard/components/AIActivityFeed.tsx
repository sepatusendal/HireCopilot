import { Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StateWrapper } from "@/components/shared/StateWrapper";

export async function AIActivityFeed({ userId }: { userId: string }) {
  const activities = await prisma.activity.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <StateWrapper
          isEmpty={activities.length === 0}
          emptyFallback={
            <div className="flex flex-col items-start gap-2 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-dashed border-border p-6">
              <p className="font-bold">Your AI recruiter is warming up.</p>
              <p className="text-sm text-muted-foreground">
                Connect your profile so I can start finding and evaluating jobs for you.
              </p>
            </div>
          }
        >
          <ul className="flex flex-col gap-3">
            {activities.map((activity) => (
              <li key={activity.id} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-ai text-ai-foreground">
                  <Sparkles className="size-3.5" />
                </span>
                <div>
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.createdAt.toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </StateWrapper>
      </CardContent>
    </Card>
  );
}
