import { z } from "zod";

export const resumeContentSchema = z.object({
  summary: z.string(),
  skills: z.array(z.string()),
  experiences: z.array(
    z.object({
      title: z.string(),
      company: z.string(),
      bullets: z.array(z.string()),
    })
  ),
});

export type ResumeContent = z.infer<typeof resumeContentSchema>;
