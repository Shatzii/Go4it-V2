# Go4it Sports GPT — Pro Action Map (v4.0.0)

**Import URL (GPT Builder → Configure → Actions → Import from URL)**  
Primary: `https://go4itsports.org/gpt/go4it_actions_pro.json`  
Fallback: `https://raw.githubusercontent.com/Shatzii/Go4it-V2/main/gpt/go4it_actions_pro.json`

---

## What this is
A production-grade JSON map that turns **Go4it Sports GPT** into an **AI command center**:
- Lead gen + sales automation (Odoo/Mautic/Cal.com)
- Events engine (FNL/Soccer/Camps) with 72h film/GAR SOP
- Finance (Stripe checkout, invoices, ledger)
- Web/SEO/UTM, email/SMS, Slack ops comms
- NCAA/FIFA compliance (Guardian Mode)
- Localization (EN/DE/ES) and voice presets (parent/sponsor/academy/nike)

---

## Files in this folder
- `go4it_actions_pro.json` — the live action map
- `go4it_actions.schema.json` — JSON Schema to validate the map
- `README.md` — you're here
- (Optional) `/docs` — GitHub Pages docs (add later)
- (Optional) `/versions` — versioned snapshots for rollback

---

## Quick Start (5 minutes)
1. Open **GPT Builder** → *Create / Edit your custom GPT*
2. Go to **Actions → Import from URL**
3. Paste the **Primary** URL above → **Import**
4. Test a smoke prompt (below)
5. Connect credentials (Stripe, Airtable, SendGrid/Twilio, Slack)

> Tip: Keep this repo's `main` branch protected. All changes to the JSON run schema checks in CI.

---

## Staff Shortcuts (aliases you can say/type)
| Action | Shortcut | Example |
|---|---|---|
| `/plan90d` | `plan90` | `plan90 start=2026-01-01` |
| `/eventpack` | `epack` | `epack fnl city=Denver date=2026-02-14` |
| `/sponsor memo` | `smemo` | `smemo city=Vienna month=2026-04` |
| `/adset` | `ads` | `ads audience=parent objective=credit_audit` |
| `/audit eligibility` | `elig` | `elig country=AT sport=soccer age=16` |
| `/translate-localize` | `localize` | `localize lang=de-AT text="Join Pathway"` |
| `/offer builder` | `offer` | `offer bundle_name="Spring Pathway" products=['pathway-starter','soccer-ticket'] discount_pct=15` |

*(Shortcuts are for training; use full slash-commands in production.)*

---

## Smoke Prompts (copy/paste)
```
/eventpack soccer city=Vienna date=2026-04-01 venue=Sportzentrum
/offer builder bundle_name='Spring Pathway + Easter Camp' products=['pathway-starter','soccer-ticket'] discount_pct=15 valid_until=2026-03-29
/checkout product=credit-audit
/audit eligibility country=AT sport=soccer age=16
/translate-localize lang=de-AT text='Join the NCAA Pathway now!'
/growth simulation quarter=Q2 assumptions={"event_attendance":800,"conv_to_audit":0.18}
/sponsor memo city=Vienna month=2026-04 sponsor_name=Red Bull
/kpi pulse month=2026-05
/find leads source_type=youth_clubs location=Vienna sport=soccer age_range=u16
/book demo lead_email=test@example.com lead_name='Test Athlete' demo_type=pathway
/nurture sequence segment=event_attendees sequence_length=5 primary_offer='Pathway Starter'
```

---

## Environment & Integrations
Create a secure `.env` (or secrets) for:
```
STRIPE_KEY=sk_live_xxx
AIRTABLE_KEY=pat_xxx
ODOO_URL=https://crm.go4itsports.org
ODOO_DB=go4it_prod
MAUTIC_URL=https://mautic.go4itsports.org
CAL_API_KEY=xxxx
SENDGRID_KEY=SG.xxxx
TWILIO_SID=ACxxx
TWILIO_TOKEN=xxx
SLACK_WEBHOOK_OPS=...
SLACK_WEBHOOK_EVENTS=...
SLACK_WEBHOOK_SPONSORS=...
SLACK_WEBHOOK_SALES=...
S3_ACCESS_KEY=...
S3_SECRET=...
GOOGLE_SERVICE_ACCOUNT_JSON=...
```

---

## Compliance Guardrails (do not remove)
- No guarantees of **scholarships** or **pro outcomes**
- Keep **academic (Pathway)** separate from **non-academic (Athlete OS/GAR)**
- Append **Truth-in-Marketing** on academic/eligibility/sponsor docs
- Protect **amateurism**; zero agent/transfer language at events

---

## Troubleshooting
- **Import failed?** Use the fallback raw URL.
- **Schema error in CI?** Open the failing line; ensure each action has `name`, `category`, `description`, `input_schema`.
- **Content tone off?** Switch `voice_presets` or `model_settings.creativity/formality`.
- **Compliance flagging copy?** Guardian Mode will rewrite risky phrasing automatically.

---

## Versioning
- Bump `meta.version` (semver) when changing actions or structure
- Copy current JSON to `/gpt/versions/go4it_actions_vX.Y.Z.json`
- Update `meta.mirrors.versioned` to the new file
- Update `meta.last_updated`

**Made by Go4it Sports Academy** — *Train Here. Place Anywhere.*