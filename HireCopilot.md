# HireCopilot
### Built by sepatusendal

> Your AI Career Agent.
> Find smarter. Apply better. Get hired faster.

---

## Overview

HireCopilot is an AI-powered career operating system that helps professionals find jobs, optimize their applications, and increase interview opportunities.

Unlike traditional job boards or mass auto-apply bots, HireCopilot behaves like a professional recruiter working 24/7.

It continuously searches for new opportunities, understands the user's experience, analyzes job descriptions, optimizes resumes for ATS, generates personalized cover letters, prepares application answers, tracks every application, and helps users prepare for interviews.

The objective is **not** to send the highest number of applications.
The objective **is** to maximize interview invitations and job offers.

---

## Product Philosophy

- Quality > Quantity
- Every application should be intentional.
- Every resume should be optimized.
- Every recommendation should be explainable.
- The AI should think before acting.
- The user should always stay in control.
- HireCopilot is not an auto-spam bot. HireCopilot is a professional AI recruiter.

---

## Target Users

- Product Managers
- CRM Managers
- Growth Managers
- Digital Marketers
- Software Engineers
- UI/UX Designers
- Fresh Graduates
- Career Switchers
- Remote Workers
- International Job Seekers

---

## Core Features

### AI Job Discovery
Continuously searches jobs from multiple providers. Supports LinkedIn, JobStreet, Glints, Kalibrr, Indeed, Wellfound, and Company Career Pages. Runs automatically every few hours.

### AI Match Scoring
Every job is analyzed and returns:
- Match Score (0–100%)
- Strengths
- Weaknesses
- Missing Skills
- ATS Compatibility
- Interview Probability
- Salary Compatibility

Every score must be explainable — never return black-box results.

### Resume Agent
Generates multiple ATS-optimized resumes (e.g. CRM Resume, Product Resume, Marketing Resume, Growth Resume, Project Manager Resume).

Rules:
- Never invent experience.
- Never fake achievements.
- Only optimize wording.
- Highlight the most relevant experience.
- Optimize keyword density naturally.

### Cover Letter Agent
Generates unique cover letters that understand company, product, industry, role, and culture. Never generic content.

### ATS Optimization
Analyzes missing keywords, keyword density, ATS readability, formatting, and skills alignment. Generates improvement suggestions.

### Questionnaire Agent
Answers application questions automatically (e.g. "Why should we hire you?", expected salary, notice period, years of experience, visa sponsorship, work authorization) — always based on the user's profile.

### Portfolio Agent
Reorders projects dynamically depending on the target role:
- **CRM Role** → CRM Dashboard → Marketing Analytics → Lifecycle Automation
- **Product Role** → Case Studies → Roadmaps → Product Discovery
- **Engineering Role** → GitHub → Architecture → Open Source

### Application Tracker
Pipeline: New Jobs → Interested → Ready → Applied → Viewed → Recruiter Contact → Interview → Technical Test → Offer → Rejected → Archived. Every activity must have history.

### Interview Copilot
When an interview is scheduled, generates: Company Summary, Product Overview, Recent News, Competitors, Company Culture, STAR Stories, Behavioral Questions, Technical Questions, Salary Insights, and Questions to Ask Recruiters.

### AI Career Insights
Analyzes thousands of jobs to recommend: missing skills, trending technologies, high-demand certifications, career gaps, and salary trends.

### Daily Briefing
Example:
> Good morning. Found 28 new jobs. 11 jobs above 90% match. 2 recruiters viewed your applications. Interview tomorrow at 10:00. HubSpot demand increased this week. Recommended learning: Google Analytics Certification.

---

## AI Agents

Modular architecture — each agent has one responsibility:

- Discovery Agent
- Match Agent
- Resume Agent
- ATS Agent
- Cover Letter Agent
- Questionnaire Agent
- Form Filling Agent
- Apply Agent
- Tracker Agent
- Interview Agent
- Analytics Agent
- Learning Agent
- Notification Agent

Agents communicate through shared services. Each agent should be independently replaceable.

---

## User Workflow

```
Create Profile
  ↓
Upload Resume
  ↓
Connect LinkedIn
  ↓
Connect GitHub
  ↓
Connect Portfolio
  ↓
AI builds knowledge profile
  ↓
AI discovers jobs
  ↓
AI analyzes compatibility
  ↓
AI generates optimized application
  ↓
Approval Queue
  ↓
Submit
  ↓
Track
  ↓
Interview Preparation
  ↓
Offer
```

---

## AI Principles

The AI must:
- Explain every recommendation.
- Never hallucinate.
- Never fabricate experience.
- Always cite why a recommendation exists.
- Always allow user override.
- Think before acting.

---

## Tech Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui (base components only)
- Framer Motion
- TanStack Query
- React Hook Form
- Zod

### Backend
- Next.js Route Handlers
- tRPC (optional)
- Prisma ORM
- PostgreSQL
- Better Auth

### AI Layer
Supports multiple providers — OpenAI, Claude, Gemini — with architecture designed for future providers.

### Automation
- Playwright
- Browser Automation
- Background Workers

### Queue
- Trigger.dev
- Redis (optional)

### Database (PostgreSQL)
Main tables: Users, Profiles, Experiences, Projects, Skills, Jobs, Companies, Applications, Resumes, CoverLetters, Interviews, Activities, AIInsights, Notifications.

### File Storage
Supabase Storage — stores Resumes, Cover Letters, Portfolio files, Certificates, Generated PDFs.

### Deployment
- Frontend → Vercel
- Database → Supabase PostgreSQL
- Storage → Supabase
- Background Jobs → Trigger.dev

---

## UI / UX Direction

**Theme:** Modern Neubrutalism
**Inspired by:** Linear, Raycast, Arc Browser, Vercel, Framer, Notion
**Not inspired by:** traditional HR systems

The interface should feel playful, premium, modern, and energetic.

### Design Principles
- Large Typography
- Heavy Borders
- Strong Shadows
- Rounded Corners
- High Contrast
- Minimal Color Palette
- Micro Animations
- Fast Interaction
- Lots of White Space
- Dark Mode First
- Every component should feel tactile.

### Color Palette
- Background — Warm Off White
- Cards — Pure White
- Border — Black
- Blue → Jobs
- Purple → AI
- Yellow → Mission
- Green → Interview
- Orange → Warnings
- Red → Rejections

Do not overuse gradients.

### Dashboard
The dashboard should feel alive. Instead of charts everywhere, prioritize:
- AI Activity Feed
- Today's Missions
- Job Opportunities
- Resume Status
- Interview Timeline
- Application Pipeline
- Career Insights
- Learning Recommendations

Everything should look like an AI assistant is actively working.

### Sidebar
Dashboard · Discover · Mission · Applications · Companies · Resume · Cover Letter · Analytics · AI Insights · Settings

Simple. Icon-first. Neubrutalist.

### Cards
Every card should have: bold border, drop shadow, hover lift animation, click press animation, rounded corners, minimal text, large numbers, friendly icons.

### Motion
Avoid excessive animations. Use subtle movement — cards slightly lift on hover, buttons press down when clicked. Loading should use skeletons; avoid traditional spinners whenever possible.

### AI Personality
The AI should sound like a smart career partner, e.g.:
- "I found three roles worth your attention."
- "This company strongly matches your CRM experience."
- "I optimized your resume for ATS."
- "I recommend applying today."

Avoid robotic system messages.

---

## Engineering Principles

- Keep the codebase modular.
- Prefer composition over duplication.
- Write reusable components.
- Use Server Components whenever appropriate.
- Follow clean architecture.
- Strict TypeScript.
- Accessibility first.
- Responsive by default.
- Performance matters.
- No unnecessary dependencies.
- Keep everything scalable.

---

## Long-Term Vision

HireCopilot should become a complete AI Career Operating System.

**Future roadmap:**
- AI Interview Simulator
- Salary Negotiation Coach
- Referral Finder
- Networking Assistant
- Chrome Extension
- Browser Agent
- Email Integration
- Calendar Integration
- Recruiter CRM
- Mobile App
- Voice Assistant
- Multi-language Support
