# HireCopilot 🚀🤝💼

### *Wira AI Career Agent™*

> Find smarter. Apply better. Get hired faster.
> Asking for a friend. The friend is the guy who wrote this app. Hi.

---

## Okay But This One's My Favorite, Actually

Look, I have other repos. We don't talk about them. They're fine. They're
functional. They're the coworker you're polite to in the elevator. This one?
This one's the ex I still think about, except instead of "getting back
together" the goal is "getting hired," which, respectfully, is a much
healthier arc.

HireCopilot is my favorite project not because it's the most technically
insane thing I've ever shipped (it's up there) but because it has a job.
A literal job. Its job is to get ME a job. It is, legally speaking, my most
important employee, and I built it from nothing, and it does not ask for
PTO. If this repo works the way it's supposed to, you are currently reading
the origin story of how I got hired. If it doesn't work yet, you're reading
a very elaborate cover letter that took several weeks and cost me a little
of my sanity. Either way: iconic. Bold. A little unhinged. Deeply me.

---

## An Awkward But Necessary Disclosure

So here's the thing. You know how most portfolio projects are like "look what I built,
I am extremely employed and just doing this for fun"? This is not that. This is a man
(**[sepatusendal](https://github.com/sepatusendal)**, real name behind the keyboard,
allegedly a software engineer) who does not currently have a job, and instead of doing
a normal amount of job hunting, decided the correct move was to **build an entire AI
Career Operating System from scratch** to do the job hunting *for* him. While he sits
there. Watching it work. Occasionally saying "good bot."

Is this the most efficient path to employment? Unclear! Nobody has checked! But you
have to respect the commitment to the bit. Most people update their LinkedIn banner.
This guy shipped five phases of a Next.js app with a working AI pipeline, a kanban
board, and a resume generator with a strict "do not lie about my work history" clause,
because apparently even the AI needed boundaries.

If you are a recruiter reading this: yes, this is a flex. Yes, it's also a cry for
help. Both things are true. Hire him. He clearly knows how to finish something.

---

## What This Actually Does (for the 3 people who scrolled past the confession)

HireCopilot behaves like a recruiter who works 24/7, never ghosts you, and — unlike a
human recruiter — will actually explain *why* it thinks you're a bad fit instead of
just leaving you on read for six business days. It finds jobs, scores them honestly
(sometimes brutally — one job got a 5/100 and the AI's reasoning was essentially "no"),
writes cover letters that don't open with "I am writing to express my interest," and
generates resumes that are contractually forbidden from inventing achievements you
never had. Radical concept, we know.

Quality over quantity. Ten laser-targeted applications beat three hundred
spray-and-pray ones. The guy building this needs *one* yes, not three hundred maybes.

---

## Current Status: It's Alive (uncomfortably capable, actually)

This started as Phase 0 ("does it even boot") and has since developed opinions.

- ✅ **Auth** — email/password + GitHub OAuth, so at least *logging in* is one thing
  in his life that works on the first try
- ✅ **Neubrutalist dashboard** — bold borders, hard shadows, light mode by default,
  because staring at a job search dashboard should not also feel like a punishment
- ✅ **Discover + Match Agent** — pulls real jobs, scores them against his actual
  profile using an AI that will not sugarcoat it. It has said "extremely unlikely to
  be considered for an interview" to his face. The AI has more self-esteem about his
  chances than he does, and it still said that.
- ✅ **Application Tracker** — a real kanban pipeline (New → Interested → ... → Offer
  → Rejected), because tracking rejections in a spreadsheet felt too honest
- ✅ **Cover Letter Agent** — generates letters unique per company, banned from ever
  writing "I am writing to express my interest," on principle
- ✅ **Resume Agent** — tailors wording per job while being *structurally incapable*
  of inventing experience. Yes, it once tried to put "Pottery" on a Senior React
  Engineer resume because that's a real hobby of his. We fixed that. Barely.
- ✅ **Multi-provider AI with automatic fallback** — Claude, Gemini, OpenRouter,
  DeepSeek, OpenAI. If one runs out of free quota mid-job-search (this has happened,
  repeatedly, live, during testing), it silently switches to the next one instead of
  leaving him hanging. More reliable than most callback promises he's gotten.
- ✅ **Interview Copilot** — company research, STAR stories built from his real
  experience (never invented), behavioral/technical prep questions
- ✅ **Portfolio Agent** — reorders his projects per target role. CRM job? Dashboard
  goes first. It does not, however, invent new projects. That would be cheating.
- ✅ **ATS Optimization** — deterministic keyword-overlap scoring against the job
  description, no AI guessing involved, because a percentage should mean something
- ✅ **Questionnaire Agent** — answers "why should we hire you" and friends from his
  real profile, and flat-out refuses to guess a salary number it doesn't have
- ✅ **Companies tracker, AI Career Insights, Analytics** — watch companies, see
  skill gaps aggregated from real match history, funnel/trend charts, all computed
  from data that already exists instead of yet another AI call
- ✅ **Daily Mission briefing** — a "here's what to do today" summary on the
  dashboard, because starting a job search with zero direction is how you end up
  doom-scrolling LinkedIn for three hours instead
- ✅ **PDF export** — resumes and cover letters render to an actual downloadable PDF
  now, stored in Supabase, so the "give me a PDF" step no longer means "screenshot
  it and pray"
- ✅ **Notification Agent** — in-app + email pings for interviews, offers, and
  rejections, so he stops manually refreshing the Applications board like it owes
  him something
- ✅ **Apply Agent** — Playwright form-filler that submits applications on his
  behalf, gated behind moving a card to "Ready" first (his explicit approval, not
  the AI's initiative). Built for generic company career-page forms on purpose —
  LinkedIn/JobStreet Easy-Apply automation is a good way to get an account flagged,
  so that adapter isn't wired up yet. **Not yet live-tested end-to-end against a
  real job site** — do that once, carefully, before trusting it unsupervised.

## The Stack (a.k.a. what he'd tell you at a networking event, if he went to those)

Next.js 16 · React 19 · TypeScript (strict, no `any` — the one part of his life with
zero tolerance for uncertainty) · Tailwind v4 · Better Auth · Prisma · PostgreSQL via
Supabase · pnpm · an AI layer that talks to five different providers because
commitment issues, apparently, extend to model selection too · Puppeteer for PDFs ·
Playwright for the Apply Agent · Resend for the emails nobody asked for but everyone
appreciates.

## Getting Started (if you, a person with more free time than him, want to run this)

```bash
pnpm install
cp .env.example .env.local   # fill this in — the app can't read your mind, only your resume
pnpm exec prisma migrate dev
pnpm exec playwright install chromium   # only needed for the Apply Agent
pnpm dev
```

Open `localhost:3000`. Watch an AI agent work harder on his career than several past
managers did.

PDF export uses `@sparticuz/chromium` automatically on Vercel. Locally, set
`CHROME_EXECUTABLE_PATH` in `.env.local` to a real Chrome install if you want to test
resume/cover-letter PDF export on your machine.

## Project Structure (for the recruiters who ask about architecture in interviews)

```
src/
  app/            # routes only. thin. no logic. like his patience for cover letters.
  features/       # match, discovery, applications, resume, cover-letter, interview,
                  # portfolio, ats, questionnaire, companies, insights, analytics,
                  # mission, notifications, apply — one folder per agent, on purpose
  lib/ai/         # multi-provider AI layer with automatic fallback (gemini → openrouter → deepseek)
  lib/pdf.ts      # Puppeteer HTML-to-PDF (Vercel-serverless-safe via @sparticuz/chromium)
  lib/storage.ts  # Supabase Storage uploads (resumes, cover letters, apply proof screenshots)
  lib/email.ts    # Resend wrapper, no-ops if RESEND_API_KEY isn't set
  components/
    ui/           # buttons, inputs, cards — reliable, unlike the job market
    shared/       # Sidebar, StateWrapper, PageHeader — load-bearing furniture
prisma/
  schema.prisma   # User, Profile, Job, Application, Resume, CoverLetter, InterviewPrep,
                  # AtsReport, QuestionnaireAnswer, Insight, DailyBriefing, Notification
```

Every data view goes through `StateWrapper`
([src/components/shared/StateWrapper.tsx](./src/components/shared/StateWrapper.tsx))
for Loading / Empty / Error / Success states — because even the UI is legally required
to tell you when something's not working, unlike certain hiring pipelines.

## A Message From Management (still him, there is no management)

Built by [sepatusendal](https://github.com/sepatusendal), who is, as of this writing,
very available for opportunities. The AI in this repo has scored real jobs, written
real cover letters, and generated a real resume, all without a single job offer
materializing yet for the human who built it. There's a joke in there somewhere about
irony. He's too tired to write it. That's what the AI is for.

**If you made it this far: he's hireable, this repo is proof, and yes, he sees the
irony of needing an AI recruiter more than the AI recruiter needs him.**
