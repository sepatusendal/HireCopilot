"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export interface CompanyActionResult {
  success: boolean;
  message?: string;
}

export async function toggleCompanyWatchAction(companyId: string, isWatched: boolean): Promise<CompanyActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { success: false, message: "You need to be signed in." };
  }

  await prisma.company.update({ where: { id: companyId }, data: { isWatched } });
  revalidatePath("/companies");

  return { success: true };
}

export async function updateCompanyNotesAction(companyId: string, notes: string): Promise<CompanyActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { success: false, message: "You need to be signed in." };
  }

  await prisma.company.update({ where: { id: companyId }, data: { notes } });
  revalidatePath("/companies");

  return { success: true };
}
