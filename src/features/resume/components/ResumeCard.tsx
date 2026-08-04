import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AtsReport, Resume } from "@prisma/client";
import { resumeContentSchema } from "@/features/resume/schema";
import { AtsReportPanel } from "@/features/ats/components/AtsReportPanel";
import { DownloadPdfButton } from "@/components/shared/DownloadPdfButton";
import { exportResumePdfAction } from "@/features/resume/actions";

export function ResumeCard({ resume, atsReport }: { resume: Resume; atsReport?: AtsReport | null }) {
  const parsed = resumeContentSchema.safeParse(resume.content);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{resume.label}</CardTitle>
        <p className="text-xs text-muted-foreground">Updated {resume.updatedAt.toLocaleDateString()}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {!parsed.success ? (
          <p className="text-sm text-muted-foreground">No content available for this resume.</p>
        ) : (
          <>
            <p className="text-sm leading-relaxed">{parsed.data.summary}</p>

            {parsed.data.skills.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-bold uppercase text-muted-foreground">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {parsed.data.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border-[var(--border-width)] border-border bg-ai/20 px-2.5 py-0.5 text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {parsed.data.experiences.length > 0 && (
              <div className="flex flex-col gap-3">
                <p className="text-xs font-bold uppercase text-muted-foreground">Experience</p>
                {parsed.data.experiences.map((experience, i) => (
                  <div key={i}>
                    <p className="text-sm font-bold">
                      {experience.title} <span className="font-normal text-muted-foreground">— {experience.company}</span>
                    </p>
                    {experience.bullets.length > 0 && (
                      <ul className="mt-1 list-disc pl-5 text-sm">
                        {experience.bullets.map((bullet, j) => (
                          <li key={j}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {atsReport && <AtsReportPanel atsReport={atsReport} />}
        <DownloadPdfButton id={resume.id} fileUrl={resume.fileUrl} exportAction={exportResumePdfAction} />
      </CardContent>
    </Card>
  );
}
