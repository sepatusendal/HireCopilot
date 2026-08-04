import { z } from "zod";

export const questionnaireAnswersContentSchema = z.array(
  z.object({
    question: z.string(),
    category: z.string(),
    answer: z.string(),
    needsUserInput: z.boolean(),
  })
);

export type QuestionnaireAnswersContent = z.infer<typeof questionnaireAnswersContentSchema>;
