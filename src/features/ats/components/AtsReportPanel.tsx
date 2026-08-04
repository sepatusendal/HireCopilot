import type { AtsReport } from "@prisma/client";
import { cn } from "@/lib/utils";

export function AtsReportPanel({ atsReport }: { atsReport: AtsReport }) {
  const accent = atsReport.score >= 70 ? "text-interview" : atsReport.score >= 40 ? "text-warning" : "text-rejection";

  return (
    <div className="mt-2 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-dashed border-border p-2.5">
      <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
        ATS score <span className={cn("text-sm font-extrabold", accent)}>{atsReport.score}%</span>
      </p>
      {atsReport.missingKeywords.length > 0 && (
        <div className="mb-1.5 flex flex-wrap gap-1">
          {atsReport.missingKeywords.map((k) => (
            <span key={k} className="rounded-full border-[var(--border-width)] border-border bg-warning/20 px-2 py-0.5 text-xs font-semibold">
              missing: {k}
            </span>
          ))}
        </div>
      )}
      {atsReport.suggestions.length > 0 && (
        <ul className="list-disc pl-4 text-xs text-muted-foreground">
          {atsReport.suggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
