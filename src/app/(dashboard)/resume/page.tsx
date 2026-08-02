import { PageHeader } from "@/components/shared/PageHeader";
import { ComingSoon } from "@/components/shared/ComingSoon";

export default function ResumePage() {
  return (
    <div>
      <PageHeader title="Resume" description="ATS-optimized resumes, generated per role." />
      <ComingSoon feature="Resume Agent" />
    </div>
  );
}
