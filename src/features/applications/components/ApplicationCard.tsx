"use client";

import { useTransition } from "react";
import { MapPin } from "lucide-react";
import type { Application, ApplicationStatus, Company, Job } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn, scoreAccent } from "@/lib/utils";
import { updateApplicationStatusAction } from "@/features/applications/actions";
import { ALL_STATUSES, STATUS_LABELS } from "@/features/applications/constants";

export type ApplicationWithJob = Application & { job: Job & { company: Company } };

export function ApplicationCard({ application }: { application: ApplicationWithJob }) {
  const [isPending, startTransition] = useTransition();
  const score = application.matchScore ?? 0;
  const accent = scoreAccent(score);

  return (
    <Card className={cn("transition-opacity", isPending && "opacity-60")}>
      <CardHeader className="flex-row items-start justify-between gap-3 space-y-0 pb-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-extrabold tracking-tight">{application.job.title}</h3>
          <p className="truncate text-xs text-muted-foreground">{application.job.company.name}</p>
          {application.job.location && (
            <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" />
              {application.job.location}
            </span>
          )}
        </div>
        {application.matchScore !== null && (
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border text-xs font-extrabold shadow-brutal-sm",
              {
                interview: "bg-interview text-interview-foreground",
                mission: "bg-mission text-mission-foreground",
                warning: "bg-warning text-warning-foreground",
              }[accent]
            )}
          >
            {score}
          </span>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <select
          value={application.status}
          disabled={isPending}
          onChange={(e) => {
            const nextStatus = e.target.value as ApplicationStatus;
            startTransition(async () => {
              await updateApplicationStatusAction(application.id, nextStatus);
            });
          }}
          className="w-full rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-surface px-2.5 py-1.5 text-xs font-bold outline-none disabled:cursor-not-allowed"
        >
          {ALL_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </CardContent>
    </Card>
  );
}
