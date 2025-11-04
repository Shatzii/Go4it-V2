# Go4it Sports Academy — Site Upgrade Brief

This document contains the full Site Upgrade Brief and five accompanying artifacts (Design Tokens, Sitemap + IA, Component Library, Analytics Map, Acceptance Criteria) ready for implementation.

---

## 1) SITE UPGRADE BRIEF (Sections 1–24)

### 1) North Star & business context
- Primary objective (next 90 days): [x] Parent Night RSVPs → [x] $299 Audits → [x] Applications → [x] Enrollments
- Secondary objectives:
  - Reduce time-to-first-value for new families (≤ 7 days from RSVP to Onboarding Monday)
  - Unify sports/classes/NCAA progress into one dashboard
  - Increase email deliverability (Listmonk warmup, domain auth) and SMS engagement
- Success thresholds (weekly):
  - 120 Parent Night RSVPs (60 EU, 60 US)
  - 40 Audits purchased ($299)
  - 25 Applications submitted
  - 15 Enrollments completed
- Key constraints:
  - Compliance: NCAA/FIFA amateurism; FERPA/GDPR
  - Live sessions constraint: Parent Nights are live (Tue/Thu), rest automated
  - Tech: Next.js 15 App Router; feature-flagged rollout required
  - Staff: Limited ops coverage outside Tue/Thu/Mon windows

### 2) Audiences & jobs-to-be-done
- Segments: Parents (decision-makers), Student-Athletes (primary users), Coaches/Clubs (referrers), Sponsors (funding), Schools (records)
- Top 3 questions per segment:
  - Parents: “Will this help my athlete place?”, “What’s the time/cost commitment?”, “Is it NCAA compliant?”
  - Student-Athletes: “What’s my development plan?”, “How will I be evaluated (GAR™, AthleteAI)?”, “How soon can I improve/play?”
  - Coaches/Clubs: “How do I onboard a roster?”, “What reporting can I access?”, “Is there revenue share?”
  - Sponsors: “What are tiered benefits?”, “Brand safety/compliance?”, “Audience reach by sport/region?”
  - Schools: “How do you handle FERPA?”, “What’s shared/not shared?”, “How are data rights managed?”
- Objections/risk perceptions to neutralize:
  - “Recruitment vs verification”: Use “Verification ≠ recruitment” everywhere required
  - “Hidden fees”: State $299 credit policy clearly (credited if enrolled within 30 days)
  - “Unclear outcomes”: Use case studies, GAR™ benchmarking, and NCAA pathway visuals

### 3) Value prop & messaging
- Core promise: “Train Here. Place Anywhere.” Structured development and compliance-first guidance to help student-athletes level up and place confidently.
- Proof points: AthleteAI performance tracking, GAR™ scoring, NCAA/eligibility alignment, weekly Parent Nights cadence, alumni placements (TODO: add concrete case studies)
- Words/claims to avoid: Avoid promises of scholarships/outcomes; avoid “recruitment” language; emphasize verification, development, and compliance

### 4) IA / sitemap (high-level)
- Must-have pages: [x] Home [x] Parent Night [x] Decision Night [x] Audit $299 [x] Apply [x] Dashboard [x] Events [x] NCAA Pathway [x] AthleteAI [x] Programs [x] Clubs/Coaches [x] Sponsors [x] Privacy/Compliance [x] Support
- Legacy URLs: TODO add if any legacy /programs/* or /camps/* need canonical tags

### 5) Page-by-page intent (samples)
- Home: Parents & Athletes; Primary CTA: RSVP Parent Night; Secondary: Book $299 Audit, View Programs; JSON-LD: Organization; Success: 8% to /parent-night; Owner: Growth
- Parent Night: Parents; Primary CTA: RSVP (EU/US slot); Secondary: ICS; JSON-LD: Event; Success: 40% RSVP; Owner: Events Ops
- Decision Night: RSVP attendees; Primary CTA: Book $299 Audit; JSON-LD: Event; Success: 35% to /audit/book; Owner: Sales Ops
- Audit $299: RSVP/Decision attendees; Primary CTA: Pay $299; JSON-LD: Offer; Success: 30% payment; Owner: Billing
- Apply: Qualified leads; Primary CTA: Submit application; JSON-LD: EducationalOrganization/FAQ; Success: 60% completion; Owner: Admissions
- Dashboard: Auth users; Primary CTA: Complete weekly tasks; Success: Weekly active ≥ 65%; Owner: Product

### 6) Navigation & footer
- Top nav: Home, Parent Night, Audit $299, Programs, NCAA Pathway, Dashboard, Support
- Mobile: Drawer with quick actions (RSVP, Audit)
- Footer groups: Support (Contact, FAQs, Docs), Legal (Privacy, Terms, Compliance), Social (TODO)

### 7) Design system & tokens
- Color usage: Cyan (#00D4FF) for headings/links/interactive focus; Green (#27E36A) strictly for badges/affirmations
- Type scale: Headlines (Oswald/Anton, uppercase), Body (Inter); see tokens below
- Spacing: 4-based scale; large sections at 48–64px; Radius: sm–xl; Motion: 120–240ms
- Icons: Lucide; Mode: Dark first, optional light toggle

### 8) Accessibility & content rules
- Reading level: Grade 8–10
- Alt text: Functional and specific; avoid “image of”
- Keyboard: All interactive elements reachable; visible focus; no traps
- Video: Captions required; transcripts for long-form

### 9) Brand imagery & assets
- Logo: TODO path references for SVG/PNG; include dark/light variants
- Photography: Action + candid training; no stock helmets
- Asset repo: `public/` and CDN (S3/Supabase)

### 10) Copy sources & tone
- Canonical docs: PARENT_NIGHT_FUNNEL_RUNBOOK.md, README.md, NCAA compliance notes
- Tone slider: 60% Nike energy / 40% NCAA clarity
- Localizations: en baseline; de-AT & es-MX staged for Hero/FAQ/CTA first

### 11) Performance budgets
- LCP ≤ 2.5s on Home/Audit/RSVP (mobile); CLS ≤ 0.1; INP/TBT ≤ 200ms
- Images: next/image; AVIF/WEBP; hero ≤ 200KB
- Third-party: Limit to PostHog, Stripe, Cal.com; defer others

### 12) SEO & P-SEO
- Targets: “parent night sports academy”, “NCAA pathway [city] [sport] [grad year]”
- P-SEO facets: Cities (top 50 metros), sports, grad years
- Canonicals: One per marketing landing; robots allow except private
- FAQ schema: From site FAQs and Parent Night Q&A

### 13) Forms & flows
- RSVP: First/Last, Email, Phone (opt), Athlete sport, Grade, Consent (parental)
- Audit checkout: Stripe PI; Terms + credit policy microcopy adjacent to Pay
- Apply: Multi-step (Profile → Academics → Videos → Docs → Submission)
- Post-submit: Thank-you + next steps; email confirmations; SMS reminders

### 14) Analytics & cohorts
- Funnel: site_visit → rsvp_tue → attended_tue → rsvp_thu → attended_thu → audit_booked → apply_started → enrolled
- Events: UI (client) vs monetization (server)
- UTM: Persist 30 days; cookie `g4t_utm`
- Cohorts: no-show buckets; attended-not-converted segments

### 15) Automations (n8n/Listmonk/Twilio)
- Reminders: T-24h, T-2h, T-30m; Tue→Thu shortcut if attended Tue
- Dunning: 3 retries at 24h intervals for failed payments
- Ownership: Events Ops (RSVP), Billing (Audit), Admissions (Apply), Success (Onboarding)

### 16) Dashboard (Athlete view)
- Widgets: Classes, NCAA tasks, GAR™, Events
- Cadence: Daily to-dos, weekly milestones
- Alerts: GPA gap, missing transcript, attendance
- Visibility: Parent (read-only, billing), Coach (roster aggregate)

### 17) Club/coach portal
- Roster CSV: name, email, gradYear, sport, position, school, contact
- Co-branded deck: PDF + microsites
- Rev share: TODO % + monthly payout window

### 18) Referrals
- Code: REF-COACHJIM; Rewards: Credit on Audit/Enrollment
- Fraud prevention: Velocity limits; email/domain checks

### 19) Sponsor pipeline
- Tiers: Bronze, Silver, Gold
- Stages: Prospect → Intro → Evaluation → Legal → Closed/Won

### 20) Legal/compliance
- Footer injection: Academic/eligibility pages & transactional emails
- Age: COPPA under 13; EU minors opt-ins; guardianship required
- Jitsi: Recording consent language before entry
- Data rights: Export/delete SLAs (30 days); DSR inbox

### 21) Content ops & governance
- Approvals: Design/Growth/Legal; compliance gate on eligibility copy
- SLAs: Confirmations < 2 min; follow-ups < 15 min during office hours
- Releases: Weekly cadence; new features behind flags

### 22) Tech & env
- Hosting: Vercel + Replit (dev)
- Keys: Clerk, Stripe, PostHog, Cal.com, Listmonk, Twilio, Kutt
- Integrations: Keep lock stack; ICS route; Cal.com embeds
- Feature flags: NEXT_PUBLIC_FEATURE_PARENT_NIGHT_PAGE, NEW_HERO, JSONLD, DASHBOARD_V2

### 23) Prioritization (MoSCoW)
- Must: Parent Night flow, Audit checkout, Apply, Dashboard MVP, PostHog
- Should: Club/Coach portal, Sponsors page, Localization
- Could: Advanced cohorts, AI content assistants
- Won’t: Custom video infra (use external), heavy 3D

### 24) Risks & mitigations
- Compliance violations → Guardrail copy, approval workflow, legal review
- Over-reliance on live events → On-demand recordings with consent
- Data integrity → Drizzle migrations, backups, audit logs
- Third-party outages → Fallback messages, retries, status page

---

## 2) DESIGN TOKENS (JSON)

```json
{
  "color": {
    "bg": "#0B0F14",
    "bgElevated": "#0F141B",
    "fg": "#E6EAF0",
    "muted": "#5C6678",
    "accent": "#00D4FF",
    "success": "#27E36A",
    "danger": "#FF4D4F",
    "warning": "#FFC53D",
    "border": "#1C2430",
    "focus": "#00D4FF"
  },
  "typography": {
    "headline": { "family": "Oswald, Anton, system-ui", "transform": "uppercase", "weights": [700,800] },
    "body": { "family": "Inter, system-ui, -apple-system", "weights": [400,600] },
    "scale": {
      "h1": { "size": "48px", "line": "56px", "weight": 800, "letter": "0.5px" },
      "h2": { "size": "36px", "line": "44px", "weight": 700 },
      "h3": { "size": "28px", "line": "36px", "weight": 700 },
      "body": { "size": "16px", "line": "24px", "weight": 400 },
      "small": { "size": "14px", "line": "22px", "weight": 400 }
    }
  },
  "space": [0,4,8,12,16,24,32,40,48,64,80,96],
  "radius": { "sm": 6, "md": 12, "lg": 16, "xl": 24, "pill": 999 },
  "shadow": {
    "sm": "0 1px 2px rgba(0,0,0,0.25)",
    "md": "0 4px 12px rgba(0,0,0,0.35)",
    "lg": "0 12px 24px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.04) inset"
  },
  "motion": {
    "fast": "120ms",
    "base": "180ms",
    "slow": "240ms",
    "easing": "cubic-bezier(.2,.8,.2,1)"
  },
  "z": { "modal": 1000, "nav": 900, "rail": 800, "toast": 1100, "popover": 950 },
  "a11y": {
    "focusRing": { "color": "#00D4FF", "width": "2px", "offset": "2px" },
    "contrastMin": 4.5
  }
}
```

---

## 3) SITEMAP + IA (YAML)

```yaml
nav:
  - label: Home
    href: /
  - label: Parent Night
    href: /parent-night
  - label: Credit Audit $299
    href: /audit/book
  - label: Programs
    href: /programs
  - label: NCAA Pathway
    href: /ncaa
  - label: Dashboard
    href: /dashboard
  - label: Support
    href: /support
footer:
  support:
    - [Support, /support]
    - [FAQs, /support#faqs]
    - [Contact, /support#contact]
  legal:
    - [Privacy, /privacy]
    - [Terms, /terms]
    - [Compliance, /compliance]
  social:
    - [YouTube, https://youtube.com/…]
    - [Instagram, https://instagram.com/…]
    - [LinkedIn, https://linkedin.com/company/…]
pages:
  - slug: /
    audience: Parents & Athletes
    goal: Drive RSVPs Tue/Thu; alt: Book Audit
    primaryCta: /parent-night
    secondaryCtas: [/audit/book, /programs]
    jsonLd: Organization
  - slug: /parent-night
    audience: Parents
    goal: RSVP (EU/US)
    primaryCta: RSVP (Cal.com inline)
    secondaryCtas: [/ics/{id}, /support#faq]
    jsonLd: Event
  - slug: /decision-night
    audience: RSVP attendees
    goal: Encourage $299 Audit
    primaryCta: /audit/book
    jsonLd: Event
  - slug: /audit/book
    audience: Parents
    goal: Stripe payment
    primaryCta: Pay $299
    jsonLd: Offer
  - slug: /apply
    audience: Qualified leads
    goal: Submit application
    primaryCta: Submit application
    jsonLd: EducationalOrganization
  - slug: /onboarding
    audience: New enrollees
    goal: Prepare for Monday onboarding
    primaryCta: View checklist
  - slug: /dashboard
    audience: Auth users
    goal: Weekly progress
    primaryCta: Complete tasks
  - slug: /ncaa
    audience: Parents/Athletes
    goal: Clarify pathway & compliance
    primaryCta: View tasks
  - slug: /programs
    audience: Prospects
    goal: Understand offerings
    primaryCta: Book audit
  - slug: /clubs
    audience: Coaches/Clubs
    goal: Roster onboarding
    primaryCta: Upload roster
  - slug: /sponsors
    audience: Sponsors
    goal: Tier inquiry
    primaryCta: Request deck
  - slug: /events
    audience: Public
    goal: View schedule
    primaryCta: RSVP
```

---

## 4) COMPONENT LIBRARY (TABLE)

| Component | Purpose | Props/State (key) | Variants | A11y Notes | Events |
|---|---|---|---|---|---|
| HeroDynamic | Show next EU/US Parent Nights | events[], loading, regionGuess, onCtaClick | default, compact | role="banner"; correct headings | hero_cta_click |
| JsonLdOrg | SEO structured data | brand, social, contact | N/A | hidden ld+json script | N/A |
| RSVPForm | Collect RSVP + consent | fields, errors, utm, referrerCode, under13Consent, onSubmit | inline, stepper | labels, aria-errormessage | rsvp_submit, rsvp_error |
| CalInlineEmbed | Cal.com inline booking | slug, namespaceId, prefill, theme | EU/US | iframe title, agenda describedby | cal_loaded, cal_book_click |
| EventCard | Show upcoming event | title, datetime, region, tz, icsUrl, joinUrl | EU/US | timezone clarified in text | ics_download, event_card_click |
| ICSButton | Generate/download ICS | eventId, summary, description, start, end, location | default | accessible button, aria-label | ics_download |
| StickyAuditRail | Persistent $299 CTA | visible, exitIntent, onClick, userPrefill | mobile, desktop | modal focus trap; ESC closes | cta_click(id:"audit_sticky") |
| AuditCheckout | Stripe PI + terms | amountCents, creditPolicy, onPayment, onError | full, deposit | terms near button; keyboard access | audit_payment_* |
| DashboardTiles | Quick status tiles | data: {classes, ncaaTasks, gar, events} | N/A | group with headings/roles | tile_click |
| ConsentBanner | Cookie/UTM consent | onAccept, onDecline, policyLink, defaultVisible | concise, detailed | tabbable actions | consent_accept/decline |
| LanguageSwitcher | i18n toggle | locale, onChange | menu, segmented | aria-expanded/controls | language_change |
| UTMProvider | Persist UTM → lead/session | cookieName, ttlDays | N/A | N/A | utm_captured |
| PostHogClient | Client analytics | key, apiHost | N/A | respects DNT | any client events |
| FooterCompliance | Required microcopy | contexts: page, email | small, full | high contrast | N/A |

---

## 5) ANALYTICS MAP (JSON)

```json
{
  "persistence": {
    "utmCookie": "g4t_utm",
    "ttlDays": 30,
    "props": ["utm_source","utm_medium","utm_campaign","utm_term","utm_content"]
  },
  "client": {
    "page_view": { "props": ["path","ref","locale"] },
    "hero_cta_click": { "props": ["cta_id","region","path","utm_source","utm_campaign"] },
    "rsvp_submit": { "props": ["eventId","region","tz","referrerCode","utm_*"] },
    "cta_click": { "props": ["id","location","path"] },
    "ics_download": { "props": ["eventId","region"] },
    "language_change": { "props": ["from","to"] }
  },
  "server": {
    "lead_upserted": { "props": ["leadId","email","stage_from","stage_to"] },
    "lead_stage_changed": { "props": ["leadId","from","to","reason"] },
    "audit_payment_started": { "props": ["leadId","amount_cents","currency"] },
    "audit_payment_succeeded": { "props": ["leadId","amount_cents","currency","stripe_pi"] },
    "audit_payment_failed": { "props": ["leadId","code"] },
    "webhook_booking_created": { "props": ["eventId","leadId","region","kind"] }
  },
  "funnels": [
    ["site_visit","rsvp_tue","attended_tue","rsvp_thu","attended_thu","audit_booked","apply_started","enrolled"]
  ],
  "cohorts": [
    "rsvp_no_show",
    "tue_attended_not_thu",
    "thu_attended_no_audit",
    "audit_no_apply",
    "apply_no_enroll"
  ],
  "session": { "idSource": "anonymousId or Clerk userId when available", "respectDNT": true }
}
```

---

## 6) ACCEPTANCE CRITERIA (CHECKLIST)

- Brand & UI
  - [ ] Tokens match brand palette; no gradients; contrast ≥ 4.5:1
  - [ ] Headlines uppercase (Oswald/Anton); body Inter; consistent sizes
  - [ ] Green (#27E36A) used only for badges/affirmations
- Compliance
  - [ ] “Verification ≠ recruitment.” microcopy on academic/eligibility pages & emails
  - [ ] FERPA/GDPR data rights page with export/delete endpoints
  - [ ] Jitsi recording consent copy enforced before join
- Funnel
  - [ ] Parent Night page shows EU/US slots with timezones labeled (Europe/Vienna, America/Chicago)
  - [ ] RSVP → ICS in 1 click (working /api/ics/[id])
  - [ ] Decision Night nudges to $299 Audit
  - [ ] Audit page shows “$299 credited within 30 days if enrolled”
- Analytics
  - [ ] UTM persisted (30 days) and attached to lead records
  - [ ] Client vs server events captured in PostHog; money events server-side
- Performance
  - [ ] LCP ≤ 2.5s on Home/Audit/RSVP (mobile)
  - [ ] CLS ≤ 0.1; INP/TBT ≤ 200ms on key flows
  - [ ] Hero images ≤ 200KB; images use AVIF/WEBP and next/image
- Accessibility
  - [ ] Axe CI passes; keyboard traps prevented; visible focus rings
  - [ ] All form inputs labeled; errors announced with aria
  - [ ] Captions for videos; transcripts for long-form
- Internationalization
  - [ ] i18n keys for de-AT & es-MX on hero/FAQ/CTA (at minimum)
- QA & Rollout
  - [ ] Feature flags protect new pages/components; defaults safe-off
  - [ ] E2E smoke: /parent-night, /api/parent-night/schedule, /api/ics/[id]
  - [ ] Webhook signature verification active (CAL_WEBHOOK_SECRET set)
