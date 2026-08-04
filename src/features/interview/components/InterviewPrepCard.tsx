import { Newspaper } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InterviewPrep } from "@prisma/client";
import { interviewPrepContentSchema } from "@/features/interview/schema";

export function InterviewPrepCard({ interviewPrep }: { interviewPrep: InterviewPrep }) {
  const parsed = interviewPrepContentSchema.safeParse(interviewPrep.content);
  const companyName = interviewPrep.label.split("@")[1]?.trim() ?? interviewPrep.label;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{interviewPrep.label}</CardTitle>
        <p className="text-xs text-muted-foreground">Updated {interviewPrep.updatedAt.toLocaleDateString()}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {!parsed.success ? (
          <p className="text-sm text-muted-foreground">No content available for this interview prep.</p>
        ) : (
          <>
            <Section title="Company">
              <p className="text-sm leading-relaxed">{parsed.data.companySummary}</p>
            </Section>
            <Section title="Product">
              <p className="text-sm leading-relaxed">{parsed.data.productOverview}</p>
            </Section>
            <Section title="Culture">
              <p className="text-sm leading-relaxed">{parsed.data.companyCulture}</p>
            </Section>
            <Section title="Salary insight">
              <p className="text-sm leading-relaxed">{parsed.data.salaryInsight}</p>
            </Section>

            <div className="flex items-start gap-3 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-dashed border-border p-3">
              <Newspaper className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground">Do your own research</p>
                <p className="mb-2 text-xs text-muted-foreground">
                  The AI doesn&apos;t have real-time access, so recent news and competitors aren&apos;t
                  generated — check these yourself before the interview:
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-bold">
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(companyName)}+news&tbm=nws`}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-4"
                  >
                    {companyName} news →
                  </a>
                  <a
                    href={`https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(companyName)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-4"
                  >
                    {companyName} on LinkedIn →
                  </a>
                </div>
              </div>
            </div>

            {parsed.data.starStories.length > 0 && (
              <Section title="STAR stories">
                <div className="flex flex-col gap-3">
                  {parsed.data.starStories.map((story, i) => (
                    <div key={i} className="rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border p-3">
                      <p className="mb-1 text-sm font-bold">{story.title}</p>
                      <p className="text-xs"><span className="font-bold">Situation:</span> {story.situation}</p>
                      <p className="text-xs"><span className="font-bold">Task:</span> {story.task}</p>
                      <p className="text-xs"><span className="font-bold">Action:</span> {story.action}</p>
                      <p className="text-xs"><span className="font-bold">Result:</span> {story.result}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {parsed.data.behavioralQuestions.length > 0 && (
              <Section title="Behavioral questions">
                <QuestionList items={parsed.data.behavioralQuestions} />
              </Section>
            )}
            {parsed.data.technicalQuestions.length > 0 && (
              <Section title="Technical questions">
                <QuestionList items={parsed.data.technicalQuestions} />
              </Section>
            )}
            {parsed.data.questionsToAsk.length > 0 && (
              <Section title="Ask the recruiter">
                <QuestionList items={parsed.data.questionsToAsk} />
              </Section>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-bold uppercase text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}

function QuestionList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 text-sm">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
