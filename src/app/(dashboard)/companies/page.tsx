import { PageHeader } from "@/components/shared/PageHeader";
import { ComingSoon } from "@/components/shared/ComingSoon";

export default function CompaniesPage() {
  return (
    <div>
      <PageHeader title="Companies" description="Every company you've applied to or are watching." />
      <ComingSoon feature="Company Tracking" />
    </div>
  );
}
