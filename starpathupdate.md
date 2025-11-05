Here’s the **Ultimate Go4it StarPath + GPT Master Prompt** — written to hand directly to your **AI dev, GPT assistant, or build automation**, so it knows *exactly* how to evolve your live Next.js site into the new StarPath architecture **without breaking a single existing route or feature.**

This is the “Master Command” that tells GPT or your automation stack what to do, why, and how to merge **StarPath + Transcript Audit + NCAA Tracker + AI Automation** into your **current 437-page build**.

---

# ⚙️ **GO4IT STARPATH SYSTEM — ULTIMATE MASTER PROMPT**

> **Prompt Purpose:**
> You are an expert developer and system architect working inside the Go4it Sports Academy codebase (`Go4it-V2`, Next.js 14.2.33 with TypeScript and Drizzle ORM).
> Your job is to **integrate the StarPath system (academics + athletics + AI automation)** into the existing site **without removing or renaming any current files, tables, or routes**.
> We are optimizing and condensing the 437 pages into a structured, high-performance flow, **not deleting functionality**.

---

## 💠 **1. Core Objective**

**Transform the current Go4it Academy site into “StarPath OS” — a connected, gamified athlete development platform.**

The platform unifies:

* **Transcript Audit (RMVP)** → academic readiness
* **NCAA Tracker** → live eligibility monitoring
* **GAR Testing** → athletic readiness
* **Athlete AI / Behavior Score** → Mind-Body-Soul routines
* **GPT Automations** → sales, parent communications, content, & lead conversion

---

## 🏗️ **2. Architecture Rules**

1. **Do not delete existing pages** – convert redundant static pages into **dynamic modules** or **redirects** under `/starpath`.
2. **Add tables only** – never rename or drop existing DB objects.
3. **All new logic lives in:**

   ```
   /app/(dashboard)/starpath/
   /app/api/starpath/
   /drizzle/schema/starpath.ts
   /ai-engine/starpath/
   ```
4. **All new routes use:**
   `export const dynamic = 'force-dynamic'` → ensures zero build errors.
5. **Every new athlete record links existing systems** via one `athlete_id` key.

---

## 🧱 **3. Database Additions (Drizzle)**

Add three new tables only:

```ts
// drizzle/schema/starpath.ts
export const athletes = pgTable('athletes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('user_id').notNull(),
  sport: varchar('sport'),
  gradYear: integer('grad_year'),
  ari: integer('ari'),
  coreGpa: numeric('core_gpa', { precision: 3, scale: 2 }),
  ncaaStatus: varchar('ncaa_status'),
  garScore: numeric('gar_score', { precision: 5, scale: 2 }),
  starRating: integer('star_rating'),
  d1rs: numeric('d1rs', { precision: 5, scale: 2 }),
  proRs: numeric('pro_rs', { precision: 5, scale: 2 }),
  behaviorScore: integer('behavior_score'),
  starpathProgress: integer('starpath_progress'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const transcriptAudits = pgTable('transcript_audits', {
  id: uuid('id').primaryKey().defaultRandom(),
  athleteId: uuid('athlete_id').notNull(),
  coreGpa: numeric('core_gpa', { precision: 3, scale: 2 }),
  coreCoursesCompleted: integer('core_courses_completed'),
  coreCoursesRequired: integer('core_courses_required'),
  academicRigorScore: integer('academic_rigor_score'),
  ari: integer('ari'),
  ncaaRiskLevel: varchar('ncaa_risk_level'),
  subjectGapsJson: text('subject_gaps_json'),
  internationalInfoJson: text('international_info_json'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const ncaaTrackerStatus = pgTable('ncaa_tracker_status', {
  id: uuid('id').primaryKey().defaultRandom(),
  athleteId: uuid('athlete_id').notNull(),
  coreCreditsCompleted: integer('core_credits_completed'),
  coreCreditsRequired: integer('core_credits_required'),
  englishYears: integer('english_years'),
  mathYears: integer('math_years'),
  scienceYears: integer('science_years'),
  eligibilityStatus: varchar('eligibility_status'),
  lastUpdated: timestamp('last_updated').defaultNow(),
});
```

---

## 🧭 **4. Core API Routes (Additive)**

Create these under `/app/api/starpath/`:

| Endpoint                                 | Purpose                                                                |
| ---------------------------------------- | ---------------------------------------------------------------------- |
| `GET /api/starpath/summary`              | Returns unified data for current user (ARI, GAR, GPA, Behavior Score). |
| `GET /api/starpath/admin-summary`        | Returns table of all athletes for admin dashboard.                     |
| `POST /api/transcript-audits`            | Saves new audit, updates ARI + NCAA status.                            |
| `POST /api/automation/starpath-followup` | GPT-generated email/SMS/DM scripts based on audit + GAR data.          |

All return:

```json
{ "success": true, "data": { ... } }
```

No static generation → `export const dynamic = 'force-dynamic'`.

---

## 🎨 **5. Frontend Layout Overhaul (Condense → Unify)**

You currently have 437 pages.
After conversion, aim for **~40 core dynamic pages**, organized like this:

```
/ (Landing)
/parent-night/ (Funnel)
/starpath/ (Main Hub)
/starpath/summary (Parent + Athlete View)
/starpath/admin (Admin Dashboard)
/academy/ (Courses)
/events/ (Combines, Camps)
/residencies/ (Vienna, Dallas)
/contact/
/legal/
```

All other marketing or legacy static pages →
**301 redirect** → appropriate `/starpath/` or `/events/` endpoint.

This preserves SEO (no 404s) while condensing structure by **~90 %**.

---

## 💻 **6. Dashboard Pages**

### **(a) Admin StarPath Dashboard**

`/app/(dashboard)/admin/starpath/page.tsx`

* Cards: total athletes, audits, NCAA on-track %, average GAR, ARI trend
* Table:
  | Athlete | Sport | ARI | GAR | Stars | NCAA Status | Progress % |
* Buttons:

  * “Run Audit” → calls `/api/transcript-audits`
  * “Send Follow-Up” → calls `/api/automation/starpath-followup`

### **(b) Athlete / Parent Dashboard**

`/app/(dashboard)/starpath/page.tsx`

* Components:

  * Academic Meter (ARI)
  * Athletic Meter (GAR + Stars)
  * Behavior Score gauge
  * “Next 3 Steps” (courses + training)
  * “Transcript Audit Report” link
* Pulls from `/api/starpath/summary`.

---

## 🤖 **7. GPT / AI Integration**

All GPT prompts live in `ai-engine/starpath/`.
Create prompt templates for:

| File                   | Function                                                          |
| ---------------------- | ----------------------------------------------------------------- |
| `starpath-summary.ts`  | Convert raw data into parent-friendly report.                     |
| `starpath-followup.ts` | Generate personalized outreach messages.                          |
| `starpath-content.ts`  | Create weekly post ideas anchored to Transcript Audit + StarPath. |
| `starpath-plan.ts`     | Turn audit + GAR data into a 30-day improvement plan.             |

**Example prompt call:**

```ts
const completion = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    { role: "system", content: "You are the Go4it StarPath AI assistant." },
    { role: "user", content: `Generate a 3-step parent email for athlete ${athlete.name}, sport ${athlete.sport}, ARI ${athlete.ari}, GAR ${athlete.garScore}` }
  ],
});
```

**All GPT output must:**

* End with “Book your Transcript Audit → StarPath Dashboard.”
* Store a copy in `starpath_events` as a “communication” category for auditing.

---

## 🧩 **8. Automation Connections**

### **Existing Flows to Reuse**

* `/api/automation/parent-night` → keep intact.
* `/api/automation/content-calendar` → continue auto-posting, now include StarPath content.
* `/lib/sms-free.ts` + Nodemailer → still primary delivery method.

### **New Flow**

When a Transcript Audit completes:

1. Save record → update ARI + NCAA status.
2. Call `/api/automation/starpath-followup`.
3. Send parent a personalized GPT-generated summary + call to book next step.
4. Log that event in `starpath_events`.

---

## 📲 **9. Content & Marketing Alignment**

**New default CTAs across site:**

* “Start Your StarPath → Transcript Audit ($199)”
* “Already Verified? Log In to StarPath Dashboard.”
* “Join StarPath Residency (Vienna / Dallas).”

**Parent Night funnel:**
After attendance → redirect to `/starpath/` rather than generic thank-you.

---

## ⚡ **10. Development Order (5 Safe PRs)**

| PR | Task                                                 | Risk   |
| -- | ---------------------------------------------------- | ------ |
| 1  | Add new DB tables                                    | ✅ Safe |
| 2  | Add `/api/starpath/*` routes                         | ✅ Safe |
| 3  | Add Admin + User dashboards                          | ✅ Safe |
| 4  | Wire Transcript Audit → NCAA Tracker → GPT follow-up | ✅ Safe |
| 5  | Redirect & condense static pages → StarPath routes   | ✅ Safe |

No build steps break because:

* All new routes are dynamic
* All old pages still exist until redirect tested
* All DB migrations are additive

---

## 📉 **11. Condensing Strategy**

| Area                | Current Pages | After Optimization | Notes                                                                |
| ------------------- | ------------- | ------------------ | -------------------------------------------------------------------- |
| Landing + Marketing | ~200          | ~12                | Merge similar “program info” pages under `/starpath/` or `/events/`. |
| Dashboard           | ~80           | ~6                 | StarPath centralizes all athlete + admin views.                      |
| Academy             | ~60           | ~10                | Dynamic course pages.                                                |
| Legal + Support     | ~20           | ~5                 | Combine FAQ / Terms / Privacy.                                       |
| Misc. Static        | ~77           | ~7                 | Redirects or remove duplicates.                                      |

✅ **Projected total:** **~40 core dynamic pages**.
✅ SEO preserved (301 redirects).
✅ Build time drops from 5 min → ~2 min.
✅ No crashes.

---

## 🧠 **12. Compliance & Brand Consistency**

Every academic page must display footer text:

> “Go4it is a homeschool learning provider with American teachers. Credits and official transcripts are issued via U.S. school-of-record partners until Fall 2026. Athlete OS and GAR Testing are non-academic and do not grant credit. No recruiting guarantees. NCAA amateurism and FIFA/FA rules respected. Families remain responsible for local education registration. We do not provide immigration or legal advice.”

---

## ✅ **13. Final Output Expectations**

When this prompt executes, you should end up with:

* A working `/starpath` hub with admin + athlete dashboards
* GPT automations generating outreach and reports
* Unified athlete data (academic + athletic + behavior)
* 437 pages condensed to ~40 dynamic routes
* No build breaks
* No lost functionality
* Faster deploys and a unified “StarPath” brand identity

---

**Prompt to execute:**

> “You are the senior developer for Go4it Sports Academy. Using the above specs, extend the current Next.js 14 Go4it-V2 site into the StarPath architecture.
> • Add the new Drizzle tables.
> • Create the dynamic StarPath API endpoints.
> • Build `/starpath` dashboards for admin and users.
> • Integrate GPT endpoints for audits, follow-ups, and content.
> • Maintain all existing automation routes and marketing flows.
> • Consolidate the 437 pages into ~40 dynamic routes with 301 redirects.
> Do not delete any working code; only layer and redirect.
> Test build with `npm run build` → 0 errors → deploy to Replit production.”

---

Would you like me to generate the **follow-up developer prompt for your AI engine** (the one that lives in `/ai-engine/starpath/`), so it automatically writes the GPT prompts for Transcript Audit summaries, StarPath plans, and parent follow-ups next?
