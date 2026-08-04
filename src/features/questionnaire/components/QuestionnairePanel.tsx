"use client";

import { useState, useTransition } from "react";
import { AlertTriangle } from "lucide-react";
import { questionnaireAnswersContentSchema } from "@/features/questionnaire/schema";
import { saveQuestionnaireAnswerAction } from "@/features/questionnaire/actions";

export function QuestionnairePanel({ applicationId, answers }: { applicationId: string; answers: unknown }) {
  const parsed = questionnaireAnswersContentSchema.safeParse(answers);
  if (!parsed.success || parsed.data.length === 0) return null;

  return (
    <div className="mt-2 flex flex-col gap-2 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-dashed border-border p-2.5">
      <p className="text-xs font-bold uppercase text-muted-foreground">Questionnaire</p>
      {parsed.data.map((item) => (
        <AnswerRow key={item.question} applicationId={applicationId} question={item.question} answer={item.answer} needsUserInput={item.needsUserInput} />
      ))}
    </div>
  );
}

function AnswerRow({
  applicationId,
  question,
  answer,
  needsUserInput,
}: {
  applicationId: string;
  question: string;
  answer: string;
  needsUserInput: boolean;
}) {
  const [value, setValue] = useState(answer);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(!needsUserInput);

  return (
    <div>
      <p className="flex items-center gap-1 text-xs font-bold">
        {needsUserInput && !saved && <AlertTriangle className="size-3 shrink-0 text-warning" />}
        {question}
      </p>
      <div className="mt-1 flex items-start gap-1.5">
        <textarea
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setSaved(false);
          }}
          rows={2}
          className="w-full resize-none rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-surface px-2 py-1 text-xs outline-none"
        />
        <button
          disabled={isPending || saved}
          onClick={() =>
            startTransition(async () => {
              await saveQuestionnaireAnswerAction(applicationId, question, value);
              setSaved(true);
            })
          }
          className="shrink-0 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-card px-2 py-1 text-xs font-bold shadow-brutal-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}
