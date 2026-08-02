import type { ApplicationStatus } from "@prisma/client";

export const ACTIVE_STATUSES = [
  "NEW",
  "INTERESTED",
  "READY",
  "APPLIED",
  "VIEWED",
  "RECRUITER_CONTACT",
  "INTERVIEW",
  "TECHNICAL_TEST",
  "OFFER",
] as const satisfies readonly ApplicationStatus[];

export const CLOSED_STATUSES = ["REJECTED", "ARCHIVED"] as const satisfies readonly ApplicationStatus[];

export const ALL_STATUSES = [...ACTIVE_STATUSES, ...CLOSED_STATUSES] as const satisfies readonly ApplicationStatus[];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  NEW: "New",
  INTERESTED: "Interested",
  READY: "Ready",
  APPLIED: "Applied",
  VIEWED: "Viewed",
  RECRUITER_CONTACT: "Recruiter Contact",
  INTERVIEW: "Interview",
  TECHNICAL_TEST: "Technical Test",
  OFFER: "Offer",
  REJECTED: "Rejected",
  ARCHIVED: "Archived",
};
