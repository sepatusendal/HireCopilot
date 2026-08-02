"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Sparkles } from "lucide-react";
import { syncJobsAction, type SyncJobsState } from "@/features/discovery/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const initialState: SyncJobsState = { status: "idle" };

export function SyncJobsButton() {
  const [state, formAction] = useActionState(syncJobsAction, initialState);

  return (
    <form action={formAction} className="flex flex-col items-start gap-2">
      <SubmitButton />
      {state.status !== "idle" && (
        <p
          role="status"
          className={cn("text-sm font-bold", state.status === "error" ? "text-rejection" : "text-interview")}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      <Sparkles className="size-4" />
      {pending ? "Scoring jobs…" : "Sync jobs"}
    </Button>
  );
}
