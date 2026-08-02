import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function scoreAccent(score: number): "interview" | "mission" | "warning" {
  if (score >= 75) return "interview";
  if (score >= 50) return "mission";
  return "warning";
}
