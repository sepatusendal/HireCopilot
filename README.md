# HireCopilot 🚀🤝💼

### *Wira AI Career Agent™*

> Find smarter. Apply better. Get hired faster.
> Or, you know, don't. I'm a README, not your mom.

---

Look, I'm going to level with you, because that's kind of my whole brand. This is not
another job board where you upload a PDF into the void and receive seventeen rejection
emails from companies that never actually read it. That website already exists. It's
called every other job board. We are not doing that.

HireCopilot is an AI that behaves like a recruiter who actually likes you, works 24/7,
never takes a coffee break, and — critically — doesn't have a "culture fit" gut feeling
about your neck tattoo. It reads job descriptions so you don't have to skim 40 of them
at 2am while questioning your life choices. It writes cover letters that don't start
with "I am writing to express my interest." (If you've ever written that sentence, we
need to talk. Also, hi. Welcome. You're in the right place now.)

Quality over quantity. Ten laser-targeted applications beat three hundred spray-and-pray
ones, the same way one well-aimed sarcastic comment beats a whole PowerPoint of them.
Every score the AI gives you comes with a reason. No black boxes. No vibes-based
rejection. If the AI thinks you're a bad fit, it will *tell you why*, like a friend who's
too honest for their own good but you keep them around anyway.

---

## What's actually in here (Phase 0: The Foundation Arc)

This is the origin story. No superpowers yet, just the lab equipment.

- ✅ Auth that works (email/password + GitHub OAuth, because apparently typing a
  password twice is asking too much of humanity in 2026)
- ✅ A dashboard that doesn't look like it was designed by a Fortune 500 HR department
  in 2011 — bold borders, hard shadows, dark mode by default because your eyes deserve
  better at midnight
- ✅ A real, actual, talks-to-a-real-database Application Pipeline widget
- ✅ Nine other pages standing around going "we're not ready yet, but we look great
  doing nothing" (placeholders, but *tasteful* ones)
- ⏳ The actual AI agents (Discovery, Match, Resume, Cover Letter, Interview Coach, etc.)
  — coming in later phases, like sequels, except hopefully better than the third one

## The stack (a.k.a. what we told the investors)

Next.js 16 · React 19 · TypeScript (strict mode, no `any`, we have standards) ·
Tailwind v4 · Better Auth · Prisma · PostgreSQL via Supabase · pnpm because we like
our disk space the way we like our rejection rate: low.

## Getting started (yes, you, right now)

```bash
pnpm install
cp .env.example .env.local   # go fill this in, I'm not psychic
pnpm exec prisma migrate dev
pnpm dev
```

Then open `localhost:3000` and pretend to be impressed. You will be, actually. It's fine.

## Project structure, explained like you have somewhere to be

```
src/
  app/            # routes only. thin. no logic. like a good hallway.
  features/       # where the actual business logic lives, organized by domain
  components/
    ui/           # buttons, inputs, cards — the boring reliable friends
    shared/       # Sidebar, StateWrapper, PageHeader — the ones who show up everywhere
  lib/            # prisma client, auth config, the glue nobody notices until it's gone
prisma/
  schema.prisma   # User, Profile, Job, Application, Resume, and their little friends
```

Every page that fetches data goes through `StateWrapper`
([src/components/shared/StateWrapper.tsx](./src/components/shared/StateWrapper.tsx))
so you always get a Loading, Empty, Error, or Success state — never just a blank page
staring back at you like it forgot why it walked into the room.

## A message from management (me)

Built by [sepatusendal](https://github.com/sepatusendal), who apparently wants a career
agent so good it makes actual recruiters nervous. Bold goal. Respect it.

This README will get less unhinged as the product gets more real. Or it won't. Nobody's
stopping me. That's the beauty of open source and having no editor.

**Now go get hired. I believe in you. Mostly because I have to — I'm the README.**
