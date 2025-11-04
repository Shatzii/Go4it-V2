## Campaign Trigger Map (n8n ↔ Listmonk)

This document maps funnel events in the app to the automation workflows (n8n) and messaging (Listmonk email/SMS). It aligns trigger sources, payloads, templates, timing, and gating/consent so campaigns fire predictably and idempotently.

### Funnel states and keys

- Stages: site_visit → rsvp_tuesday → attended_tuesday → rsvp_thursday → attended_thursday → audit_booked → apply_started → enrolled
- Identity keys: leadId (primary), email (unique), phone (E164 when consented), deviceId cookie g4t_did (analytics only)
- Attribution: utm_source, utm_medium, utm_campaign, utm_content (cookies and DB columns)
- Event identifiers: eventId (Parent Night DB id), eventKind: parent_night_info | parent_night_decision | onboarding
- Consent: g4t_consent cookie; SMS only when explicit opt-in and phone present

### Systems and assets in repo

- n8n workflows (automation/n8n/)
  - weekly-scheduler.json — Sunday 09:00 UTC: creates Parent Night events, site blocks, and a Tuesday email campaign
  - rsvp-intake.json — Cal.com booking webhook → Confirm email + schedule 3h/30m SMS reminders
  - post-event-split.json — Attendance webhook → Route to Thu invite, re-invite next Tue, or Audit offer
  - parent_night_orchestration.json — Skeleton daily orchestration for reminders (optional)
  - decision_short_circuit.json — Tue attendee fast-follow (optional immediate nudges)
  - hot_lead_sla.json — Webhook → Slack alert for high-score/hot leads
  - dunning.json — Skeleton retry cadence for failed payments
  - pseo_weekly.json, compliance_guard.json — ancillary
- Listmonk templates (automation/listmonk/)
  - parent-night-confirm.html
  - decision-night-invite.html (also thu_decision_night.html)
  - audit-offer.html (also audit_offer.html)
  - onboarding-monday.html
  - SMS wrapper via transactional endpoint (/api/tx) using template LISTMONK_TEMPLATE_SMS_ID

Env keys (see .env.example.additions): LISTMONK_URL, LISTMONK_API_KEY, LISTMONK_LIST_ID, LISTMONK_TEMPLATE_*_ID; N8N_BASE_URL; SLACK_WEBHOOK_URL; KUTT_URL/KUTT_API_KEY.

---

## Trigger-to-campaign mapping

### 1) RSVP created (Parent Night booking)

- Source
  - Cal.com → n8n webhook: POST https://n8n…/webhook/cal-webhook (automation/n8n/rsvp-intake.json)
  - Internally, n8n calls app: POST /api/cal/webhook (verifies, upserts lead, creates RSVP, updates stage rsvp_tuesday|rsvp_thursday)
- Listmonk actions
  - Send parent-night-confirm.html (LISTMONK_TEMPLATE_CONFIRM_ID) immediately
  - Schedule two SMS via /api/tx with LISTMONK_TEMPLATE_SMS_ID:
    - T-3h before event: “Parent Night starts in 3 hours! Join: <short link>”
    - T-30m before event: “Starting soon! Link: <short link>”
  - n8n shortens joinUrl with Kutt for SMS link branding
- Data contract (Cal.com → n8n → app)
  - Cal payload: triggerEvent, payload.startTime, payload.metadata.joinUrl, attendees[0]{name,email,phoneNumber}, responses{phone,location,sport,gradYear}
  - App response: { success, leadId, eventId, stage }
- Consent
  - Email is transactional. SMS only if RSVP included a phone and SMS opt-in; gate in n8n by checking presence of phone/opt-in flag
- Idempotency
  - n8n should key on combination (email, startTime) to avoid duplicate confirmation; app /api/cal/webhook is upsert-safe

### 2) Tuesday attendance processed

- Source
  - Admin attendance mark or analytics → POST to n8n webhook: https://n8n…/webhook/attendance-webhook (automation/n8n/post-event-split.json)
- Payload
  - { leadId, email, firstName, athleteName?, timezone, eventKind: "parent_night_info", attended: true|false, thursdayDate?, thursdayEventId?, thursdayJoinLink?, nextTuesdayDate?, nextTuesdayEventId?, nextTuesdayLink? }
- Branches and actions
  - attended=true → Send decision-night-invite.html (LISTMONK_TEMPLATE_THURSDAY_ID); update lead stage to attended_tuesday via POST /api/leads/{leadId}
    - Optional fast-follow: also hit n8n decision_short_circuit webhook (…/webhook/decision-short) to send a short “book Thu” nudge
  - attended=false → Re-invite to next Tuesday using parent-night-confirm.html; keep stage rsvp_tuesday
- Idempotency
  - Use (leadId, eventId, eventKind) as dedupe key in n8n; app stage updates are idempotent

### 3) Thursday attendance processed

- Source
  - Admin/analytics → same n8n attendance-webhook with eventKind: "parent_night_decision", attended: true|false
- Branches and actions
  - attended=true → Send audit-offer.html (LISTMONK_TEMPLATE_AUDIT_ID) with link https://go4itsports.org/audit?utm_source=email&utm_medium=conversion&utm_campaign=audit-offer&utm_content=thursday_attendee; update lead stage attended_thursday
  - attended=false → Optionally schedule “missed Decision Night” re-engage; can reuse parent-night-confirm or a targeted template

### 4) Credit Audit checkout

- Source
  - App: POST /api/audit/create-payment-intent (sets creditAudits row, cookies g4t_lead/g4t_offer)
  - Stripe → POST /api/stripe/webhook
- Listmonk/n8n actions
  - payment_intent.succeeded → mark creditAudits.status=succeeded; update lead stage audit_booked; send onboarding-monday.html (LISTMONK_TEMPLATE_ONBOARD_ID) scheduling to next Monday morning; optionally notify Slack “Audit booked”
  - payment_intent.payment_failed → enqueue to n8n dunning.json (3 retries at 24h intervals); include a pay-link back to Audit checkout
- Idempotency
  - Stripe event id as idempotency key; app updates already guarded by stripePi

### 5) Apply started → Enrolled

- Source
  - App apply form submit → update lead stage apply_started; optional POST to n8n hot-lead SLA if scoring high
  - On admin completion/onboarding booked → stage enrolled; optional welcome series
- Listmonk actions
  - apply_started → transactional "Thanks — next steps" email (optional template)
  - enrolled → onboarding-monday.html or welcome series; add to primary Listmonk list/segment

---

## Listmonk: lists, templates, segmentation

- Lists
  - Primary prospects list: LISTMONK_LIST_ID
  - Optional: separate SMS-compatible list or rely on transactional /api/tx
- Templates and env
  - LISTMONK_TEMPLATE_CONFIRM_ID — parent-night-confirm.html
  - LISTMONK_TEMPLATE_THURSDAY_ID — decision-night-invite.html
  - LISTMONK_TEMPLATE_AUDIT_ID — audit-offer.html
  - LISTMONK_TEMPLATE_ONBOARD_ID — onboarding-monday.html
  - LISTMONK_TEMPLATE_SMS_ID — SMS wrapper (body.data.message)
- Subscriber attributes (recommended)
  - stage, lastEventKind, lastEventAt, utm_source/medium/campaign/content, club_code, region
  - Use n8n to upsert subscriber on RSVP and attendance so segments can target cohorts like rsvp_no_show, tue_attended_not_thu, thu_attended_no_audit

Example upsert (n8n HTTP node → POST {{LISTMONK_URL}}/api/subscribers):

```
{
  "email": "{{email}}",
  "name": "{{first_name}} {{last_name}}",
  "status": "enabled",
  "lists": [{{LISTMONK_LIST_ID}}],
  "attribs": {
    "stage": "{{stage}}",
    "utm_campaign": "{{utm_campaign}}",
    "region": "{{region}}",
    "club_code": "{{club_code}}"
  }
}
```

---

## n8n webhook contracts (expected payloads)

1) RSVP intake (Cal.com → n8n: cal-webhook)

```
{
  "triggerEvent": "BOOKING_CREATED",
  "payload": {
    "startTime": "2025-11-05T19:00:00.000Z",
    "metadata": { "joinUrl": "https://meet…", "timezone": "America/Chicago" },
    "attendees": [{"name": "Pat Parent", "email": "pat@example.com", "phoneNumber": "+13125551234"}],
    "responses": { "sport": "soccer", "gradYear": "2027", "phone": "+13125551234" }
  }
}
```

2) Attendance (app/admin → n8n: attendance-webhook)

```
{
  "leadId": 123,
  "email": "pat@example.com",
  "firstName": "Pat",
  "athleteName": "Alex",
  "timezone": "America/Chicago",
  "eventKind": "parent_night_info",
  "attended": true,
  "thursdayDate": "2025-11-06",
  "thursdayEventId": 987,
  "thursdayJoinLink": "https://meet…",
  "nextTuesdayDate": "2025-11-12",
  "nextTuesdayEventId": 990,
  "nextTuesdayLink": "https://meet…"
}
```

3) Hot-Lead SLA (app → n8n: hot-lead)

```
{ "leadId": 123, "score": 85, "reason": "attended_thursday + high intent" }
```

---

## Gating, compliance, idempotency

- Consent
  - Respect g4t_consent; do not set non-essential client cookies without consent. SMS only when opt-in is present.
  - Transactional emails (RSVP confirmations, schedule details) are allowed; keep opt-out links in promotional campaigns.
- DNT and analytics
  - /api/analytics/ingest respects DNT; messaging triggers come from server events and admin marks, not client analytics.
- Idempotency keys
  - RSVP: (email, event start) or (leadId, eventId)
  - Attendance: (leadId, eventId, eventKind)
  - Stripe: event.id; creditAudits.stripePi
  - Store last-sent markers in n8n (e.g., with a Code node + Redis or app-side DB flags) to prevent duplicates.

---

## What’s already wired vs. next hooks

Already wired in code
- /api/cal/webhook upserts lead, RSVP, stage
- /api/audit/create-payment-intent persists creditAudits, sets g4t_lead/g4t_offer
- /api/stripe/webhook updates creditAudits on success/failure
- Cookies and UTMs captured (g4t_*), analytics proxy enriched

Next minimal hooks (optional small adds)
- Admin tool to POST attendance to n8n attendance-webhook
- On Stripe success, call n8n to schedule onboarding-monday (or send via Listmonk /api/campaigns)
- On high score, POST to n8n hot-lead webhook to alert Slack

---

## Quick verification checklist

- n8n
  - Import and activate: rsvp-intake.json, post-event-split.json, weekly-scheduler.json
  - Set credentials: Listmonk Basic, Kutt API, Slack webhook
- Listmonk
  - Import templates in automation/listmonk/ and record template IDs
  - Confirm transactional /api/tx works; test sends include compliance footer
- App
  - Cal.com webhook secret set; Stripe keys + webhook secret set
  - RSVP → confirm email received; SMS scheduled (if opted-in)
  - Attendance POST to n8n routes Thu invite/Audit offer correctly

This mapping keeps all messaging reversible and flag-gated, and it preserves attribution and consent across the funnel while minimizing risk to existing routes.
