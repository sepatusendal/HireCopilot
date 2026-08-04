"use client";

import { useState } from "react";
import type { ApplicationStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import { ACTIVE_STATUSES, CLOSED_STATUSES } from "@/features/applications/constants";
import { PipelineColumn } from "@/features/applications/components/PipelineColumn";
import type { ApplicationWithJob } from "@/features/applications/components/ApplicationCard";

interface PipelineBoardProps {
  applicationsByStatus: Record<ApplicationStatus, ApplicationWithJob[]>;
  projectsById: Record<string, { title: string; category: string }>;
}

export function PipelineBoard({ applicationsByStatus, projectsById }: PipelineBoardProps) {
  const [tab, setTab] = useState<"active" | "closed">("active");
  const statuses = tab === "active" ? ACTIVE_STATUSES : CLOSED_STATUSES;

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <TabButton isActive={tab === "active"} onClick={() => setTab("active")}>
          Active
        </TabButton>
        <TabButton isActive={tab === "closed"} onClick={() => setTab("closed")}>
          Closed
        </TabButton>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {statuses.map((status) => (
          <PipelineColumn key={status} status={status} applications={applicationsByStatus[status]} projectsById={projectsById} />
        ))}
      </div>
    </div>
  );
}

function TabButton({
  isActive,
  onClick,
  children,
}: {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border px-4 py-2 text-sm font-bold transition-transform",
        isActive
          ? "bg-ai text-ai-foreground shadow-brutal-sm"
          : "bg-card text-muted-foreground hover:-translate-y-0.5"
      )}
    >
      {children}
    </button>
  );
}
