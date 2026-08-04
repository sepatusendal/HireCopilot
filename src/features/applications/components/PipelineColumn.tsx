import type { ApplicationStatus } from "@prisma/client";
import { STATUS_LABELS } from "@/features/applications/constants";
import { ApplicationCard, type ApplicationWithJob } from "@/features/applications/components/ApplicationCard";

interface PipelineColumnProps {
  status: ApplicationStatus;
  applications: ApplicationWithJob[];
  projectsById: Record<string, { title: string; category: string }>;
}

export function PipelineColumn({ status, applications, projectsById }: PipelineColumnProps) {
  return (
    <div className="flex w-72 shrink-0 flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
          {STATUS_LABELS[status]}
        </h3>
        <span className="rounded-full border-[var(--border-width)] border-border bg-surface px-2 py-0.5 text-xs font-bold">
          {applications.length}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {applications.length === 0 ? (
          <div className="rounded-[var(--radius-brutal)] border-[var(--border-width)] border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            No applications here.
          </div>
        ) : (
          applications.map((application) => (
            <ApplicationCard key={application.id} application={application} projectsById={projectsById} />
          ))
        )}
      </div>
    </div>
  );
}
