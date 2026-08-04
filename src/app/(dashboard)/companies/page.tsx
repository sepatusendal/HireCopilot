import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/PageHeader";
import { StateWrapper } from "@/components/shared/StateWrapper";
import { CompanyCard, type CompanyWithStats } from "@/features/companies/components/CompanyCard";

export default async function CompaniesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const companies = await prisma.company.findMany({
    where: { jobs: { some: { applications: { some: { userId: session.user.id } } } } },
    include: {
      jobs: {
        include: { applications: { where: { userId: session.user.id } } },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const companiesWithStats: CompanyWithStats[] = companies
    .map((company) => ({
      ...company,
      jobCount: company.jobs.length,
      applicationCount: company.jobs.reduce((sum, job) => sum + job.applications.length, 0),
    }))
    .sort((a, b) => Number(b.isWatched) - Number(a.isWatched) || b.applicationCount - a.applicationCount);

  return (
    <div>
      <PageHeader title="Companies" description="Every company you've applied to or are watching." />
      <StateWrapper
        isEmpty={companiesWithStats.length === 0}
        emptyFallback={
          <div className="flex flex-col items-start gap-2 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-dashed border-border p-10">
            <p className="text-lg font-extrabold">No companies tracked yet.</p>
            <p className="text-sm text-muted-foreground">
              Companies show up here once you apply to one of their jobs from Discover.
            </p>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {companiesWithStats.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </StateWrapper>
    </div>
  );
}
