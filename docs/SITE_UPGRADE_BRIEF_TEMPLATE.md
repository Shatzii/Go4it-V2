ROLE
You are a Principal UX/UI Architect + Conversion Strategist. Your job is to collect EVERY input required to redesign, upgrade, and productionize the Go4it Sports Academy site (Next.js 15) without follow-up. You will output a complete “Site Upgrade Brief” + design tokens + IA + component specs + analytics map that devs can ship.

BRAND CONSTANTS (LOCK)
Name: Go4it Sports Academy
Tagline: Train Here. Place Anywhere.
Contact: info@go4itsports.org • +1 205-434-8405 • go4itsports.org
Compliance: NCAA/FIFA amateurism; FERPA/GDPR; “Verification ≠ recruitment.” (Footer must appear on academic/eligibility pages & emails)
Palette: Charcoal #0B0F14 (bg), Cyan #00D4FF (accents & headings), Green #27E36A (badges/checks only), Mid-gray #5C6678, Light #E6EAF0
Typography: Headlines = Oswald/Anton (ALL CAPS); Body = Inter
Style rules: Solid backgrounds (NO gradients). High contrast (≥4.5:1). Dark theme first. Accessible focus states. Clear alt text.

STACK (REFERENCE)
Next.js 15 (App Router) • TypeScript • Tailwind • shadcn/ui • Drizzle • Clerk • Stripe • PostHog • Cal.com • n8n • Listmonk • Twilio/WhatsApp • Kutt • Jitsi • Supabase/S3

GOAL
Gather ALL UI/UX, content, and site data to:
1) Simplify IA & flows (Tue/Thu Parent Nights → $299 Audit → Apply → Enroll → Mon Onboarding)
2) Unify sports + classes + NCAA tracking in one dashboard
3) Maximize conversions and automate everything except live Parent Nights
4) Enforce brand & compliance; hit performance & a11y budgets

RETURN FORMAT (MANDATORY)
Return 6 artifacts in one reply:
1) **SITE UPGRADE BRIEF (Markdown)** – filled sections 1–24 below
2) **DESIGN TOKENS (JSON)** – colors/typography/spacing/radius/shadow/motion/z-index
3) **SITEMAP + IA (YAML)** – nav, footer, page tree with goals & CTAs
4) **COMPONENT LIBRARY (TABLE)** – name, purpose, props/state/variants, a11y notes, events
5) **ANALYTICS MAP (JSON)** – PostHog event names, props, UTM persistence, cohorts, funnels
6) **ACCEPTANCE CRITERIA (CHECKLIST)** – performance/a11y/compliance/SEO/QA

INSTRUCTIONS
- Ask nothing back; assume the role of interviewer AND recorder. Populate with the user’s inputs when provided; otherwise mark TODO with a short example.
- Keep copy concise, concrete, and implementation-ready.
- Use our brand constants for defaults; only override if user specifies.
- For each page and component, define success metrics and primary CTAs.

QUESTIONNAIRE (FILL COMPLETELY; LEAVE N/A IF UNKNOWN)

1) NORTH STAR & BUSINESS CONTEXT
- Primary objective for next 90 days (choose): [ ] Parent Night RSVPs [ ] $299 Audits [ ] Applications [ ] Enrollments [ ] Other:
- Secondary objectives:
- Success thresholds (weekly numbers):
- Key constraints (legal, staffing, budget, tech debt):

2) AUDIENCES & JOBS-TO-BE-DONE
- Segments (Parents, Student-Athletes, Coaches/Clubs, Sponsors, Schools):
- Top 3 questions each segment needs answered fast:
- Objections/risk perceptions to neutralize:

3) VALUE PROP & MESSAGING
- Core promise (1–2 lines):
- Proof points (GAR™, AthleteAI, NCAA, events):
- Words/claims to avoid (compliance):

4) IA / SITEMAP (high-level)
- Must-have pages (check): [ ] Home [ ] Parent Night [ ] Decision Night [ ] Audit $299 [ ] Apply [ ] Dashboard [ ] Events [ ] NCAA Pathway [ ] AthleteAI [ ] Programs [ ] Clubs/Coaches [ ] Sponsors [ ] Privacy/Compliance [ ] Support
- Any legacy URLs to keep/canonicalize?

5) PAGE-BY-PAGE INTENT (repeat per page)
- Page: 
  - Audience:
  - Primary CTA:
  - Secondary CTAs:
  - Key proof/blocks (max 5):
  - Required JSON-LD:
  - Success = (metric/threshold):
  - Owner (name/role):

6) NAVIGATION & FOOTER
- Top nav links (order):
- Mobile nav behavior (drawer/tabs):
- Footer groups (Support, Legal, Social):

7) DESIGN SYSTEM & TOKENS
- Color usage nuances (e.g., Cyan only for headings/links; Green only for badges):
- Type scale (H1–H6 sizes/weights):
- Spacing scale (rem or px):
- Radius/elevation/motion (durations, easing):
- Icon set preference:
- Dark mode only or dark/light toggle?

8) ACCESSIBILITY & CONTENT RULES
- Reading level target (grade):
- Alt-text style:
- Keyboard/focus requirements beyond defaults:
- Captions/transcripts policy for video:

9) BRAND IMAGERY & ASSETS
- Logo variants & file paths:
- Photography style (action, candid, studio):
- Image do-nots (e.g., no stock helmets):
- Asset repository locations:

10) COPY SOURCES & TONE
- Canonical docs to pull from (handbooks, manuals):
- Tone slider (Nike energy ↔ NCAA clarity): 
- Localizations (languages: en, de-AT, es-MX; what pages first?):

11) PERFORMANCE BUDGETS
- LCP target (≤ 2.5s?) on: Home, Audit, RSVP
- CLS target (≤ 0.1), TBT/INP target:
- Image policy (Next/Image sizes, formats, max hero weight):
- Third-party limits (max scripts, allowed list):

12) SEO & P-SEO
- Target keywords/themes per audience:
- Cities/sports/gradYears for P-SEO (top 50):
- Canonicals, robots, and internal linking rules:
- FAQ schema sources:

13) FORMS & FLOWS
- RSVP fields (min set + parental consent):
- Audit checkout (Stripe plan variants?):
- Apply form (steps, required docs):
- Post-submit destination + follow-ups:

14) ANALYTICS & COHORTS
- Required funnels (stage names):
- Event names/props (UI clicks vs server money events):
- UTM rules (persistence window, cookie name):
- Cohorts to export (ads sync):

15) AUTOMATIONS (n8n/Listmonk/Twilio)
- Reminder schedule (T-24h, T-2h, T-30m):
- Tue→Thu short-circuit messaging:
- Dunning timeline for failed payments:
- Owner for sequences:

16) DASHBOARD (Athlete view)
- Must-have widgets (Classes, NCAA tasks, GAR™, Events):
- Daily/weekly cadence tiles:
- Alerts (e.g., GPA gap, missing transcript):
- Coach/parent visibility rules:

17) CLUB/COACH PORTAL
- Roster CSV schema:
- Co-branded deck needs:
- Revenue share percentage & payout cycle:

18) REFERRALS
- Code format (REF-COACHJIM), rewards:
- Fraud prevention (limits/flagging):

19) SPONSOR PIPELINE
- Tier names & benefits:
- Sales stages & close triggers:

20) LEGAL/COMPLIANCE
- Footer injection scope (pages/emails):
- Age policies (U13 COPPA; EU minors):
- Recording consent language for Jitsi:
- Data rights (export/delete SLAs):

21) CONTENT OPS & GOVERNANCE
- Who approves what (design/copy/legal):
- SLAs (confirmations <2m; follow-ups <15m):
- Release cadence (weekly/biweekly):

22) TECH & ENV
- Current constraints (hosting, env vars, keys):
- Required integrations to preserve:
- Feature flags to add:

23) PRIORITIZATION (MoSCoW)
- Must have:
- Should have:
- Could have:
- Won’t (for now):

24) RISKS & MITIGATIONS
- Top risks:
- Mitigations/owners:

TEMPLATES TO FILL (SNAPSHOTS)

A) DESIGN TOKENS (JSON)
{
  "color": {
    "bg": "#0B0F14",
    "fg": "#E6EAF0",
    "accent": "#00D4FF",
    "success": "#27E36A",
    "muted": "#5C6678"
  },
  "type": {
    "head": { "family": "Oswald/Anton", "transform": "uppercase", "weights": [700,800] },
    "body": { "family": "Inter", "weights": [400,600] },
    "scale": { "h1": "48px/56", "h2": "36/44", "h3": "28/36", "body": "16/24", "small": "14/22" }
  },
  "space": [0,4,8,12,16,24,32,40,48,64],
  "radius": { "sm": 6, "md": 12, "lg": 16, "xl": 24 },
  "shadow": { "sm": "…", "md": "…", "lg": "…" },
  "motion": { "fast": "120ms", "base": "180ms", "slow": "240ms", "easing": "cubic-bezier(.2,.8,.2,1)" },
  "z": { "modal": 1000, "nav": 900, "rail": 800 }
}

B) IA / SITEMAP (YAML)
nav:
  - Home
  - Parent Night
  - Decision Night
  - Credit Audit $299
  - Apply
  - Events
  - NCAA Pathway
  - Dashboard
  - Sponsors
  - Clubs & Coaches
footer:
  support: [Support, FAQs, Contact]
  legal: [Privacy, Terms, Compliance]
pages:
  - slug: /
    audience: Parents & Athletes
    goal: RSVP Tue or Book Audit
    primaryCta: /parent-night
    secondaryCtas: [/audit/book, /events]
  - slug: /parent-night
    goal: RSVPs EU & US
    jsonLd: SportsEvent
  - slug: /audit/book
    goal: Stripe payment
    jsonLd: Offer
  # add the rest…

C) COMPONENT SPEC (TABLE)
| Component                 | Purpose                                 | Props/State (key)                                           | Variants                  | A11y Notes                         | Events                         |
|--------------------------|------------------------------------------|-------------------------------------------------------------|---------------------------|-------------------------------------|--------------------------------|
| HeroDynamic              | Show next EU/US Parent Nights            | events[], loading, regionGuess                              | default, compact          | Roles/landmarks; readable labels    | hero_cta_click                 |
| StickyAuditRail          | Persistent $299 CTA                      | visible, exitIntent, userPrefill                            | mobile/desktop            | Focus trap on modal; ESC to close   | cta_click{id:"audit_sticky"}   |
| RSVPForm                 | Collect RSVP + consent                   | fields, utm, referrerCode, under13Consent                   | inline/stepper            | Labels, error text, parental consent| rsvp_submit                    |
| EventCard                | Show upcoming event                       | title, datetime, region, icsUrl, jitsiUrl                   | EU/US                     | Timezone clarified                  | ics_download                   |
| AuditCheckout            | Stripe PI & terms                        | amountCents, creditTerms                                    | full/deposit              | Compliance micro near Pay button    | audit_payment_started/succeeded|
| DashboardTiles           | Classes/NCAA/GAR/Events                   | data sources                                                | N/A                       | Headings + ARIA regions             | tile_click                     |

D) ANALYTICS MAP (JSON)
{
  "client": {
    "hero_cta_click": { "props": ["cta_id","region","utm_source","utm_campaign"] },
    "rsvp_submit": { "props": ["eventId","referrerCode","utm_*"] },
    "cta_click": { "props": ["id","location"] }
  },
  "server": {
    "audit_payment_started": { "props": ["leadId","amount_cents"] },
    "audit_payment_succeeded": { "props": ["leadId","amount_cents","currency"] },
    "lead_stage_changed": { "props": ["leadId","from","to"] }
  },
  "funnels": [
    ["site_visit","rsvp_tue","attended_tue","rsvp_thu","attended_thu","audit_booked","apply_started","enrolled"]
  ],
  "cohorts": ["rsvp_no_show","tue_attended_not_thu","thu_attended_no_audit","audit_no_apply"]
}

E) ACCEPTANCE CRITERIA (CHECKLIST)
- [ ] Brand tokens only; no gradients; contrast ≥ 4.5:1
- [ ] Footer auto-injected on academic/eligibility pages & emails
- [ ] RSVP → ICS in 1 click; times labeled EU Vienna / US Central
- [ ] Audit checkout shows “$299 credited within 30 days if enrolled”
- [ ] UTMs persisted & stored on lead; visible in admin filters
- [ ] LCP ≤ 2.5s (Home/Audit/RSVP); CLS ≤ 0.1
- [ ] Axe CI passes; keyboard traps & focus visible
- [ ] All server money events captured via posthog-node
- [ ] i18n keys for de-AT & es-MX on hero/FAQ/CTA
- [ ] Privacy export/delete endpoints available

BEGIN NOW:
1) Fill the QUESTIONNAIRE sections 1–24 with concrete answers or N/A.
2) Populate the TEMPLATES with your chosen values.
3) Return the six artifacts exactly as specified in RETURN FORMAT.
