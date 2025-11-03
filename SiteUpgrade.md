awesome — here’s a **surgical, Next.js-native upgrade plan** that uses your README stack *as-is* (Next 15 App Router, TS, Tailwind, shadcn/ui, Drizzle, Clerk). It swaps in the “All-in-One NCAA Hub” message, adds the student-athlete dashboard primitives (classes + NCAA + GAR + events), and stays reversible via feature flags.

---

# 0) Objectives (no breakage)

* Centralize new copy → render via server components.
* Add **Hub hero** + **All-in-One** section to `/` behind flags.
* Extend dashboard with **Today/My Week** + **NCAA tracker** + **Study Hall** + **GAR panel** using your DB + Clerk RBAC.
* Keep SEO/JSON-LD + compliance footer server-rendered.
* Zero CSS overhaul—Tailwind/shadcn ready.

---

# 1) Feature flags (App Router safe)

**`/lib/flags.ts`**

```ts
export const flags = {
  NEW_HERO: process.env.NEXT_PUBLIC_FEATURE_NEW_HERO === 'true',
  HUB_SECTION: process.env.NEXT_PUBLIC_FEATURE_ALL_IN_ONE_HUB === 'true',
  JSONLD: process.env.NEXT_PUBLIC_FEATURE_JSONLD === 'true',
  DASHBOARD_V2: process.env.NEXT_PUBLIC_FEATURE_DASHBOARD_V2 === 'true'
};
```

**`.env.local` (staging ON, prod OFF initially)**

```
NEXT_PUBLIC_FEATURE_NEW_HERO=true
NEXT_PUBLIC_FEATURE_ALL_IN_ONE_HUB=true
NEXT_PUBLIC_FEATURE_JSONLD=true
NEXT_PUBLIC_FEATURE_DASHBOARD_V2=true
```

---

# 2) Centralize copy (one source of truth)

**`/content/go4it.ts`**

```ts
export const brand = {
  name: "Go4it Sports Academy",
  tagline: "Train Here. Place Anywhere.",
  hubs: "Denver • Vienna • Dallas • Mérida (MX)",
  contact: "invest@go4itsports.org • +1-205-434-4005 • go4itsports.org",
  compliance: "“Go4it is a homeschool learning provider with American teachers. Credits and official transcripts are issued via U.S. school-of-record partners until Fall 2026. Athlete OS and GAR Testing are non-academic and do not grant credit. No recruiting guarantees. NCAA amateurism and FIFA/FA rules respected. Families remain responsible for local education registration. We do not provide immigration or legal advice.”"
};

export const hero = {
  title: "One Hub for NCAA Eligibility, Classes & Verified Development",
  lead: "Stop juggling tools and invoices. Go4it puts NCAA support, class tracking, GAR™ verification, AthleteAI, and showcases in one place—so athletes can study online, train with structure, and compete internationally.",
  ctas: [
    { label: "Apply to Go4it Sports Academy", href: "/apply", id: "apply" },
    { label: "Book 48-Hour Credit Audit", href: "/audit", id: "audit" },
    { label: "See Events & Testing", href: "/events", id: "events" }
  ],
  stats: ["NCAA Pathway Support","Classes + Study Hall Tracking","GAR™ Included (enrolled)"]
};

export const hub = {
  title: "Everything In One Place",
  sub: "Families save time and money when eligibility, academics, and development live together.",
  cols: [
    { title: "NCAA Dashboard", bullets: ["Eligibility Center status","Core-course map","Transcripts & GPA translation","Amateurism safeguards"] },
    { title: "Class & Study Hall Tracking", bullets: ["Online course progress","Weekly checkpoints","Coach/teacher notes"] },
    { title: "Athlete Development", bullets: ["GAR™ cycles","AthleteAI coach & tasks","Events & showcases calendar"] }
  ],
  note: "Verification ≠ recruitment; amateur status protected."
};
```

---

# 3) Home page: drop-in components (no CSS, Tailwind classes only)

**`/components/site/HeroNew.tsx`**

```tsx
import { hero } from "@/content/go4it";
export function HeroNew() {
  return (
    <section id="hero" className="bg-[#0B0F14] text-[#E6EAF0]">
      <div className="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-2">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-[#00D4FF]">{hero.title}</h1>
          <p className="mt-4 text-lg text-[#E6EAF0]/90">{hero.lead}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {hero.ctas.map(c => (
              <a key={c.id} href={c.href} data-cta={c.id}
                 className="btn btn-primary border border-[#00D4FF] text-[#0B0F14] bg-[#00D4FF] px-4 py-2 rounded-2xl">
                {c.label}
              </a>
            ))}
          </div>
          <ul className="mt-6 flex flex-wrap gap-4 text-sm">
            {hero.stats.map(s => (
              <li key={s} className="px-3 py-1 rounded-full border border-[#5C6678]" data-kpi>{s}</li>
            ))}
          </ul>
        </div>
        <div aria-hidden className="rounded-2xl border border-[#5C6678] aspect-video" />
      </div>
    </section>
  );
}
```

**`/components/site/Hub.tsx`**

```tsx
import { hub } from "@/content/go4it";
export function Hub() {
  return (
    <section id="hub" className="bg-[#0B0F14] text-[#E6EAF0]">
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-[#00D4FF]">{hub.title}</h2>
        <p className="mt-2 text-sm text-[#5C6678]">{hub.sub}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {hub.cols.map(col => (
            <article key={col.title} className="rounded-2xl border border-[#5C6678] p-5">
              <h3 className="font-semibold text-[#E6EAF0]">{col.title}</h3>
              <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-[#E6EAF0]/90">
                {col.bullets.map(b => <li key={b}>{b}</li>)}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          <a href="/apply" data-cta="apply" className="px-4 py-2 rounded-2xl border border-[#00D4FF] bg-[#00D4FF] text-[#0B0F14]">Apply</a>
          <a href="/audit" data-cta="audit" className="px-4 py-2 rounded-2xl border border-[#5C6678] text-[#E6EAF0]">48-Hour Credit Audit</a>
        </div>
        <p className="mt-3 text-xs text-[#5C6678]">{hub.note}</p>
      </div>
    </section>
  );
}
```

**`/app/page.tsx`**

```tsx
import { flags } from "@/lib/flags";
import { HeroNew } from "@/components/site/HeroNew";
import { Hub } from "@/components/site/Hub";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      {flags.NEW_HERO ? <HeroNew/> : <LegacyHero/>}
      {flags.HUB_SECTION && <Hub/>}
      {/* keep your existing sections/components below */}
      <Products/>
      <Footer/>
      {flags.JSONLD && <JsonLdBundle/>}
    </>
  );
}
```

---

# 4) Dashboard V2: extend with small, testable modules

### Drizzle schema additions (SQLite→Postgres compatible)

**`/lib/db/schema/academics.ts`**

```ts
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
export const courses = sqliteTable("courses", {
  id: text("id").primaryKey(),
  athleteId: text("athlete_id").notNull(),
  name: text("name").notNull(),
  progress: real("progress").notNull().default(0) // 0..1
});
export const assignments = sqliteTable("assignments", {
  id: text("id").primaryKey(),
  courseId: text("course_id").notNull(),
  title: text("title").notNull(),
  due: text("due"), // ISO date
  status: text("status").notNull().default("due") // due|done|late
});
export const studyHall = sqliteTable("study_hall", {
  id: text("id").primaryKey(),
  athleteId: text("athlete_id").notNull(),
  date: text("date").notNull(),
  minutes: integer("minutes").notNull().default(0),
  notes: text("notes")
});
```

**`/lib/db/schema/ncaa.ts`**

```ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export const ncaaChecklist = sqliteTable("ncaa_checklist", {
  id: text("id").primaryKey(),
  athleteId: text("athlete_id").notNull(),
  key: text("key").notNull(), // ecid|transcripts|translations|gpa|tests|amateur
  label: text("label").notNull(),
  status: text("status").notNull().default("todo"), // todo|in_progress|done|blocked
  due: text("due")
});
export const ncaaEvents = sqliteTable("ncaa_events", {
  id: text("id").primaryKey(),
  athleteId: text("athlete_id").notNull(),
  name: text("name").notNull(),
  ts: text("ts").notNull()
});
```

**`/lib/db/schema/gar.ts`**

```ts
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
export const garScores = sqliteTable("gar_scores", {
  id: text("id").primaryKey(),
  athleteId: text("athlete_id").notNull(),
  score: integer("score").notNull(), // 0..100
  stars: integer("stars").notNull(), // 1..5
  date: text("date").notNull(),
  speed: integer("speed"),
  agility: integer("agility"),
  power: integer("power"),
  cognitive: integer("cognitive"),
  mental: integer("mental")
});
```

Run:

```bash
npm run db:push
```

### API routes (typed, Zod-validated)

**`/lib/validations/study.ts`**

```ts
import { z } from "zod";
export const StudyLog = z.object({
  minutes: z.number().int().min(1).max(240),
  notes: z.string().max(200).optional()
});
```

**`/app/api/study/route.ts`**

```ts
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db/client";
import { studyHall } from "@/lib/db/schema/academics";
import { StudyLog } from "@/lib/validations/study";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  const body = await req.json();
  const parsed = StudyLog.safeParse(body);
  if (!parsed.success) return new Response("Invalid", { status: 400 });

  const date = new Date().toISOString().slice(0,10);
  await db.insert(studyHall).values({
    id: nanoid(), athleteId: userId, date, minutes: parsed.data.minutes, notes: parsed.data.notes
  });
  return Response.json({ ok: true });
}
```

### Dashboard tiles (shadcn/ui friendly)

**`/components/dashboard/Tiles.tsx`**

```tsx
"use client";
import useSWR from "swr";

export function TodayTiles() {
  // fetch from your existing endpoints; placeholders here
  const { data: classes } = useSWR("/api/classes", (u)=>fetch(u).then(r=>r.json()));
  const { data: ncaa } = useSWR("/api/ncaa", (u)=>fetch(u).then(r=>r.json()));
  const { data: gar } = useSWR("/api/gar/latest", (u)=>fetch(u).then(r=>r.json()));

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="rounded-2xl border border-zinc-700 p-4">
        <h3 className="font-semibold">Classes</h3>
        <p className="text-sm opacity-75">On-Track {Math.round((classes?.progress ?? 0)*100)}%</p>
      </div>
      <div className="rounded-2xl border border-zinc-700 p-4">
        <h3 className="font-semibold">NCAA</h3>
        <p className="text-sm opacity-75">{ncaa?.done ?? 0}/{ncaa?.total ?? 0} complete</p>
      </div>
      <div className="rounded-2xl border border-zinc-700 p-4">
        <h3 className="font-semibold">GAR™</h3>
        <p className="text-sm opacity-75">Latest {gar?.score ?? "—"} • ☆{gar?.stars ?? "—"}</p>
      </div>
      <StudyTimer/>
    </div>
  );
}

function StudyTimer() {
  async function log(minutes:number){ await fetch("/api/study",{method:"POST",headers:{'Content-Type':'application/json'},body:JSON.stringify({minutes})}); }
  return (
    <div className="rounded-2xl border border-zinc-700 p-4">
      <h3 className="font-semibold">Study Hall</h3>
      <div className="mt-2 flex gap-2">
        {[30,45,60].map(m=>(
          <button key={m} onClick={()=>log(m)} className="px-3 py-1 rounded-xl border border-cyan-400 text-cyan-400 text-sm">
            +{m}m
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs opacity-70">Log minutes with one tap.</p>
    </div>
  );
}
```

**`/app/dashboard/page.tsx`**

```tsx
import { flags } from "@/lib/flags";
import { TodayTiles } from "@/components/dashboard/Tiles";

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-6">
      {flags.DASHBOARD_V2 ? <TodayTiles/> : <LegacyDashboard/>}
      {/* keep your existing boards below; add NCAA and GAR pages as links */}
    </div>
  );
}
```

---

# 5) JSON-LD bundle (SEO)

**`/components/site/JsonLdBundle.tsx`**

```tsx
export function JsonLdBundle() {
  const graph = {/* Organization + Product + FAQ + SportsEvent (as in prior messages) */};
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />;
}
```

---

# 6) Clerk RBAC (lightweight)

* Add roles via Clerk metadata: `role: "athlete" | "parent" | "coach" | "teacher" | "registrar" | "compliance" | "admin"`.
* Create a guard: **`/lib/auth/requireRole.ts`** returning 403 for disallowed access.
* Use server actions or route handlers to enforce.

---

# 7) Logger + metrics (align with README)

* On `POST /api/study`, log with your enterprise logger + emit a metric: `events.study_minutes_logged`.
* Track CTA clicks on the client with a single handler reading `[data-cta]` and sending to your logger endpoint (you likely already have GA/Sentry/Vercel Analytics—don’t swap stacks).

---

# 8) QA + canary

* **Staging:** flags ON → scan Lighthouse + click path (Apply/Audit/Events), JSON-LD validate, Clerk auth flow ok.
* **Prod:** flip `NEW_HERO=true` first, then `HUB_SECTION`, then `JSONLD`, then `DASHBOARD_V2`.

---

# 9) Commit plan

```
feat: add flags + centralized copy
feat: new hero + hub sections (flagged)
feat(dashboard): study hall API + tiles (flagged)
chore(db): drizzle tables for classes/ncaa/gar
feat(seo): json-ld bundle (flagged)
```

---

If you want, I can refactor these snippets to exactly match your folder names and export a **ready PR diff** (App Router).
