import { generateCoverLetter } from "@/lib/ai";
import { toJobProfileInput, type JobWithCompany, type ProfileWithRelations } from "@/lib/ai/mappers";

export async function generateCoverLetterForApplication(
  job: JobWithCompany,
  profile: ProfileWithRelations
): Promise<string> {
  return generateCoverLetter(toJobProfileInput(job, profile));
}
