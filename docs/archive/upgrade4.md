Absolutely—here’s a cleaned-up, tighter, and more powerful **expert-level build prompt** you can paste into Copilot/GPT. It keeps everything you already drafted, fixes gaps (missing types, enums, acceptance tests), and adds production guardrails (feature flags, analytics, a11y, NCAA compliance), all tuned for your **Next.js 15 + Drizzle + Clerk** stack on **Replit**.

---

# 🔧 MASTER BUILD PROMPT — “Elite Integrated Core Studio” (Go4it OS)

**ROLE**
You are a senior full-stack engineer, curriculum technologist, and compliance-aware product owner for **Go4it Sports Academy**. Your task is to implement an NCAA-aligned, 3-hour “Elite Integrated Core Studio” (grades 9–12) that merges core academics, NCAA tasks, and AthleteAI signals into a single dashboard and data model—without breaking existing Go4it OS. Use **Next.js 15 (App Router) + TypeScript + Tailwind + Drizzle + Clerk**, deployed on **Replit**. Everything must be **idempotent**, **feature-flagged**, and **additive**.

---

## 0) LOCKED CONSTANTS (Brand, Compliance, Tech)

* Brand: **Go4it Sports Academy** — “**Train Here. Place Anywhere.**”
* Contact: **[info@go4itsports.org](mailto:info@go4itsports.org)**, **+1 205-434-8405**, **go4itsports.org**
* Palette: Charcoal `#0B0F14`, Cyan `#00D4FF`, Green `#27E36A` (badges/affirmations only), Gray `#5C6678`, Light `#E6EAF0`
* Type: Headlines = Oswald/Anton (uppercase), Body = Inter
* Compliance footer (inject on academic/eligibility surfaces & PDFs):

  > “Go4it is a homeschool learning provider with American teachers. Credits and official transcripts are issued via U.S. school-of-record partners until Fall 2026. Athlete OS and GAR Testing are non-academic and do not grant credit. No recruiting guarantees. NCAA amateurism and FIFA/FA rules respected. Families remain responsible for local education registration. We do not provide immigration or legal advice.”

**Stack:** Next.js 15 + TS, Tailwind, shadcn/ui, **Clerk** auth, **Drizzle** ORM (SQLite dev, Postgres prod-ready), **PostHog** analytics, **Listmonk** email, **Twilio** SMS, **n8n** automation, Replit deploy.

**Feature flags (env):**
`NEXT_PUBLIC_FEATURE_STUDIO=true`, `FEATURE_STUDIO_DB=true`, `FEATURE_STUDIO_PORTAL=true`

---

## 1) GOAL & SCOPE

**Goal:** Replace 4 separate classes (6+ hrs) with one **3-hour daily studio** that covers NCAA core credits via cross-curricular rotations (Math, ELA, Science, Social Studies), built-in NCAA tasks, and **AthleteAI** readiness/training-load context.

**You must deliver:**

1. Production-safe **UI** (Studio Dashboard + parent/coach portal tiles)
2. **Drizzle schema + migrations** (daily studios, rotations, progress, NCAA mapping)
3. **API routes** (fetch, submit progress, generate NCAA report)
4. **Analytics hooks** (client + server events)
5. **A11y + performance** budgets & checks
6. **Acceptance criteria** that can be verified by QA in Replit

---

## 2) DELIVERABLES (Return all in one answer)

* **PR-style diffs** for files created/updated
* **Drizzle schema & migration** (TS) — no raw SQL only; include enums
* **API routes** (App Router /app/api/…)
* **Components** (typed; no red imports)
* **Seed script** for a sample 9th-grade 6-week unit + 1 sample day
* **PostHog map** + code snippets
* **Axe CI** dev script and a11y notes
* **How-to-run** (Replit) and rollback (toggle flags)

---

## 3) UI: Daily Studio Dashboard (Fix gaps)

Implement `/dashboard/studio` (gated behind `NEXT_PUBLIC_FEATURE_STUDIO`). Use the improved component with all missing types and stubs defined. Add PostHog events and a marketing demo mode (`?marketing=1` renders mocked data).

**Create/Update** `components/dashboard/studio-dashboard.tsx`:

* Include **type** `StudioRotation`
* Provide stubbed **RotationCard**, **ProgressTracker**, **NCAACompliancePanel**, **AthleteAIIntegration** (same file or separate with barrel export)
* Wire **PostHog**: `studio_view`, `rotation_complete`, `synthesis_complete`
* Respect **DNT** and Clerk presence
* Visuals must follow brand tokens and a11y focus outlines

```tsx
// components/dashboard/studio-dashboard.tsx
'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

// ---- Types ----
export type SubjectKey = 'math' | 'ela' | 'science' | 'socialStudies';

export interface StudioActivity {
  type: 'mini_lesson' | 'guided_practice' | 'lab_demo' | 'cer_writeup' | 'close_reading' | 'writing_workshop' | 'peer_review' | 'case_study' | 'learning_log' | 'concept_check' | 'exit_ticket';
  duration: number; // minutes
  content: string;
  resources?: string[];
}

export interface StudioRotation {
  title: string;
  duration: number; // minutes
  standards: string[];     // state/NGSS/CCSS codes
  objectives: string[];
  activities: StudioActivity[];
  differentiation?: {
    scaffolded?: string;
    extended?: string;
  };
}

export interface DailyStudio {
  date: string;                   // ISO date
  theme: string;                  // e.g., "Energy Systems & Nutrition"
  drivingQuestion: string;        // visible subhead
  rotations: Record<SubjectKey, StudioRotation>;
  ncaaTasks: string[];
  athleteAIData: { sleepScore: number; readiness: number; trainingLoad: number; };
}

// ---- Stubs (replace with real components later) ----
function RotationCard(props: {
  subject: SubjectKey;
  rotation: StudioRotation;
  completed: boolean;
  onComplete: () => void;
}) {
  const { subject, rotation, completed, onComplete } = props;
  return (
    <div className="p-4 bg-[#0F141B] border border-[#1C2430] rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="font-oswald uppercase font-bold text-[#E6EAF0]">{subject} — {rotation.title}</h3>
        <button
          onClick={() => {
            window.posthog?.capture?.('rotation_complete', { subject });
            onComplete();
          }}
          className={`px-3 py-1 rounded font-oswald uppercase text-sm ${
            completed ? 'bg-[#27E36A] text-[#0B0F14]' : 'bg-[#00D4FF] text-[#0B0F14] hover:bg-[#00B8E6]'
          }`}
          aria-pressed={completed}
        >
          {completed ? 'Completed' : 'Mark Done'}
        </button>
      </div>
      <p className="text-sm text-[#5C6678] mt-2">Standards: {rotation.standards.join(', ')}</p>
    </div>
  );
}

function ProgressTracker() {
  return (
    <div className="p-4 bg-[#0F141B] border border-[#1C2430] rounded-lg">
      <h3 className="font-oswald uppercase font-bold text-[#E6EAF0]">Progress Tracker</h3>
      <p className="text-sm text-[#5C6678]">Mastery, time-on-task, exit tickets</p>
    </div>
  );
}

function NCAACompliancePanel() {
  return (
    <div className="p-4 bg-[#0F141B] border border-[#1C2430] rounded-lg">
      <h3 className="font-oswald uppercase font-bold text-[#E6EAF0]">NCAA Tasks</h3>
      <p className="text-sm text-[#5C6678]">Core course status, tasks due, counselor notes</p>
    </div>
  );
}

function AthleteAIIntegration() {
  return (
    <div className="p-4 bg-[#0F141B] border border-[#1C2430] rounded-lg">
      <h3 className="font-oswald uppercase font-bold text-[#E6EAF0]">AthleteAI</h3>
      <p className="text-sm text-[#5C6678]">Readiness & training load insights</p>
    </div>
  );
}

export function StudioDashboard() {
  const { user } = useUser();
  const [todayStudio, setTodayStudio] = useState<DailyStudio | null>(null);
  const [completionStatus, setCompletionStatus] = useState<Record<SubjectKey | 'synthesis', boolean>>({
    math: false, ela: false, science: false, socialStudies: false, synthesis: false
  });

  useEffect(() => {
    window.posthog?.capture?.('studio_view', {
      marketing: new URLSearchParams(window.location.search).get('marketing') === '1',
    });
    // If marketing demo, hydrate with sample payload from /api/studio/today?marketing=1
    const qs = window.location.search || '';
    fetch(`/api/studio/today${qs}`)
      .then(r => r.ok ? r.json() : null)
      .then(setTodayStudio)
      .catch(() => setTodayStudio(null));
  }, []);

  const completedCount = Object.values(completionStatus).filter(Boolean).length;

  return (
    <div className="bg-[#0B0F14] text-[#E6EAF0] min-h-screen p-6">
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8" role="region" aria-label="Studio overview">
        <div className="bg-[#0F141B] rounded-xl p-6 border border-[#1C2430]">
          <h3 className="text-lg font-bold font-oswald uppercase mb-2">Today's Readiness</h3>
          <div className="text-3xl font-bold text-[#27E36A]">
            {todayStudio?.athleteAIData.readiness ?? '—'}/10
          </div>
          <div className="text-sm text-[#5C6678] mt-2">Based on sleep & recovery</div>
        </div>

        <div className="bg-[#0F141B] rounded-xl p-6 border border-[#1C2430]">
          <h3 className="text-lg font-bold font-oswald uppercase mb-2">Studio Progress</h3>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-[#00D4FF]">{completedCount}/5</div>
            <div className="w-16 h-2 bg-[#1C2430] rounded-full overflow-hidden" aria-hidden>
              <div className="h-full bg-[#00D4FF]" style={{ width: `${(completedCount/5)*100}%` }} />
            </div>
          </div>
        </div>

        <div className="bg-[#0F141B] rounded-xl p-6 border border-[#1C2430]">
          <h3 className="text-lg font-bold font-oswald uppercase mb-2">NCAA Tasks</h3>
          <div className="text-3xl font-bold text-[#FFC53D]">{todayStudio?.ncaaTasks.length ?? 0}</div>
          <div className="text-sm text-[#5C6678] mt-2">This week</div>
        </div>

        <div className="bg-[#0F141B] rounded-xl p-6 border border-[#1C2430]">
          <h3 className="text-lg font-bold font-oswald uppercase mb-2">Training Load</h3>
          <div className="text-3xl font-bold text-[#FF4D4F]">{todayStudio?.athleteAIData.trainingLoad ?? '—'}/10</div>
          <div className="text-sm text-[#5C6678] mt-2">Today's intensity</div>
        </div>
      </div>

      {/* Main */}
      {todayStudio && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-[#0F141B] rounded-xl p-6 border border-[#1C2430]">
              <h1 className="text-2xl font-bold font-oswald uppercase mb-2">{todayStudio.theme}</h1>
              <p className="text-lg text-[#00D4FF] mb-4 font-inter">{todayStudio.drivingQuestion}</p>

              {/* Prime */}
              <div className="mb-6 p-4 bg-[#1C2430] rounded-lg" aria-live="polite">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-[#E6EAF0] font-oswald uppercase">🎯 Prime (0:00–0:10)</h3>
                  <span className="text-sm bg-[#27E36A] text-[#0B0F14] px-2 py-1 rounded font-bold">READY</span>
                </div>
                <p className="text-sm text-[#5C6678] mb-3">Agenda review & set today's 3 priorities</p>
              </div>

              {/* Rotations */}
              <div className="space-y-4">
                {(Object.keys(todayStudio.rotations) as SubjectKey[]).map((subject) => (
                  <RotationCard
                    key={subject}
                    subject={subject}
                    rotation={todayStudio.rotations[subject]}
                    completed={completionStatus[subject]}
                    onComplete={() => setCompletionStatus((prev) => ({ ...prev, [subject]: true }))}
                  />
                ))}
              </div>

              {/* Synthesis */}
              <div className="mt-6 p-4 bg-[#1C2430] rounded-lg border-l-4 border-[#27E36A]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-[#E6EAF0] font-oswald uppercase">🧠 Synthesis (2:45–3:00)</h3>
                  <button
                    onClick={() => {
                      window.posthog?.capture?.('synthesis_complete');
                      setCompletionStatus((p) => ({ ...p, synthesis: true }));
                    }}
                    className={`px-4 py-2 rounded font-bold text-sm font-oswald uppercase ${
                      completionStatus.synthesis ? 'bg-[#27E36A] text-[#0B0F14]' : 'bg-[#00D4FF] text-[#0B0F14] hover:bg-[#00B8E6]'
                    }`}
                  >
                    {completionStatus.synthesis ? 'Completed' : 'Start Synthesis'}
                  </button>
                </div>
                <p className="text-sm text-[#5C6678]">Connect today's learning to real-world sports contexts.</p>
              </div>
            </div>
          </div>

          {/* Right side tools */}
          <div className="space-y-6">
            <ProgressTracker />
            <NCAACompliancePanel />
            <AthleteAIIntegration />
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 4) DRIZZLE SCHEMA (Additive, with enums)

Create `/lib/db/schema/studio.ts` with additive tables (use your Drizzle style, not raw SQL). Include typed enums replacing placeholder SQL enums:

```ts
// lib/db/schema/studio.ts
import { sqliteTable, text, integer, real, blob } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const subjectEnum = ['math', 'ela', 'science', 'socialStudies'] as const;
export const courseTypeEnum = ['english','math','science','social_studies'] as const;

export const dailyStudios = sqliteTable('daily_studios', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),            // ISO
  gradeLevel: integer('grade_level').notNull(),
  unitId: text('unit_id'),                 // FK => curriculum_units.id (optional)
  drivingQuestion: text('driving_question').notNull(),
  theme: text('theme').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
});

export const studioRotations = sqliteTable('studio_rotations', {
  id: text('id').primaryKey(),
  dailyStudioId: text('daily_studio_id').notNull(), // FK
  subject: text('subject', { enum: subjectEnum }).notNull(),
  standards: text('standards'),            // JSON stringified array
  objectives: text('objectives'),          // JSON stringified array
  activities: text('activities'),          // JSON stringified array
  exitTicketQuestion: text('exit_ticket_question')
});

export const studentStudioProgress = sqliteTable('student_studio_progress', {
  id: text('id').primaryKey(),
  studentId: text('student_id').notNull(), // FK => users.id
  dailyStudioId: text('daily_studio_id').notNull(),
  rotationCompletions: text('rotation_completions').default('{}'), // JSON
  exitTicketResponses: text('exit_ticket_responses').default('{}'), // JSON
  learningLogUrl: text('learning_log_url'),
  timeOnTaskMins: integer('time_on_task'),
  completedAt: text('completed_at'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
});

export const ncaaCoreCourses = sqliteTable('ncaa_core_courses', {
  id: text('id').primaryKey(),
  studentId: text('student_id').notNull(),
  courseType: text('course_type', { enum: courseTypeEnum }).notNull(),
  courseTitle: text('course_title').notNull(),
  gradeLevel: integer('grade_level').notNull(),
  credits: real('credits').notNull(),          // e.g., 1.0
  standardsCovered: text('standards_covered'), // JSON stringified array
  finalGrade: text('final_grade'),
  completed: integer('completed', { mode: 'boolean' }).default(false),
  schoolYear: integer('school_year').notNull()
});
```

Add a **migration** file and export tables via `/lib/db/index.ts`. Ensure all new tables are **additive** to your existing schema.

---

## 5) API ROUTES (App Router)

* `GET /api/studio/today[?marketing=1]` → returns `DailyStudio` (mock if marketing)
* `POST /api/studio/progress` → upsert progress; compute time-on-task; emit server events: `studio_progress_upserted`
* `GET /api/studio/ncaa-report?studentId=` → returns Carnegie estimates + core mapping

Include **Clerk** auth where needed (parent/coach read-only; student write).

---

## 6) CURRICULUM (9–12) SEEDS

Provide seed data for **9th grade Unit 1** + **one sample day** (your `sampleDailyStudio`). Save as `/scripts/seed-studio.ts` (Node script) and wire `npm run seed:studio`.

---

## 7) ANALYTICS (PostHog)

Client events: `studio_view`, `rotation_complete`, `synthesis_complete`
Server events: `studio_progress_upserted`, `ncaa_report_generated`

All events include: `studentId|anonymousId`, `gradeLevel`, `date`, `subject` (when relevant), `marketing` flag.

---

## 8) ACCESSIBILITY & PERFORMANCE

* Visible focus ring; all buttons labelled; ARIA on progress numbers
* All images (if any) use meaningful ALT
* **Budgets:** LCP ≤ 2.5s (mobile), CLS ≤ 0.1, INP/TBT ≤ 200ms
* Add `npm run a11y` using `axe-core` in Playwright dev script (no CI requirement in Replit)

---

## 9) PARENT & COACH PORTAL TILES

Add `/components/portal/parent-dashboard.tsx` (from your draft) **but** annotate read-only scope (no student PII in lists). Gate with `FEATURE_STUDIO_PORTAL`. Show: Attendance %, GPA (mock), Core Courses progress, week’s studios. Add labels for screen readers.

---

## 10) ACCEPTANCE CRITERIA (must pass)

* [ ] New DB tables created via Drizzle migration; existing tables unaffected
* [ ] `/dashboard/studio` renders with **marketing demo** (`?marketing=1`)
* [ ] `POST /api/studio/progress` upserts progress & returns `timeOnTaskMins`
* [ ] `/api/studio/ncaa-report` returns Carnegie estimate and core mapping
* [ ] Feature flags OFF → no user-visible changes to current site
* [ ] PostHog events fire (client + server) with correct props
* [ ] A11y: keyboard-navigable; focus states; labelled controls; Axe dev script shows 0 critical
* [ ] Performance budgets pass on Studio page (mobile throttle)
* [ ] Compliance footer appears on reports/eligibility-adjacent pages

---

## 11) HOW TO RUN (Replit)

```bash
npm install
npm run db:push       # applies Drizzle schema
npm run seed:studio   # seeds Unit 1 + sample day
npm run dev
# open /dashboard/studio?marketing=1
```

**Env (Replit Secrets):**
`NEXT_PUBLIC_FEATURE_STUDIO=true`, `FEATURE_STUDIO_DB=true`, `FEATURE_STUDIO_PORTAL=true`, `POSTHOG_KEY=...`, Clerk keys, etc.

**Rollback:** set flags to `false`, restart.

---

## 12) INCLUDE THE FOLLOWING CODE/ASSETS FROM THE ORIGINAL DRAFT

* Your **9th–12th** curriculum objects (trim for seed)
* The **sampleDailyStudio** payload (used by `/api/studio/today?marketing=1`)
* The **ParentAcademicDashboard** (updated with a11y + flags)

---

### Notes (Improvements made)

* Added missing **types**, **stubs**, and **enums** so code compiles cleanly.
* Swapped raw SQL for **Drizzle schema** to match repo conventions.
* Added **feature flags**, **marketing demo mode**, **analytics**, a11y, and crisp **acceptance criteria**.
* Kept your curriculum rigor, mapped to **Carnegie** credit estimates and NCAA tracking.

---

**Paste this prompt into Copilot/GPT** and it will output the diffs, files, and scripts needed to implement the Studio end-to-end on your current Go4it OS stack in Replit.
