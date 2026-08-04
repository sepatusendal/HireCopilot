"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { JobCard, type ApplicationWithJob } from "@/features/discovery/components/JobCard";

const WORK_MODE_FILTERS = [
  { value: "ALL", label: "All work modes" },
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "ONSITE", label: "Onsite" },
] as const;

export function DiscoverBoard({ applications }: { applications: ApplicationWithJob[] }) {
  const [locationQuery, setLocationQuery] = useState("");
  const [workMode, setWorkMode] = useState<string>("ALL");

  const filtered = useMemo(() => {
    const query = locationQuery.trim().toLowerCase();
    return applications.filter((application) => {
      const matchesLocation = !query || (application.job.location ?? "").toLowerCase().includes(query);
      const matchesWorkMode = workMode === "ALL" || application.job.workMode === workMode;
      return matchesLocation && matchesWorkMode;
    });
  }, [applications, locationQuery, workMode]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            placeholder="Filter by location…"
            className="w-full rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-card py-2 pl-8 pr-3 text-sm outline-none shadow-brutal-sm"
          />
        </div>
        <select
          value={workMode}
          onChange={(e) => setWorkMode(e.target.value)}
          className="rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-card px-3 py-2 text-sm font-bold outline-none shadow-brutal-sm"
        >
          {WORK_MODE_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-start gap-2 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-dashed border-border p-10">
          <p className="text-lg font-extrabold">No jobs match these filters.</p>
          <p className="text-sm text-muted-foreground">Try clearing the location filter or picking a different work mode.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((application) => (
            <JobCard key={application.id} application={application} />
          ))}
        </div>
      )}
    </div>
  );
}
