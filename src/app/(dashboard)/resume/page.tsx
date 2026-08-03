import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/PageHeader";
import { StateWrapper } from "@/components/shared/StateWrapper";
import { ResumeCard } from "@/features/resume/components/ResumeCard";

export default async function ResumePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const resumes = await prisma.resume.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <PageHeader title="Resume" description="ATS-optimized resumes, generated per role." />
      <StateWrapper
        isEmpty={resumes.length === 0}
        emptyFallback={
          <div className="flex flex-col items-start gap-2 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-dashed border-border p-10">
            <p className="text-lg font-extrabold">No resumes yet.</p>
            <p className="text-sm text-muted-foreground">
              Go to Applications and click &quot;Generate resume&quot; on a job you&apos;re pursuing.
            </p>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      </StateWrapper>
    </div>
  );
}
