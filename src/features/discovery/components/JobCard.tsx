import { MapPin, Wifi } from "lucide-react";
import type { Application, Company, Job } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { matchResultSchema } from "@/lib/ai/types";

type ApplicationWithJob = Application & { job: Job & { company: Company } };

function scoreAccent(score: number): "interview" | "mission" | "warning" {
  if (score >= 75) return "interview";
  if (score >= 50) return "mission";
  return "warning";
}

export function JobCard({ application }: { application: ApplicationWithJob }) {
  const parsed = matchResultSchema.safeParse(application.matchDetails);
  const match = parsed.success ? parsed.data : null;
  const score = application.matchScore ?? 0;
  const accent = scoreAccent(score);

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <h3 className="text-lg font-extrabold tracking-tight">{application.job.title}</h3>
          <p className="text-sm text-muted-foreground">{application.job.company.name}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {application.job.location && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {application.job.location}
              </span>
            )}
            {application.job.isRemote && (
              <span className="flex items-center gap-1">
                <Wifi className="size-3.5" />
                Remote
              </span>
            )}
          </div>
        </div>
        <span
          className={cn(
            "flex size-14 shrink-0 flex-col items-center justify-center rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border text-lg font-extrabold shadow-brutal-sm",
            {
              interview: "bg-interview text-interview-foreground",
              mission: "bg-mission text-mission-foreground",
              warning: "bg-warning text-warning-foreground",
            }[accent]
          )}
        >
          {score}
          <span className="text-[0.6rem] font-bold">/100</span>
        </span>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {match ? (
          <>
            <p className="text-sm">{match.reasoning}</p>

            {match.strengths.length > 0 && (
              <ChipRow label="Strengths" items={match.strengths} accent="interview" />
            )}
            {match.weaknesses.length > 0 && (
              <ChipRow label="Weaknesses" items={match.weaknesses} accent="warning" />
            )}
            {match.missingSkills.length > 0 && (
              <ChipRow label="Missing skills" items={match.missingSkills} accent="rejection" />
            )}

            <div className="flex flex-wrap gap-4 border-t-[var(--border-width)] border-dashed border-border pt-3 text-xs text-muted-foreground">
              <span>ATS fit: <strong className="text-foreground">{match.atsCompatibility}%</strong></span>
              <span>Interview odds: <strong className="text-foreground">{match.interviewProbability}%</strong></span>
              <span>Salary: <strong className="text-foreground">{match.salaryCompatibility}</strong></span>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No match details available for this job.</p>
        )}
      </CardContent>
    </Card>
  );
}

function ChipRow({
  label,
  items,
  accent,
}: {
  label: string;
  items: string[];
  accent: "interview" | "warning" | "rejection";
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-bold uppercase text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className={cn(
              "rounded-full border-[var(--border-width)] border-border px-2.5 py-0.5 text-xs font-semibold",
              {
                interview: "bg-interview/20 text-foreground",
                warning: "bg-warning/20 text-foreground",
                rejection: "bg-rejection/20 text-foreground",
              }[accent]
            )}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
