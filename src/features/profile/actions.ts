"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const experienceLevels = ["ENTRY", "JUNIOR", "MID", "SENIOR", "LEAD", "EXECUTIVE"] as const;
const workModes = ["ANY", "ONSITE", "REMOTE", "HYBRID"] as const;

const profileSchema = z.object({
  headline: z.string().max(200).optional(),
  summary: z.string().max(2000).optional(),
  targetRoles: z.string().optional(),
  experienceLevel: z.enum(experienceLevels).optional(),
  location: z.string().max(200).optional(),
  preferredWorkMode: z.enum(workModes).optional(),
  skills: z.string().optional(),
});

export interface ProfileFormState {
  status: "idle" | "success" | "error";
  message?: string;
}

function splitCommaList(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export async function upsertProfileAction(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { status: "error", message: "You need to be signed in." };
  }

  const parsed = profileSchema.safeParse({
    headline: formData.get("headline")?.toString(),
    summary: formData.get("summary")?.toString(),
    targetRoles: formData.get("targetRoles")?.toString(),
    experienceLevel: formData.get("experienceLevel")?.toString() || undefined,
    location: formData.get("location")?.toString(),
    preferredWorkMode: formData.get("preferredWorkMode")?.toString() || undefined,
    skills: formData.get("skills")?.toString(),
  });

  if (!parsed.success) {
    return { status: "error", message: "Some fields look off — check the form and try again." };
  }

  const { headline, summary, targetRoles, experienceLevel, location, preferredWorkMode, skills } = parsed.data;
  const targetRolesList = splitCommaList(targetRoles);
  const skillsList = splitCommaList(skills);

  const profile = await prisma.profile.upsert({
    where: { userId: session.user.id },
    update: {
      headline: headline || null,
      summary: summary || null,
      targetRoles: targetRolesList,
      experienceLevel,
      location: location || null,
      preferredWorkMode,
    },
    create: {
      userId: session.user.id,
      headline: headline || null,
      summary: summary || null,
      targetRoles: targetRolesList,
      experienceLevel,
      location: location || null,
      preferredWorkMode,
    },
  });

  await prisma.skill.deleteMany({ where: { profileId: profile.id } });
  if (skillsList.length > 0) {
    await prisma.skill.createMany({
      data: skillsList.map((name) => ({ profileId: profile.id, name })),
      skipDuplicates: true,
    });
  }

  revalidatePath("/settings");

  return { status: "success", message: "Profile saved." };
}
