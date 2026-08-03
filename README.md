# HireCopilot 🚀🤝💼

### *Wira AI Career Agent™*

> Find smarter. Apply better. Get hired faster.
> Asking for a friend. The friend is the guy who wrote this app. Hi.

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
- ⏳ **Interview Copilot, Portfolio Agent, Analytics, actual PDF export** — coming
  later, presumably before he runs out of savings, no pressure

## The Stack (a.k.a. what he'd tell you at a networking event, if he went to those)

Next.js 16 · React 19 · TypeScript (strict, no `any` — the one part of his life with
zero tolerance for uncertainty) · Tailwind v4 · Better Auth · Prisma · PostgreSQL via
Supabase · pnpm · an AI layer that talks to five different providers because
commitment issues, apparently, extend to model selection too.

## Getting Started (if you, a person with more free time than him, want to run this)

```bash
pnpm install
cp .env.example .env.local   # fill this in — the app can't read your mind, only your resume
pnpm exec prisma migrate dev
pnpm dev
```

Open `localhost:3000`. Watch an AI agent work harder on his career than several past
managers did.

## Project Structure (for the recruiters who ask about architecture in interviews)

```
src/
  app/            # routes only. thin. no logic. like his patience for cover letters.
  features/       # match, discovery, applications, resume, cover-letter — the actual work
  lib/ai/         # multi-provider AI layer with automatic fallback (gemini → openrouter → deepseek)
  components/
    ui/           # buttons, inputs, cards — reliable, unlike the job market
    shared/       # Sidebar, StateWrapper, PageHeader — load-bearing furniture
prisma/
  schema.prisma   # User, Profile, Job, Application, Resume, CoverLetter, and friends
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
