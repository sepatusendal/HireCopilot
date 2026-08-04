import { STATUS_LABELS } from "@/features/applications/constants";
import type { ApplicationStatus } from "@prisma/client";

export function FunnelBarChart({ data }: { data: { status: ApplicationStatus; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div role="img" aria-label="Application funnel by status" className="flex flex-col gap-2">
      {data.map((d) => (
        <div key={d.status} className="flex items-center gap-2">
          <span className="w-32 shrink-0 truncate text-xs font-bold text-muted-foreground">{STATUS_LABELS[d.status]}</span>
          <div className="h-5 flex-1 overflow-hidden rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-surface">
            <div
              className="h-full rounded-[var(--radius-brutal)] bg-ai transition-[width]"
              style={{ width: `${Math.max((d.count / max) * 100, d.count > 0 ? 4 : 0)}%` }}
            />
          </div>
          <span className="w-6 shrink-0 text-right text-xs font-extrabold">{d.count}</span>
        </div>
      ))}
    </div>
  );
}
