import { matchJob, type MatchResult } from "@/lib/ai";
import { toJobProfileInput, type JobWithCompany, type ProfileWithRelations } from "@/lib/ai/mappers";

export async function matchJobToProfile(
  job: JobWithCompany,
  profile: ProfileWithRelations
): Promise<MatchResult> {
  return matchJob(toJobProfileInput(job, profile));
}
