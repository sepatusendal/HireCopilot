"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { MapPin, Mail, FileText, MessageSquare, Layers, ListChecks, Target, Send } from "lucide-react";
import type { Application, ApplicationStatus, AtsReport, Company, Job } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn, scoreAccent } from "@/lib/utils";
import { updateApplicationStatusAction } from "@/features/applications/actions";
import { ALL_STATUSES, STATUS_LABELS } from "@/features/applications/constants";
import { generateCoverLetterAction } from "@/features/cover-letter/actions";
import { generateResumeAction } from "@/features/resume/actions";
import { generateInterviewPrepAction } from "@/features/interview/actions";
import { reorderPortfolioAction } from "@/features/portfolio/actions";
import { PortfolioOrderPanel } from "@/features/portfolio/components/PortfolioOrderPanel";
import { generateQuestionnaireAction } from "@/features/questionnaire/actions";
import { QuestionnairePanel } from "@/features/questionnaire/components/QuestionnairePanel";
import { analyzeAtsAction } from "@/features/ats/actions";
import { AtsReportPanel } from "@/features/ats/components/AtsReportPanel";
import { applyToJobAction } from "@/features/apply/actions";

export type ApplicationWithJob = Application & { job: Job & { company: Company }; atsReport: AtsReport | null };

const INTERVIEW_PREP_STATUSES: ApplicationStatus[] = ["INTERVIEW", "TECHNICAL_TEST", "OFFER"];

export function ApplicationCard({
  application,
  projectsById,
}: {
  application: ApplicationWithJob;
  projectsById: Record<string, { title: string; category: string }>;
}) {
  const [isPending, startTransition] = useTransition();
  const [isGeneratingLetter, startGeneratingLetter] = useTransition();
  const [letterError, setLetterError] = useState<string | null>(null);
  const [isGeneratingResume, startGeneratingResume] = useTransition();
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [isGeneratingPrep, startGeneratingPrep] = useTransition();
  const [prepError, setPrepError] = useState<string | null>(null);
  const [isGeneratingPortfolio, startGeneratingPortfolio] = useTransition();
  const [portfolioError, setPortfolioError] = useState<string | null>(null);
  const [isGeneratingQuestionnaire, startGeneratingQuestionnaire] = useTransition();
  const [questionnaireError, setQuestionnaireError] = useState<string | null>(null);
  const [isAnalyzingAts, startAnalyzingAts] = useTransition();
  const [atsError, setAtsError] = useState<string | null>(null);
  const [isApplying, startApplying] = useTransition();
  const [applyMessage, setApplyMessage] = useState<string | null>(null);
  const score = application.matchScore ?? 0;
  const accent = scoreAccent(score);
  const showInterviewPrep = INTERVIEW_PREP_STATUSES.includes(application.status);

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

        <div className="mt-2 flex items-center gap-2">
          <button
            disabled={isGeneratingLetter}
            onClick={() =>
              startGeneratingLetter(async () => {
                setLetterError(null);
                const result = await generateCoverLetterAction(application.id);
                if (!result.success) {
                  setLetterError(result.message ?? "Something went wrong.");
                }
              })
            }
            className="flex flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-card px-2.5 py-1.5 text-xs font-bold shadow-brutal-sm transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Mail className="size-3.5" />
            {isGeneratingLetter
              ? "Writing…"
              : application.coverLetterId
                ? "Regenerate letter"
                : "Generate letter"}
          </button>
          {application.coverLetterId && !isGeneratingLetter && (
            <Link
              href="/cover-letter"
              className="rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-ai px-2.5 py-1.5 text-xs font-bold text-ai-foreground shadow-brutal-sm transition-transform hover:-translate-y-0.5"
            >
              View
            </Link>
          )}
        </div>
        {letterError && <p className="mt-2 text-xs font-bold text-rejection">{letterError}</p>}

        <div className="mt-2 flex items-center gap-2">
          <button
            disabled={isGeneratingResume}
            onClick={() =>
              startGeneratingResume(async () => {
                setResumeError(null);
                const result = await generateResumeAction(application.id);
                if (!result.success) {
                  setResumeError(result.message ?? "Something went wrong.");
                }
              })
            }
            className="flex flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-card px-2.5 py-1.5 text-xs font-bold shadow-brutal-sm transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FileText className="size-3.5" />
            {isGeneratingResume
              ? "Writing…"
              : application.resumeId
                ? "Regenerate resume"
                : "Generate resume"}
          </button>
          {application.resumeId && !isGeneratingResume && (
            <Link
              href="/resume"
              className="rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-ai px-2.5 py-1.5 text-xs font-bold text-ai-foreground shadow-brutal-sm transition-transform hover:-translate-y-0.5"
            >
              View
            </Link>
          )}
        </div>
        {resumeError && <p className="mt-2 text-xs font-bold text-rejection">{resumeError}</p>}

        {application.resumeId && (
          <div className="mt-2 flex items-center gap-2">
            <button
              disabled={isAnalyzingAts}
              onClick={() =>
                startAnalyzingAts(async () => {
                  setAtsError(null);
                  const result = await analyzeAtsAction(application.id);
                  if (!result.success) {
                    setAtsError(result.message ?? "Something went wrong.");
                  }
                })
              }
              className="flex flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-card px-2.5 py-1.5 text-xs font-bold shadow-brutal-sm transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Target className="size-3.5" />
              {isAnalyzingAts ? "Analyzing…" : application.atsReportId ? "Re-analyze ATS" : "Analyze ATS"}
            </button>
          </div>
        )}
        {atsError && <p className="mt-2 text-xs font-bold text-rejection">{atsError}</p>}
        {application.atsReport && <AtsReportPanel atsReport={application.atsReport} />}

        {showInterviewPrep && (
          <>
            <div className="mt-2 flex items-center gap-2">
              <button
                disabled={isGeneratingPrep}
                onClick={() =>
                  startGeneratingPrep(async () => {
                    setPrepError(null);
                    const result = await generateInterviewPrepAction(application.id);
                    if (!result.success) {
                      setPrepError(result.message ?? "Something went wrong.");
                    }
                  })
                }
                className="flex flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-card px-2.5 py-1.5 text-xs font-bold shadow-brutal-sm transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <MessageSquare className="size-3.5" />
                {isGeneratingPrep
                  ? "Prepping…"
                  : application.interviewPrepId
                    ? "Regenerate interview prep"
                    : "Generate interview prep"}
              </button>
              {application.interviewPrepId && !isGeneratingPrep && (
                <Link
                  href="/interview"
                  className="rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-ai px-2.5 py-1.5 text-xs font-bold text-ai-foreground shadow-brutal-sm transition-transform hover:-translate-y-0.5"
                >
                  View
                </Link>
              )}
            </div>
            {prepError && <p className="mt-2 text-xs font-bold text-rejection">{prepError}</p>}
          </>
        )}

        <div className="mt-2 flex items-center gap-2">
          <button
            disabled={isGeneratingPortfolio}
            onClick={() =>
              startGeneratingPortfolio(async () => {
                setPortfolioError(null);
                const result = await reorderPortfolioAction(application.id);
                if (!result.success) {
                  setPortfolioError(result.message ?? "Something went wrong.");
                }
              })
            }
            className="flex flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-card px-2.5 py-1.5 text-xs font-bold shadow-brutal-sm transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Layers className="size-3.5" />
            {isGeneratingPortfolio
              ? "Reordering…"
              : application.portfolioOrder
                ? "Re-reorder portfolio"
                : "Reorder portfolio"}
          </button>
        </div>
        {portfolioError && <p className="mt-2 text-xs font-bold text-rejection">{portfolioError}</p>}
        {application.portfolioOrder != null && (
          <PortfolioOrderPanel portfolioOrder={application.portfolioOrder} projectsById={projectsById} />
        )}

        <div className="mt-2 flex items-center gap-2">
          <button
            disabled={isGeneratingQuestionnaire}
            onClick={() =>
              startGeneratingQuestionnaire(async () => {
                setQuestionnaireError(null);
                const result = await generateQuestionnaireAction(application.id);
                if (!result.success) {
                  setQuestionnaireError(result.message ?? "Something went wrong.");
                }
              })
            }
            className="flex flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-card px-2.5 py-1.5 text-xs font-bold shadow-brutal-sm transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ListChecks className="size-3.5" />
            {isGeneratingQuestionnaire
              ? "Answering…"
              : application.answers
                ? "Regenerate answers"
                : "Answer questionnaire"}
          </button>
        </div>
        {questionnaireError && <p className="mt-2 text-xs font-bold text-rejection">{questionnaireError}</p>}
        {application.answers != null && (
          <QuestionnairePanel applicationId={application.id} answers={application.answers} />
        )}

        {application.status === "READY" && (
          <>
            <div className="mt-2 flex items-center gap-2">
              <button
                disabled={isApplying}
                onClick={() =>
                  startApplying(async () => {
                    setApplyMessage(null);
                    const result = await applyToJobAction(application.id);
                    setApplyMessage(result.message ?? (result.success ? "Done." : "Something went wrong."));
                  })
                }
                className="flex flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-interview px-2.5 py-1.5 text-xs font-bold text-interview-foreground shadow-brutal-sm transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="size-3.5" />
                {isApplying ? "Applying…" : "Submit via Apply Agent"}
              </button>
            </div>
            {applyMessage && <p className="mt-2 text-xs font-bold">{applyMessage}</p>}
          </>
        )}
        {application.applyProofUrl && (
          <a
            href={application.applyProofUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-xs font-bold underline underline-offset-4"
          >
            View apply proof screenshot →
          </a>
        )}
      </CardContent>
    </Card>
  );
}
