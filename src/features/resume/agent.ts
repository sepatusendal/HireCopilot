import { generateResume } from "@/lib/ai";
import { toJobProfileInput, type JobWithCompany, type ProfileWithRelations } from "@/lib/ai/mappers";
import type { resumeContentSchema } from "@/features/resume/schema";
import type { z } from "zod";

export type ResumeContent = z.infer<typeof resumeContentSchema>;

/**
 * Calls the AI for tailored wording, then discards anything it returns that
 * isn't grounded in the candidate's real profile data — title/company/order
 * always come from `profile.experiences`, and skills are filtered against
 * `profile.skills`. This is what makes it safe to call this "the candidate's
 * resume" instead of "text an LLM made up".
 */
export async function generateResumeForApplication(
  job: JobWithCompany,
  profile: ProfileWithRelations
): Promise<ResumeContent> {
  const result = await generateResume(toJobProfileInput(job, profile));

  const realSkills = new Set(profile.skills.map((s) => s.name));
  const skills = result.skills.filter((skill) => realSkills.has(skill));

  const experiences = profile.experiences.map((experience, index) => {
    const aiEntry = result.experiences[index];
    return {
      title: experience.title,
      company: experience.company,
      bullets: aiEntry?.bullets.length ? aiEntry.bullets : experience.description ? [experience.description] : [],
    };
  });

  return { summary: result.summary, skills, experiences };
}
