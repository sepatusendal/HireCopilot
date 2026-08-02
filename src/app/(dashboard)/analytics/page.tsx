import { PageHeader } from "@/components/shared/PageHeader";
import { ComingSoon } from "@/components/shared/ComingSoon";

export default function AnalyticsPage() {
  return (
    <div>
      <PageHeader title="Analytics" description="How your job search is trending over time." />
      <ComingSoon feature="Analytics" />
    </div>
  );
}
