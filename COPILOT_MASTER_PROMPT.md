# 🔧 MASTER PROMPT — Go4it OS (Replit) Full-Stack Upgrade + Automation

**ROLE**
You are a senior full-stack architect + growth operator for **Go4it Sports Academy**. Your job: implement a production-safe, feature-flagged upgrade of our existing **Next.js 15 + TypeScript + Tailwind + Drizzle + Clerk** app deployed on **Replit**, integrating our end-to-end revenue funnel, analytics, automation, and a marketing **screenshot service**. Produce code, config, content, and runnable scripts as **PR-style diffs** that are **idempotent** (safe to run repeatedly).

**GLOBAL BRAND CONSTANTS (lock)**

* Name: **Go4it Sports Academy**
* Tagline: **Train Here. Place Anywhere.**
* Contacts: **[info@go4itsports.org](mailto:info@go4itsports.org)** • **+1 205-434-8405** • **go4itsports.org**
* Palette: Charcoal `#0B0F14`, Cyan `#00D4FF`, Green `#27E36A` (badges only), Mid-gray `#5C6678`, Light `#E6EAF0`
* Type: Headline = Oswald/Anton (ALL CAPS), Body = Inter
* Compliance footer to inject on academic/eligibility surfaces:
  “Go4it is a homeschool learning provider with American teachers. Credits and official transcripts are issued via U.S. school-of-record partners until Fall 2026. Athlete OS and GAR Testing are non-academic and do not grant credit. No recruiting guarantees. NCAA amateurism and FIFA/FA rules respected. Families remain responsible for local education registration. We do not provide immigration or legal advice.”

**NORTH STAR FUNNEL (lock)**
Tue **Parent Night** (EU/US) → Thu **Decision Night** → **$299 Credit Audit** → **Apply** → **Enroll** → **Mon Onboarding**
North-star metric: **$299 Audits booked/week**.

**TECH BASELINE (lock)**

* Next.js 15 App Router, TS, Tailwind, shadcn/ui
* Auth: Clerk
* ORM: Drizzle (SQLite dev, Postgres prod ready)
* Analytics: PostHog
* Email: Listmonk (primary) / Resend (fallback)
* SMS: Twilio (OSS fallback OK)
* Automation: **n8n** (webhooks from app)
* Booking: Cal.com
* Replit hosting; background jobs via `node` scripts + cron-like schedulers (Replit Deploys)
* Storage: Supabase or S3-compatible (if needed)

**DELIVERABLES (return all)**

1. **PR-style file diffs** for all code & content.
2. **/scripts** runnable Node scripts (Replit-safe).
3. **.env.example** additions (no secrets).
4. **SQL/Drizzle** schema diffs for new tables.
5. **n8n** workflow JSON (Parent/Decision Night orchestration; cohort follow-ups).
6. **Listmonk** email templates + SMS copy.
7. **Playwright snapshot service** (desktop+mobile) with `manifest.json` gallery.
8. **PostHog** event map and code hooks.
9. **Feature flags** (env-based) to guard new UI.
10. **Acceptance checklist** (all criteria met).

**DO NOT BREAK**
Existing auth, dashboard routes, or database. New features must be behind flags & additive migrations.

---

## 0) PROJECT SETUP VARIABLES

Use placeholders that we replace via Replit Secrets:

```
APP_URL={{REPL_URL}}
POSTHOG_KEY={{POSTHOG_KEY}}
CLERK_PUBLISHABLE_KEY={{CLERK_PUBLISHABLE_KEY}}
CLERK_SECRET_KEY={{CLERK_SECRET_KEY}}
STRIPE_KEYS={{STRIPE_*}}  // if payments enabled
LISTMONK_URL={{LISTMONK_URL}} LISTMONK_KEY={{LISTMONK_KEY}}
TWILIO_SID={{TWILIO_SID}} TWILIO_TOKEN={{TWILIO_TOKEN}} TWILIO_FROM={{TWILIO_FROM}}
N8N_WEBHOOK={{N8N_WEBHOOK}}
```

---

## 1) DATABASE (Drizzle) — ADDITIVE TABLES

Create additive tables for **leads**, **events**, **eventRegistrations**, **creditAudits**, **referrers/referrals**, **pseoPages** (mirrors the last blueprint). Include columns for UTM (source/medium/campaign/content/term), score, stage, lastActivity. Provide Drizzle SQL & TS models.

---

## 2) PAGES & FLOWS (App Router)

Implement or update (feature-flagged):

* `/parent-night` (EU/US slots with TZ labels; RSVP form + ICS)
* `/decision-night` (for Thu; nudges to Audit)
* `/audit/book` (Stripe PI optional; $299 credit policy microcopy)
* `/apply` (multi-step starter; save-as-you-go)
* `/dashboard` tiles for **Classes / NCAA tasks / GAR / Events** (marketing demo with `?marketing=1`)
* Home hero = **DynamicHero** (auto region, EU & US banners)
* **StickyAuditRail** on marketing pages

All forms capture & persist UTMs (cookie `g4t_utm`, 30 days).

---

## 3) COMPONENTS

Ship or upgrade (as in prior prompts):
`DynamicHero`, `RSVPForm`, `CalInlineEmbed`, `EventCard`, `ICSButton`, `StickyAuditRail`, `AuditCheckout`, `DashboardTiles`, `FooterCompliance`, `UTMProvider`, `PostHogClient`, `LanguageSwitcher`, `ScreenshotWall` (reads manifest).

---

## 4) API ROUTES

* `POST /api/events/rsvp` (lead upsert, registration, score +15, n8n trigger)
* `GET /api/events/next|upcoming` (EU/US)
* `POST /api/audit/create-payment-intent` (optional Stripe)
* `POST /api/leads/score` (server-side scoring + routing)
* `POST /api/shortlink` (Kutt, optional)
* `POST /api/eligibility/pdf` (Checklist PDF with compliance footer)
* `POST /api/webhooks/cal` (Cal.com bookings)
* `POST /api/webhooks/stripe` (stage updates)

---

## 5) ANALYTICS (PostHog)

Wire client + server events per the map:
`page_view, hero_cta_click, rsvp_submit, rsvp_error, ics_download, cta_click(audit_sticky), audit_payment_*`…
Identify with Clerk userId if present; otherwise anonymousId. Respect DNT.

---

## 6) AUTOMATIONS (n8n + Listmonk + Twilio)

Return **n8n JSON** flows for:

* **Parent Night Orchestration** (24h/2h/30m reminders; EU & US)
* **Decision Night Short-circuit** (Tue→Thu fast track)
* **Cohorts**: `rsvp_no_show`, `tue_attended_not_thu`, `thu_attended_no_audit`, `audit_no_apply` with email+SMS sequences.
* **Dunning** (if Stripe enabled).
  Provide **Listmonk** email HTML and SMS text.

---

## 7) **NEW: Playwright Snapshot Service** (Marketing Screens)

Add a Replit-friendly, headless **Chromium** script:

* Targets: `/`, `/parent-night`, `/audit/book`, `/programs`, `/ncaa`, `/dashboard?marketing=1`, `/studio?marketing=1`
* Captures **desktop (1440×900)** and **mobile (iPhone 13)**
* Hides PII with `[data-private]`, Clerk widgets, iframes.
* Writes PNGs to `/public/snapshots` + `manifest.json`.
* Landing page renders gallery via `<ScreenshotWall />`.

**Packages & scripts**
`npm i -D playwright tsx` and `npx playwright install chromium`
`"snapshots": "node --loader tsx ./scripts/snapshots.ts"`

---

## 8) PROGRAMMATIC SEO (P-SEO)

* `/content/pseo/{slug}.mdx` generator (MDX); JSON-LD `FAQPage` & `SportsOrganization`
* `app/api/pseo/generate` to write pages (dev-only)
* Weekly script `npm run pseo:weekly` that posts 50 MDX from CSV.

---

## 9) ACCESSIBILITY & PERFORMANCE

* Contrast ≥ 4.5:1, visible focus rings, labelled inputs, aria-errors
* LCP ≤ 2.5s on Home/RSVP/Audit; images AVIF/WEBP; `next/image`
* Axe CI passes (dev script)

---

## 10) REPLIT DEPLOYMENT

* Use `start` to boot Next.js; background jobs via `npm run` scripts
* Add “cron” behavior with Replit Deploys Schedule for:
  `lead-scoring` (02:00), `event-reminders` (*/5), `pseo-weekly` (Mon 02:00), `snapshots` (daily 03:00)

---

## 11) ACCEPTANCE CRITERIA (must pass)

* Feature flags guard new UI; legacy flows untouched
* Parent Night shows **both** regions w/ explicit TZ labels
* RSVP → ICS in one click; UTMs persisted and attached to lead
* `$299 Credit Audit` page includes credit policy microcopy
* PostHog events visible; cohorts buildable from events
* Snapshot PNGs + `manifest.json` render on Home via ScreenshotWall
* Compliance footer present on academic/eligibility pages & emails
* All scripts run on Replit without `--no-sandbox` errors
* Drizzle migrations additive; `npm run db:push` succeeds

---

## 12) OUTPUT FORMAT

1. **Plan**: bullet list of changes.
2. **File diffs** (unified) for every file created/modified.
3. **Shell blocks** for installs & scripts.
4. **n8n JSON**, **Listmonk templates**, **PostHog mapping**.
5. **How to run** (commands for Replit).
6. **Roll-back** note (how to disable via flags).

---

# 📦 SUB-PROMPT BUNDLE (run individually as needed)

> Each block is a standalone prompt you can paste to have Copilot/GPT generate that artifact in depth.

**1) Super-Orchestrator (weekly growth)**

```
ROLE: Growth Orchestrator…
[produce content_plan.json, pseo_pages.csv, assets/, cohorts.json, schedule_payload.json, repo_tasks.md]
LOCKED BRAND/CONTACTS/COMPLIANCE…
BEGIN with next week. Return all artifacts now.
```

**2) P-SEO Page Generator (MDX writer)**

```
ROLE: SEO Page Writer (sports + NCAA)…
INPUT: pseo_pages.csv rows…
OUTPUT: /content/pseo/{slug}.mdx with JSON-LD, compliance microcopy…
```

**3) Coach/Club Portal Pack**

```
ROLE: B2B Builder…
OUTPUT: /clubs page (roster CSV upload), bulk RSVP links, referrer codes, co-branded deck outline, payout ledger schema…
```

**4) Lifecycle Follow-ups (Email/SMS)**

```
ROLE: Lifecycle Copywriter…
Sequences: Tue→Thu, Thu→Audit, Audit→Apply/Onboarding, No-show…
Include deadlines, benefits, compliance, alt-text.
```

**5) Landing Page Builder**

```
ROLE: Senior UX Writer+UI Dev…
Deliver a hero with DynamicHero, value props, ScreenshotWall, sticky Audit rail, and JSON-LD Organization…
```

**6) Next.js Refactor (safe)**

```
ROLE: Senior Next.js Engineer…
Refactor marketing routes into (marketing)/, add feature flags, keep zero regressions…
```

**7) Growth Blueprint Integrator**

```
ROLE: Architect…
Apply lead scoring, referral engine, coach portal, sponsor pipeline, cohort automations…
```

**8) $299 Funnel Implementer**

```
ROLE: Payments + Funnel Engineer…
Add creditAudits table, Stripe PI route, rail CTA, analytics events, dunning hooks…
```

**9) Student-Athlete Dashboard**

```
ROLE: Product Engineer…
Dashboard tiles for Classes/NCAA/GAR/Events; marketing demo mode (?marketing=1)…
```

**10) n8n Automation Pack**

```
ROLE: Workflow Automator…
Return JSON for Parent/Decision orchestration, cohorts, dunning; include webhook shapes.
```

**11) PostHog Analytics Mapper**

```
ROLE: Analytics Engineer…
Return code snippets to wire client+server events; cohort definitions; funnel dashboard tiles.
```

**12) 90-Day Social Factory**

```
ROLE: Content Ops…
90-day calendar across parents, athletes, coaches; channel-native copy; UTMs; alt-text; JSON export.
```

**13) Brand Assets for Print/Social**

```
ROLE: Brand Designer…
Text-first flyer, tri-fold, 12-tile carousel (verbatim copy), alt-text, PDFs/PNGs specs.
```

**14) Compliance Guardian**

```
ROLE: Legal-Comms Guard…
Create linter for risky phrases; footer injector; CI script; saved replies for helpdesk.
```

**15) Replit DevOps**

```
ROLE: DevOps…
Scripts for snapshots, pseo-weekly, lead-scoring, event-reminders; Procfile/start; schedules config.
```

**16) NEW — Snapshot Service**

```
ROLE: Frontend Tools Engineer…
Add Playwright-based screenshot generator (desktop+mobile), hide PII, write manifest.json, and ScreenshotWall component to render on Home. Provide install cmds, scripts, and diffs.
```

---

## ▶ HOW TO USE THIS PROMPT

1. Paste the **MASTER PROMPT** into Copilot/GPT.
2. Let it produce the **plan + diffs + scripts**.
3. Apply changes in your Replit workspace.
4. Add secrets in Replit (envs above).
5. Run:

```bash
npm install
npx playwright install chromium
npm run db:push
npm run dev
npm run snapshots
```

6. Verify acceptance checklist, then enable flags.

If you want, I can also compress this into a single **/scripts/setup-master.ts** that runs the installs, migrations, seeds, and generates initial snapshots in one go.
