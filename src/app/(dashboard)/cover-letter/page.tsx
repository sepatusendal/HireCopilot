import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/PageHeader";
import { StateWrapper } from "@/components/shared/StateWrapper";
import { CoverLetterCard } from "@/features/cover-letter/components/CoverLetterCard";

export default async function CoverLetterPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const coverLetters = await prisma.coverLetter.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <PageHeader title="Cover Letter" description="Unique, company-aware cover letters." />
      <StateWrapper
        isEmpty={coverLetters.length === 0}
        emptyFallback={
          <div className="flex flex-col items-start gap-2 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-dashed border-border p-10">
            <p className="text-lg font-extrabold">No cover letters yet.</p>
            <p className="text-sm text-muted-foreground">
              Go to Applications and click &quot;Generate letter&quot; on a job you&apos;re pursuing.
            </p>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {coverLetters.map((coverLetter) => (
            <CoverLetterCard key={coverLetter.id} coverLetter={coverLetter} />
          ))}
        </div>
      </StateWrapper>
    </div>
  );
}
