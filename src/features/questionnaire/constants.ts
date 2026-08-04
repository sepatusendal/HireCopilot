import type { QuestionnaireQuestion } from "@/lib/ai";

export const STANDARD_QUESTIONS: QuestionnaireQuestion[] = [
  { question: "Why should we hire you for this role?", category: "motivation" },
  { question: "What is your expected salary?", category: "compensation" },
  { question: "What is your notice period?", category: "logistics" },
  { question: "How many years of relevant experience do you have?", category: "experience" },
  { question: "Do you require visa sponsorship to work in this role's location?", category: "logistics" },
  { question: "Are you authorized to work in this role's location?", category: "logistics" },
];
