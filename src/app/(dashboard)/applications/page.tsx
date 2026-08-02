import { PageHeader } from "@/components/shared/PageHeader";
import { ComingSoon } from "@/components/shared/ComingSoon";

export default function ApplicationsPage() {
  return (
    <div>
      <PageHeader title="Applications" description="Every application, tracked from New to Offer." />
      <ComingSoon feature="Application Tracker" />
    </div>
  );
}
