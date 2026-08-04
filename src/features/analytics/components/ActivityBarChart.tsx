import type { ActivityWeekPoint } from "@/features/analytics/agent";

export function ActivityBarChart({ data }: { data: ActivityWeekPoint[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div role="img" aria-label="Activity count by week" className="flex items-end gap-2" style={{ height: 120 }}>
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <span className="text-[10px] font-extrabold">{d.count > 0 ? d.count : ""}</span>
          <div
            className="w-full rounded-t-[var(--radius-brutal)] border-[var(--border-width)] border-b-0 border-border bg-mission"
            style={{ height: Math.max((d.count / max) * 80, d.count > 0 ? 4 : 1) }}
          />
          <span className="text-[9px] font-bold text-muted-foreground">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
