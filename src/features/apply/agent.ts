import { chromium } from "playwright";
import type { Application, CoverLetter, Job, Profile, Resume, User } from "@prisma/client";
import { questionnaireAnswersContentSchema } from "@/features/questionnaire/schema";

export interface ApplyContext {
  application: Application;
  job: Job;
  user: User;
  profile: Profile | null;
  resume: Resume | null;
  coverLetter: CoverLetter | null;
}

export interface ApplyResult {
  submitted: boolean;
  screenshot: Buffer;
  log: string[];
}

interface FieldRule {
  match: RegExp;
  value: (ctx: ApplyContext, answers: { question: string; answer: string }[]) => string | null;
}

function findAnswer(answers: { question: string; answer: string }[], keywords: RegExp): string | null {
  const hit = answers.find((a) => keywords.test(a.question));
  return hit?.answer ?? null;
}

const TEXT_FIELD_RULES: FieldRule[] = [
  { match: /full ?name|your name/i, value: (ctx) => ctx.user.name },
  { match: /email/i, value: (ctx) => ctx.user.email },
  { match: /linkedin/i, value: (ctx) => ctx.profile?.linkedinUrl ?? null },
  { match: /github/i, value: (ctx) => ctx.profile?.githubUrl ?? null },
  { match: /portfolio|website/i, value: (ctx) => ctx.profile?.portfolioUrl ?? null },
  { match: /location|city|address/i, value: (ctx) => ctx.profile?.location ?? null },
  { match: /salary/i, value: (_ctx, answers) => findAnswer(answers, /salary/i) },
  { match: /notice/i, value: (_ctx, answers) => findAnswer(answers, /notice/i) },
  { match: /years.*experience|experience.*years/i, value: (_ctx, answers) => findAnswer(answers, /years.*experience/i) },
  { match: /visa|sponsorship/i, value: (_ctx, answers) => findAnswer(answers, /visa|sponsorship/i) },
  { match: /authoriz/i, value: (_ctx, answers) => findAnswer(answers, /authoriz/i) },
];

const COVER_LETTER_FIELD = /cover letter|message|why.*(interest|fit)|additional information/i;
const SUBMIT_BUTTON = /submit|apply now|send application/i;

/**
 * Generic form-filler for a company career-page application form. Deliberately
 * NOT built for LinkedIn/JobStreet/Glints Easy-Apply — their anti-bot
 * detection is aggressive enough that automating them risks the user's real
 * account getting flagged, and this hasn't been tested against them. Fields
 * it can't confidently map from real data are left untouched — it never
 * invents a value (no fabricated salary numbers, no guessed years of
 * experience) the way the Resume/Cover Letter agents never invent experience.
 */
export async function runApplyAgent(ctx: ApplyContext): Promise<ApplyResult> {
  const log: string[] = [];
  const parsedAnswers = questionnaireAnswersContentSchema.safeParse(ctx.application.answers);
  const answers = parsedAnswers.success ? parsedAnswers.data : [];

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(ctx.job.sourceUrl, { waitUntil: "domcontentloaded", timeout: 30_000 });
    log.push(`Opened ${ctx.job.sourceUrl}`);

    const textInputs = await page.locator("input[type=text], input[type=email], input[type=tel], input:not([type])").all();
    const textareas = await page.locator("textarea").all();

    for (const input of textInputs) {
      const label = await inferFieldLabel(input);
      if (!label) continue;
      const rule = TEXT_FIELD_RULES.find((r) => r.match.test(label));
      const value = rule?.value(ctx, answers);
      if (value) {
        await input.fill(value).catch(() => undefined);
        log.push(`Filled "${label}" from real profile/answer data.`);
      }
    }

    for (const textarea of textareas) {
      const label = await inferFieldLabel(textarea);
      if (!label) continue;
      if (COVER_LETTER_FIELD.test(label) && ctx.coverLetter?.content) {
        await textarea.fill(ctx.coverLetter.content).catch(() => undefined);
        log.push(`Filled "${label}" with the generated cover letter.`);
        continue;
      }
      const rule = TEXT_FIELD_RULES.find((r) => r.match.test(label));
      const value = rule?.value(ctx, answers);
      if (value) {
        await textarea.fill(value).catch(() => undefined);
        log.push(`Filled "${label}" from real profile/answer data.`);
      }
    }

    if (ctx.resume?.fileUrl) {
      const fileInput = page.locator("input[type=file]").first();
      if (await fileInput.count()) {
        try {
          const response = await fetch(ctx.resume.fileUrl);
          const arrayBuffer = await response.arrayBuffer();
          await fileInput.setInputFiles({
            name: "resume.pdf",
            mimeType: "application/pdf",
            buffer: Buffer.from(arrayBuffer),
          });
          log.push("Attached resume PDF.");
        } catch (error) {
          log.push(`Could not attach resume: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }

    const screenshot = await page.screenshot({ fullPage: true });

    const submitButton = page.getByRole("button", { name: SUBMIT_BUTTON }).first();
    let submitted = false;
    if (await submitButton.count()) {
      await submitButton.click().catch(() => undefined);
      log.push("Clicked submit.");
      submitted = true;
    } else {
      log.push("No recognizable submit button found — form filled but not submitted.");
    }

    return { submitted, screenshot: Buffer.from(screenshot), log };
  } finally {
    await browser.close();
  }
}

async function inferFieldLabel(locator: import("playwright").Locator): Promise<string | null> {
  const [placeholder, name, ariaLabel, id] = await Promise.all([
    locator.getAttribute("placeholder"),
    locator.getAttribute("name"),
    locator.getAttribute("aria-label"),
    locator.getAttribute("id"),
  ]);
  if (id) {
    const label = await locator.page().locator(`label[for="${id}"]`).first().textContent().catch(() => null);
    if (label?.trim()) return label.trim();
  }
  return ariaLabel || placeholder || name || null;
}
