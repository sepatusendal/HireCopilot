"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { upsertProfileAction, type ProfileFormState } from "@/features/profile/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const EXPERIENCE_LEVELS = [
  { value: "", label: "Select level" },
  { value: "ENTRY", label: "Entry" },
  { value: "JUNIOR", label: "Junior" },
  { value: "MID", label: "Mid" },
  { value: "SENIOR", label: "Senior" },
  { value: "LEAD", label: "Lead" },
  { value: "EXECUTIVE", label: "Executive" },
] as const;

const WORK_MODES = [
  { value: "ANY", label: "No preference" },
  { value: "REMOTE", label: "Remote only" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "ONSITE", label: "Onsite" },
] as const;

interface ProfileFormProps {
  defaultValues: {
    headline: string;
    summary: string;
    targetRoles: string;
    experienceLevel: string;
    location: string;
    preferredWorkMode: string;
    skills: string;
  };
}

const initialState: ProfileFormState = { status: "idle" };

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const [state, formAction] = useActionState(upsertProfileAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="headline" className="text-sm font-bold">
          Headline
        </label>
        <Input
          id="headline"
          name="headline"
          placeholder="Senior Product Manager, CRM & Growth"
          defaultValue={defaultValues.headline}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="summary" className="text-sm font-bold">
          Summary
        </label>
        <textarea
          id="summary"
          name="summary"
          rows={4}
          placeholder="A couple of sentences about what you do best."
          defaultValue={defaultValues.summary}
          className="flex w-full rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-card px-4 py-3 text-sm text-foreground shadow-brutal-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:shadow-brutal"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="targetRoles" className="text-sm font-bold">
            Target roles
          </label>
          <Input
            id="targetRoles"
            name="targetRoles"
            placeholder="Product Manager, Growth Manager"
            defaultValue={defaultValues.targetRoles}
          />
          <p className="text-xs text-muted-foreground">Comma-separated.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="experienceLevel" className="text-sm font-bold">
            Experience level
          </label>
          <select
            id="experienceLevel"
            name="experienceLevel"
            defaultValue={defaultValues.experienceLevel}
            className={cn(
              "flex h-11 w-full rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-card px-4 text-sm text-foreground shadow-brutal-sm outline-none transition-shadow focus-visible:shadow-brutal"
            )}
          >
            {EXPERIENCE_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="location" className="text-sm font-bold">
            Location
          </label>
          <Input
            id="location"
            name="location"
            placeholder="Jakarta, Indonesia"
            defaultValue={defaultValues.location}
          />
          <p className="text-xs text-muted-foreground">Used to judge onsite/hybrid job fit.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="preferredWorkMode" className="text-sm font-bold">
            Preferred work mode
          </label>
          <select
            id="preferredWorkMode"
            name="preferredWorkMode"
            defaultValue={defaultValues.preferredWorkMode}
            className="flex h-11 w-full rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-card px-4 text-sm text-foreground shadow-brutal-sm outline-none transition-shadow focus-visible:shadow-brutal"
          >
            {WORK_MODES.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="skills" className="text-sm font-bold">
          Skills
        </label>
        <Input
          id="skills"
          name="skills"
          placeholder="SQL, HubSpot, Figma, Roadmapping"
          defaultValue={defaultValues.skills}
        />
        <p className="text-xs text-muted-foreground">Comma-separated. This is what the Match Agent compares against job requirements.</p>
      </div>

      <SubmitButton />

      {state.status !== "idle" && (
        <p
          role="status"
          className={cn(
            "text-sm font-bold",
            state.status === "error" ? "text-rejection" : "text-interview"
          )}
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
    <Button type="submit" disabled={pending} className="self-start">
      {pending ? "Saving…" : "Save profile"}
    </Button>
  );
}
