import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/PageHeader";
import { StateWrapper } from "@/components/shared/StateWrapper";
import { InterviewPrepCard } from "@/features/interview/components/InterviewPrepCard";

export default async function InterviewPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const interviewPreps = await prisma.interviewPrep.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <PageHeader title="Interview" description="Company research, STAR stories, and prep questions per role." />
      <StateWrapper
        isEmpty={interviewPreps.length === 0}
        emptyFallback={
          <div className="flex flex-col items-start gap-2 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-dashed border-border p-10">
            <p className="text-lg font-extrabold">No interview prep yet.</p>
            <p className="text-sm text-muted-foreground">
              Move an application to the Interview stage on the Applications board, then click
              &quot;Generate interview prep.&quot;
            </p>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {interviewPreps.map((interviewPrep) => (
            <InterviewPrepCard key={interviewPrep.id} interviewPrep={interviewPrep} />
          ))}
        </div>
      </StateWrapper>
    </div>
  );
}
