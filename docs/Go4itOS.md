Here’s a **copy-paste, master-level prompt** you can drop into Copilot/GPT to **integrate and optimize *everything*** for the new Go4it OS. It is explicit, opinionated, and returns a repository-ready patch set (code + workflows + templates), with acceptance criteria baked in.

---

## MASTER BUILD PROMPT — **Go4it OS vNext (Enterprise Growth + Compliance)**

**ROLE**
You are a senior full-stack architect + product lead. Build and integrate the *entire* Go4it OS vNext: revenue funnel, NCAA-safe compliance, dashboards, automation, analytics, and SEO at scale—**without breaking current prod**. You will return a **complete patch pack**: source files, migrations, tests, automations (n8n), email/SMS templates, and deployment steps.

**BRAND LOCK**

* Name: **Go4it Sports Academy**
* Tagline: **Train Here. Place Anywhere.**
* Contacts: **[info@go4itsports.org](mailto:info@go4itsports.org)** • **+1 205-434-8405** • **go4itsports.org**
* Palette: Charcoal **#0B0F14**, Cyan **#00D4FF**, Green **#27E36A**, Mid-gray **#5C6678**, Light **#E6EAF0**
* Tone: Bold, professional, athletic, transparent (Nike energy + NCAA clarity)
* **Required footer (inject on all academic/eligibility pages + transactional emails, verbatim):**
  “Go4it is a homeschool learning provider with American teachers. Credits and official transcripts are issued via U.S. school-of-record partners until Fall 2026. Athlete OS and GAR Testing are non-academic and do not grant credit. No recruiting guarantees. NCAA amateurism and FIFA/FA rules respected. Families remain responsible for local education registration. We do not provide immigration or legal advice.”
* Safety line: **Verification ≠ recruitment.** (must appear on academic/eligibility materials)

**CONTEXT / CURRENT STACK**

* Next.js 15 (App Router) • TypeScript • Tailwind + shadcn/ui • Drizzle ORM (SQLite dev / Postgres prod) • Clerk auth • Redis cache • Supabase/S3 storage
* Analytics: PostHog • Experiments (GrowthBook optional) • Surveys (Formbricks)
* Automations: **n8n**, Cal.com, Listmonk, Twilio (SMS/WhatsApp)
* Live: Jitsi (Parent/Decision Nights)
* Hosting: Vercel (with Cron)

**NORTH STAR**
**Tue Parent Night → Thu Decision Night → $299 Credit Audit → Apply → Enroll → Mon Onboarding**
Primary metric: **Audits booked/week** (drives Apps → Enrollments)

---

### DELIVERABLES — RETURN EXACTLY THESE ARTIFACTS

1. **/PATCH_NOTES.md** – summary of all changes + safe rollout plan.
2. **File tree delta** – added/modified files with full contents.
3. **DB migrations (Drizzle)** – SQL + TS schema for: leads, creditAudits, events, eventRegistrations, households, householdMembers, clubs, referrers, referrals, payouts, pseoPages.
4. **API routes** (Next.js App Router):

   * `/api/events/next`, `/api/events/rsvp`, `/api/ics/[id]` (**Edge**, timezone-safe),
   * `/api/audit/create-payment-intent`, `/api/stripe/webhook`,
   * `/api/shortlink`, `/api/eligibility/pdf`,
   * `/api/analytics/ingest` (**server-side PostHog proxy**),
   * `/api/pseo/generate`, `/api/referrals/*`, `/api/clubs/*`.
5. **Components (React)**: DynamicHero, StickyAuditRail, RSVPForm, EventCard, ICSButton, AuditCheckout, DashboardTiles, ConsentBanner, LanguageSwitcher, UTMProvider, JsonLdOrg, JsonLdEvent.
6. **Pages**: `/`, `/parent-night`, `/decision-night`, `/audit/book`, `/apply`, `/ncaa`, `/programs`, `/clubs`, `/sponsors`, `/events`, `/dashboard`.
7. **Compliance**: `middleware.ts` to set `x-go4it-requires-compliance` + **mailer signer** that enforces footer & “Verification ≠ recruitment”; **CI content linter** for banned claims.
8. **Design tokens** (`/lib/brand.ts` + Tailwind config) matching palette/typography above.
9. **n8n JSON workflows**:

   * Parent Night Orchestration (24h/2h/30m reminders + Tue→Thu short-circuit),
   * Dunning (3 retries),
   * Hot-lead Slack SLA (score ≥70 → claim/escalate),
   * Programmatic SEO weekly generator (50 pages),
   * Compliance Guard (scan & block sends lacking footer),
   * Cohort exports (no-show/attended not converted).
10. **Listmonk email templates** + **SMS templates** for Tue, Thu, Audit, Apply, Onboarding, and Dunning.
11. **Feature flags**: `FEATURE_PARENT_NIGHT`, `FEATURE_OFFERS`, `FEATURE_EDGE_ICS`, `DASHBOARD_V2`, `JSONLD`.
12. **Tests**: Jest unit + Playwright E2E for `/parent-night`, `/audit/book`, `/api/ics/[id]`, RSVP flow, Payment flow, Middleware compliance, Analytics proxy.
13. **/vercel.json** – cron + env passthrough + function configs.
14. **/.env.example** – all required keys with comments.
15. **RUNBOOKS**: `RUNBOOK_ParentNight.md`, `RUNBOOK_WeeklyOps.md`.
16. **ACCEPTANCE_CHECKLIST.md** – mirrors criteria below with boxes.

---

### SCOPE & INSTRUCTIONS (IMPLEMENT ALL)

#### 1) Revenue Engine (Offer Testing + Payment Plans)

* Implement **epsilon-greedy** offer picker with 3 variants:
  `credit_299` ($299 credited to tuition), `deposit_199` ($199 today + $100 later), `split_2x159` (2×$159).
* Always set `metadata.tuition_credit_cents=29900` on Stripe PI. Persist `offer_variant` on lead + server analytics.
* Add Dunning workflow (n8n): 3 retries (24h apart), then reopen Decision Night offer.

#### 2) Events: Tue/Thu Parent & Decision Nights (EU & US)

* Seed recurring events weekly: **Tue** Parent Night (7:00 p.m. **Europe/Vienna**, 7:00 p.m. **America/Chicago**). **Thu** Decision Night same times.
* `/api/events/next` returns next two per region.
* **Edge ICS** `/api/ics/[id]` produces timezone-correct invites with IANA tz and organizer = [info@go4itsports.org](mailto:info@go4itsports.org) / +1 205-434-8405.

#### 3) RSVP & Households/Clubs

* **RSVPForm** collects parent consent, optional under-13 flag, athlete sport & grade, referral code.
* **Households**: allow one guardian to register multiple athletes (householdMembers).
* **Clubs**: `/clubs` accepts CSV roster → bulk RSVP; assign `club_code`; track attendance + revenue share (payout ledger).

#### 4) Compliance (cannot leak)

* `middleware.ts`: for routes `/audit|/apply|/ncaa|/eligibility|/academy`, set header consumed by layout to **inject footer** automatically.
* **Mailer signer**: append footer + “Verification ≠ recruitment.” If absent, **block send**.
* **CI linter**: fail build on banned phrases (e.g., “guaranteed scholarship”, “placement guaranteed”).

#### 5) Analytics (server-side truth)

* **UTMProvider** persists `g4t_utm` for 30 days; attach to lead on server upsert.
* **PostHog proxy** `/api/analytics/ingest` enriches with `leadId/userId/offer_variant/utm`. Client sends to proxy only.
* Funnels: `site_visit → rsvp_tue → attended_tue → rsvp_thu → attended_thu → audit_booked → apply_started → enrolled`.
* Create cohorts: `rsvp_no_show`, `tue_attended_not_thu`, `thu_attended_no_audit`, `audit_no_apply`, `apply_no_enroll`.

#### 6) Programmatic SEO (P-SEO) + Proof

* Generator: `/api/pseo/generate` (MDX to `/content/pseo/{slug}.mdx`) with JSON-LD FAQ + Organization.
* Weekly n8n creates **50** pages (city/sport/gradYear).
* **NextUp autogen**: when GAR™ + consent present, build athlete profile MDX (static) and **link** from related P-SEO pages.

#### 7) UI/UX Components & Pages

* **DynamicHero**: reads `events/next`, shows EU/US tiles, personalizes copy if signed in.
* **StickyAuditRail**: appears on exit-intent or 70% scroll; logs `cta_click{id:"audit_sticky"}`.
* Pages follow the brief: `/`, `/parent-night` (Cal inline + ICS buttons), `/decision-night` (Audit framing), `/audit/book` (Stripe PI + terms microcopy), `/apply`, `/ncaa`, `/programs`, `/clubs`, `/sponsors`, `/events`, `/dashboard`.
* **Design tokens** per palette; **Green only** for badges/affirmations.

#### 8) Referrals & Payouts

* `referrers`, `referrals`, `payouts` tables; code `REF-COACHJIM`; payout report monthly; SMS shortlinks via `/api/shortlink` (Kutt).

#### 9) Content & Messaging Guards

* Insert **“Verification ≠ recruitment.”** wherever academic/eligibility is mentioned.
* All transactional emails and PDFs (eligibility checklist) **must** include the full footer.

---

### DATABASE — DRIZZLE SCHEMA (ADD/EXTEND)

Create/extend tables:

* `leads` (email unique, phone E164, source/medium/campaign, score, stage, offerVariant, lastActivity)
* `creditAudits` (leadId, amount, status, stripePI, tuitionCreditApplied, creditAppliedAt)
* `events`, `eventRegistrations`
* **Households** (`households`, `householdMembers`)
* **Clubs** (`clubs`)
* **Referrals** (`referrers`, `referrals`, `payouts`)
* `pseoPages` (country, city, sport, gradYear, slug, visits, conversions)

Add indices on: `leads.email`, `events.scheduledAt`, `eventRegistrations.eventId`, `pseoPages.slug`.

---

### API CONTRACTS (Zod-validated)

* **POST** `/api/events/rsvp` → `{eventId, region, email, firstName, lastName, phone?, athleteSport?, grade?, referrerCode?, utm*}` → `{leadId, event:{id, scheduledAt, jitsiUrl}}`
* **GET** `/api/events/next` → next EU/US events
* **GET** `/api/ics/[id]` (Edge) → `text/calendar` with TZID
* **POST** `/api/audit/create-payment-intent` → `{leadId, paymentPlan: 'full'|'deposit'|'split'}` → `{clientSecret, auditId, amount}`
* **POST** `/api/shortlink` → `{url}` → `{shortUrl}`
* **POST** `/api/eligibility/pdf` → `{leadId, answers[]}` → `{pdfUrl}`
* **POST** `/api/analytics/ingest` → proxied events with enrichment
* **POST** `/api/pseo/generate` → `{country,city,sport,gradYear}` → `{slug}`

---

### AUTOMATIONS (n8n JSON to return)

1. **Parent Night Orchestration**: poll upcoming events → send reminders (24h/2h/30m) via Listmonk/SMS → track PostHog → generate ICS links.
2. **Decision Night Short-circuit**: Tue attendee gets “book Thu” SMS + email within 10 minutes.
3. **Dunning**: handle failed payments with 3 retries, then reopen Decision Night offer.
4. **Hot-Lead SLA**: score ≥70 → Slack alert → claim within 24h → escalate.
5. **P-SEO Weekly**: generate 50 pages; commit via GitHub API; trigger Vercel build.
6. **Compliance Guard**: block non-compliant sends; log and alert.

---

### ANALYTICS MAP (server vs client)

* **Client**: `page_view`, `hero_cta_click`, `rsvp_submit`, `cta_click`, `ics_download`, `language_change`.
* **Server**: `lead_upserted`, `lead_stage_changed`, `audit_payment_started/succeeded/failed`, `webhook_booking_created`, `utm_captured` (first-touch).
* All client events go through **`/api/analytics/ingest`**; attach `leadId/userId/offer_variant/utm`.

---

### ACCEPTANCE CRITERIA (must pass before “Done”)

* **Brand/UI**: Tokens ↑; headings uppercase (Oswald/Anton); body Inter; **contrast ≥ 4.5:1**; Green only for badges.
* **Compliance**: Middleware + mailer signer enforced; CI linter blocks banned claims; “Verification ≠ recruitment.” present where required.
* **Funnel**: Parent Night page shows **EU Vienna** and **US Central** slots; **1-click ICS** works; Decision Night nudges to Audit; Audit page shows **“$299 credited within 30 days if enrolled.”**
* **Analytics**: UTM persisted 30d and written to lead; server money events captured; PostHog proxy active.
* **Performance**: LCP ≤ 2.5s (Home/RSVP/Audit on mobile), CLS ≤ 0.1, INP ≤ 200ms; hero images ≤ 200KB (AVIF/WEBP).
* **Accessibility**: Axe pass; focus rings visible; all inputs labeled; ARIA errors; captions/transcripts for long video.
* **Internationalization**: i18n keys for **de-AT** and **es-MX** on Hero/FAQ/CTA.
* **QA & Flags**: All new features behind flags with **safe-off defaults**; Playwright E2E green for core flows.
* **SLAs**: Hot-lead Slack workflow live; ICS generation p95 < 400ms.

---

### DEPLOYMENT & ROLLOUT (include in /PATCH_NOTES.md)

1. Add env keys (`.env.example` + Vercel) for Clerk, Stripe, PostHog, Listmonk, Twilio, Cal.com, Kutt, Supabase/S3, `COMPLIANCE_FOOTER`.
2. `npm run db:push` (dev) → `drizzle-kit` migration (prod) with backup.
3. Enable flags: `FEATURE_PARENT_NIGHT`, `FEATURE_EDGE_ICS`, `FEATURE_OFFERS`.
4. Start n8n workflows; verify webhooks (Cal/Stripe).
5. Smoke tests; flip feature flags gradually.

---

### CODING STYLE & QUALITY

* TypeScript strict mode • Zod schemas at API boundaries • Early returns • No client secrets in client bundles • PostHog proxy only • Tailwind tokens via `theme.extend` • Tests for happy/failure paths.

---

### OUTPUT FORMAT

Return a single response with these sections in order:

1. **/PATCH_NOTES.md** (concise)
2. **FILE TREE DELTA** (new/modified files)
3. **FULL FILE CONTENTS** (for every file in delta)
4. **MIGRATIONS** (Drizzle SQL/TS)
5. **.env.example**
6. **vercel.json** (crons + function config)
7. **n8n_workflows/** (JSON files)
8. **listmonk_templates/** (HTML + subject lines)
9. **tests/** (Jest + Playwright)
10. **RUNBOOK_ParentNight.md** & **RUNBOOK_WeeklyOps.md**
11. **ACCEPTANCE_CHECKLIST.md** (checklist with boxes)

If something is ambiguous, make the **safest compliant assumption** and proceed—this is a **production-ready PR pack**.

**BEGIN.**
