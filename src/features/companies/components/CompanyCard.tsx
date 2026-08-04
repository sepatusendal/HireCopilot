"use client";

import { useState, useTransition } from "react";
import { Star, MapPin } from "lucide-react";
import type { Company } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toggleCompanyWatchAction, updateCompanyNotesAction } from "@/features/companies/actions";

export interface CompanyWithStats extends Company {
  jobCount: number;
  applicationCount: number;
}

export function CompanyCard({ company }: { company: CompanyWithStats }) {
  const [isWatched, setIsWatched] = useState(company.isWatched);
  const [notes, setNotes] = useState(company.notes ?? "");
  const [isPending, startTransition] = useTransition();
  const [isSavingNotes, startSavingNotes] = useTransition();

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
        <div>
          <CardTitle>{company.name}</CardTitle>
          {company.industry && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" />
              {company.industry}
            </p>
          )}
        </div>
        <button
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              const next = !isWatched;
              setIsWatched(next);
              await toggleCompanyWatchAction(company.id, next);
            })
          }
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border shadow-brutal-sm transition-transform hover:-translate-y-0.5",
            isWatched ? "bg-mission text-mission-foreground" : "bg-card"
          )}
          aria-label={isWatched ? "Unwatch company" : "Watch company"}
        >
          <Star className={cn("size-4", isWatched && "fill-current")} />
        </button>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex gap-2 text-xs font-bold">
          <span className="rounded-full border-[var(--border-width)] border-border bg-surface px-2.5 py-0.5">
            {company.jobCount} job{company.jobCount === 1 ? "" : "s"}
          </span>
          <span className="rounded-full border-[var(--border-width)] border-border bg-surface px-2.5 py-0.5">
            {company.applicationCount} application{company.applicationCount === 1 ? "" : "s"}
          </span>
        </div>
        {company.website && (
          <a href={company.website} target="_blank" rel="noreferrer" className="text-xs font-bold underline underline-offset-4">
            {company.website}
          </a>
        )}
        <div>
          <p className="mb-1 text-xs font-bold uppercase text-muted-foreground">Notes</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() =>
              startSavingNotes(async () => {
                await updateCompanyNotesAction(company.id, notes);
              })
            }
            placeholder="Anything worth remembering about this company…"
            rows={2}
            className="w-full resize-none rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-surface px-2 py-1.5 text-xs outline-none"
          />
          {isSavingNotes && <p className="mt-1 text-xs text-muted-foreground">Saving…</p>}
        </div>
      </CardContent>
    </Card>
  );
}
