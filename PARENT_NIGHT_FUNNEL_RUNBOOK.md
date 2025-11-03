# Parent Night Funnel - Complete Implementation Runbook

## 📋 Overview

This runbook covers the complete deployment and configuration of the automated Parent Night funnel for Go4it Sports Academy. The funnel automates discovery → RSVP → attend → decide → convert → onboard.

---

## 🗂️ Files Created

### Core Application Files
```
├── content/
│   ├── brand.ts                          # Brand constants (LOCK)
│   └── parent-night-copy.ts              # All copy for funnel pages
├── lib/
│   ├── flags.ts                          # Feature flags (updated)
│   └── db/schema/funnel.ts               # Database schema
├── components/
│   ├── site/
│   │   ├── HeroDynamic.tsx               # Dynamic hero with next event
│   │   └── JsonLdOrg.tsx                 # SEO structured data
│   └── analytics/
│       └── PostHogClient.tsx             # Analytics tracking (exists)
├── app/
│   ├── parent-night/page.tsx             # RSVP page with Cal.com embeds
│   └── api/
│       ├── parent-night/schedule/route.ts    # Create weekly events
│       ├── cal/webhook/route.ts              # Handle Cal.com bookings
│       ├── ics/[id]/route.ts                 # Generate calendar files
│       └── marketing/schedule/route.ts       # Ingest content plan
├── automation/
│   ├── prompts/
│   │   ├── orchestrator.md               # Weekly content planning
│   │   ├── scraper.md                    # News/data harvesting
│   │   ├── planner.md                    # Content calendar mapping
│   │   └── writer.md                     # Multi-channel copywriting
│   ├── listmonk/
│   │   ├── parent-night-confirm.html     # Email: Tuesday confirmation
│   │   ├── decision-night-invite.html    # Email: Thursday invitation
│   │   ├── audit-offer.html              # Email: 48-hr audit offer
│   │   └── onboarding-monday.html        # Email: Onboarding welcome
│   ├── n8n/
│   │   ├── weekly-scheduler.json         # Workflow: Sunday event creation
│   │   ├── rsvp-intake.json              # Workflow: RSVP → confirm → remind
│   │   └── post-event-split.json         # Workflow: Attendance-based routing
│   └── kutt/
│       └── examples.md                   # Shortlink creation guide
├── vercel.json                           # Cron configuration
└── .env.example.additions                # Environment variables
```

---

## 🚀 Installation Steps

### 1. Database Migration

Push the new funnel schema to your database:

```bash
cd /home/runner/workspace
npm run db:push
```

**Tables created:**
- `events` — Tuesday/Thursday/Monday sessions
- `leads` — Contact info & funnel stage tracking
- `rsvps` — Event registrations & attendance
- `marketing_items` — Scheduled content (hero/email/social)

### 2. Environment Variables

Copy `.env.example.additions` to your `.env.local`:

```bash
cat .env.example.additions >> .env.local
```

**Required variables to update:**
```env
# Cal.com
CAL_TOKEN="your-actual-token"
CAL_WEBHOOK_SECRET="your-webhook-secret"

# Listmonk
LISTMONK_URL="https://listmonk.yourdomain.com"
LISTMONK_API_KEY="your-api-key"

# Kutt
KUTT_API_KEY="your-kutt-key"

# PostHog
NEXT_PUBLIC_POSTHOG_KEY="your-posthog-key"

# Feature Flags (enable funnel)
NEXT_PUBLIC_FEATURE_PARENT_NIGHT_PAGE="true"
NEXT_PUBLIC_FEATURE_NEW_HERO="true"
```

### 3. Deploy to Vercel

```bash
# Commit all changes
git add .
git commit -m "feat: add Parent Night automated funnel"
git push origin main

# Vercel auto-deploys from main branch
# Add environment variables in Vercel dashboard
```

**Vercel Settings:**
1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.local`
3. Enable Cron Jobs (Pro/Enterprise plan required)
   - Cron runs every Sunday at 9 AM UTC
   - Endpoint: `POST /api/parent-night/schedule`

---

## 🗓️ Cal.com Configuration

### Create Event Types

Create 6 event types in Cal.com dashboard:

#### 1. Parent Night: Info & Discovery (EU)
- **Slug:** `parent-night-info-eu`
- **Duration:** 60 minutes
- **Schedule:** Tuesdays 7:00 PM Europe/Vienna
- **Location:** Custom (use `PN_EU_URL`)
- **Booking fields:**
  - First Name (required)
  - Last Name (required)
  - Email (required)
  - Phone (optional)
  - Athlete's sport (dropdown)
  - Current grade level (dropdown)

#### 2. Parent Night: Info & Discovery (US)
- **Slug:** `parent-night-info-us`
- **Duration:** 60 minutes
- **Schedule:** Tuesdays 7:00 PM America/Chicago
- **Location:** Custom (use `PN_US_URL`)
- **Same booking fields as above**

#### 3. Parent Night: Decision (EU)
- **Slug:** `parent-night-decision-eu`
- **Duration:** 60 minutes
- **Schedule:** Thursdays 7:00 PM Europe/Vienna
- **Location:** Custom (use `PN_EU_URL`)

#### 4. Parent Night: Decision (US)
- **Slug:** `parent-night-decision-us`
- **Duration:** 60 minutes
- **Schedule:** Thursdays 7:00 PM America/Chicago
- **Location:** Custom (use `PN_US_URL`)

#### 5. Onboarding (EU)
- **Slug:** `onboarding-eu`
- **Duration:** 60 minutes
- **Schedule:** Mondays 9:00 AM Europe/Vienna
- **Location:** Custom (use `ONBOARD_EU_URL`)

#### 6. Onboarding (US)
- **Slug:** `onboarding-us`
- **Duration:** 60 minutes
- **Schedule:** Mondays 9:00 AM America/Chicago
- **Location:** Custom (use `ONBOARD_US_URL`)

### Set Up Webhook

1. Go to Settings → Webhooks → Add Webhook
2. **Subscriber URL:** `https://go4itsports.org/api/cal/webhook`
3. **Trigger Events:** Select `BOOKING_CREATED`
4. **Secret:** Copy to `CAL_WEBHOOK_SECRET` env var
5. Test webhook with sample booking

---

## 📧 Listmonk Configuration

### Import Email Templates

1. Go to Campaigns → Templates → Import Template
2. Upload each HTML file from `automation/listmonk/`:
   - `parent-night-confirm.html` → Note Template ID (e.g., 1)
   - `decision-night-invite.html` → Note Template ID (e.g., 2)
   - `audit-offer.html` → Note Template ID (e.g., 3)
   - `onboarding-monday.html` → Note Template ID (e.g., 4)

3. Update `.env.local` with template IDs:
```env
LISTMONK_TEMPLATE_CONFIRM_ID="1"
LISTMONK_TEMPLATE_THURSDAY_ID="2"
LISTMONK_TEMPLATE_AUDIT_ID="3"
LISTMONK_TEMPLATE_ONBOARD_ID="4"
```

### Create Lists

1. Lists → Add New List
2. **Name:** "Parent Night Leads"
3. **Type:** Public (opt-in via form) or Private (manual import)
4. Note List ID → Update `LISTMONK_LIST_ID` in `.env.local`

### Configure Transactional Sending

1. Settings → SMTP → Configure your SMTP provider
2. Test send with sample data:
```json
{
  "subscriber_email": "test@example.com",
  "template_id": 1,
  "data": {
    "first_name": "John",
    "event_date": "November 11, 2025",
    "event_time": "7:00 PM",
    "timezone": "Central Time",
    "join_link": "https://meet.go4itsports.org/parent-night-us",
    "ics_link": "https://go4itsports.org/api/ics/1"
  }
}
```

---

## 🔗 Kutt URL Shortener

### Setup Custom Domain

1. Sign up at https://kutt.it (or deploy self-hosted)
2. Add custom domain: `go.go4itsports.org`
3. Configure DNS:
   ```
   CNAME go.go4itsports.org → kutt.it
   ```
4. Get API key from Settings → API

### Create Initial Shortlinks

Run the bulk creation script:

```bash
cd automation/kutt
chmod +x bulk-create-links.sh
./bulk-create-links.sh
```

**Creates:**
- `go.go4itsports.org/pn-ig` → Instagram post link
- `go.go4itsports.org/pn-li` → LinkedIn article link
- `go.go4itsports.org/pn-3h` → 3-hour SMS reminder
- `go.go4itsports.org/pn-30m` → 30-minute SMS reminder
- `go.go4itsports.org/audit` → Credit audit offer

---

## 🤖 n8n Workflow Setup

### Import Workflows

1. Open n8n instance
2. Import each JSON file:
   - `weekly-scheduler.json`
   - `rsvp-intake.json`
   - `post-event-split.json`

3. Configure credentials for each workflow:
   - **HTTP Auth:** Add API key for your site (`BASE_URL`)
   - **Listmonk Basic Auth:** Username + password
   - **Kutt API Key:** From Kutt settings
   - **Slack Webhook:** Optional team notifications

### Test RSVP Flow

1. Activate `rsvp-intake.json` workflow
2. Make a test booking in Cal.com (parent-night-info-us)
3. Check workflow execution:
   - ✅ Lead created in database
   - ✅ RSVP row created
   - ✅ Shortlink generated
   - ✅ Confirmation email sent
   - ✅ SMS reminders scheduled

### Enable Weekly Scheduler

1. Activate `weekly-scheduler.json`
2. Wait for Sunday 9 AM UTC execution, or trigger manually
3. Verify:
   - 6 events created (Tue EU/US, Thu EU/US, Mon EU/US)
   - Marketing items scheduled
   - Email campaign queued
   - Slack notification sent

---

## 📊 PostHog Analytics

### Configure Project

1. Create project at https://app.posthog.com
2. Copy Project API Key → `NEXT_PUBLIC_POSTHOG_KEY`
3. Note host URL (usually `https://app.posthog.com`)

### Create Insights

Create dashboards to track:

#### Funnel Overview
1. New Insight → Funnel
2. Steps:
   - `cta_click` (hero → RSVP page)
   - `rsvp_submit` (Cal.com booking)
   - `attended` (Tue/Thu show rate)
   - `audit_booked` (conversion)
   - `apply_started` (application)
   - `enrolled` (onboarding)

#### Conversion Metrics
- **Site → RSVP:** Target >10%
- **RSVP → Attended:** Target >60%
- **Tue Attended → Thu RSVP:** Target >40%
- **Thu Attended → Audit Booked:** Target >50%
- **Audit → Apply:** Target >70%
- **Apply → Enrolled:** Target >80%

### Event Properties to Track
- `event_kind`: parent_night_info | parent_night_decision | onboarding
- `timezone`: EU (Europe/Vienna) | US (America/Chicago)
- `cta_name`: Identifies which CTA was clicked
- `page`: Source page for conversions

---

## ✅ QA Flow Checklist

### End-to-End Test

**Day 1 (Sunday):**
- [ ] Cron runs at 9 AM UTC
- [ ] 6 events created in database (Tue/Thu/Mon × EU/US)
- [ ] Site hero updates with "Next Session" info
- [ ] Marketing slots scheduled

**Day 2 (Monday):**
- [ ] User visits site → sees hero banner with Tue RSVP CTA
- [ ] Clicks "RSVP for Parent Night" → lands on `/parent-night`
- [ ] Page shows 6 Cal.com embeds (Tue EU/US, Thu EU/US, Mon EU/US)
- [ ] PostHog tracks `cta_click` event

**RSVP Flow:**
- [ ] User books Tuesday Info session (EU or US)
- [ ] Cal.com sends webhook → `/api/cal/webhook`
- [ ] Lead created/updated in database
- [ ] RSVP row created with status `registered`
- [ ] n8n workflow triggers
- [ ] Shortlink created via Kutt
- [ ] Confirmation email sent (parent-night-confirm template)
- [ ] ICS attachment link works
- [ ] SMS reminders scheduled (3h & 30m before)
- [ ] PostHog tracks `rsvp_submit`

**Tuesday (Event Day):**
- [ ] 3-hour SMS sent: "Parent Night starts in 3 hrs! Join: [link]"
- [ ] 30-minute SMS sent: "Starting soon! Link: [link]"
- [ ] User joins meeting via link
- [ ] Event happens 🎉

**Post-Tuesday:**
- [ ] Manually mark attendance in database (or use admin tool)
- [ ] If attended → Thursday invite email sent (decision-night-invite template)
- [ ] If no-show → Next Tuesday re-invite sent
- [ ] Lead stage updated to `attended_tuesday` or stays `rsvp_tuesday`
- [ ] PostHog tracks `attended` event

**Thursday (Decision Night):**
- [ ] User attends Decision Night
- [ ] Mark attendance
- [ ] Audit offer email sent (audit-offer template)
- [ ] Lead stage → `attended_thursday`
- [ ] PostHog tracks `attended` event

**Post-Thursday:**
- [ ] User clicks "Book Your Free Audit" CTA
- [ ] PostHog tracks `audit_booked`
- [ ] User completes audit → applies
- [ ] PostHog tracks `apply_started`
- [ ] User enrolls
- [ ] Lead stage → `enrolled`
- [ ] PostHog tracks `enrolled`

**Monday (Onboarding):**
- [ ] Sunday 8 AM: Onboarding reminder email sent (onboarding-monday template)
- [ ] Monday 9 AM: User joins onboarding session
- [ ] User sets up Study Hall, NCAA checklist, class tracker
- [ ] Welcome complete ✅

---

## 🔧 Troubleshooting

### Issue: Events not created on Sunday
**Check:**
1. Vercel cron enabled? (Pro/Enterprise plan required)
2. `vercel.json` deployed with correct path?
3. Check Vercel logs: Functions → Cron → View Logs
4. Test endpoint manually: `curl -X POST https://go4itsports.org/api/parent-night/schedule`

### Issue: Cal.com webhook not triggering
**Check:**
1. Webhook URL correct in Cal.com settings?
2. Webhook secret matches `.env` variable?
3. Test with Webhook.site: Temporarily change Cal.com webhook to Webhook.site, inspect payload
4. Check Next.js API logs for errors

### Issue: Emails not sending
**Check:**
1. Listmonk SMTP configured?
2. Template IDs correct in `.env`?
3. Test transactional endpoint directly with curl
4. Check Listmonk logs: Settings → Logs

### Issue: Shortlinks not working
**Check:**
1. Kutt API key valid?
2. Custom domain DNS configured?
3. Test link creation manually with curl
4. Check Kutt dashboard for link status

### Issue: PostHog not tracking
**Check:**
1. API key and host correct in `.env`?
2. Browser console for errors?
3. Ad blocker or privacy extension blocking PostHog?
4. Test in incognito mode
5. Check PostHog dashboard: Settings → Project → Ingestion

---

## 📈 Success Metrics

### Week 1 Target (Baseline)
- **Site Traffic:** 1,000 visitors/week
- **Hero CTA Clicks:** 100 (10% CTR)
- **RSVPs:** 30 (30% of clicks)
- **Attended:** 18 (60% show rate)
- **Audit Booked:** 9 (50% of attendees)

### Week 4 Target (Optimized)
- **Site Traffic:** 1,500 visitors/week
- **Hero CTA Clicks:** 180 (12% CTR)
- **RSVPs:** 60 (33% of clicks)
- **Attended:** 42 (70% show rate)
- **Audit Booked:** 25 (60% of attendees)
- **Enrolled:** 15 (60% of audits)

---

## 🔄 Weekly Maintenance

### Sunday (9 AM UTC)
- Automated: Events created for next week
- Review: Check cron execution logs
- Monitor: Dashboard metrics from previous week

### Monday (Manual)
- Review: Upcoming Tue/Thu session calendar
- Update: Site hero if special announcement needed
- Prep: Run Scraper → Planner → Writer for social content

### Tuesday (Event Day)
- Monitor: RSVP count (target: 5-10 per session)
- Join: Attend session (or delegate to team)
- Track: Attendance in database

### Wednesday (Post-Tue)
- Update: Attendance status (attended/no-show)
- Send: Thursday invites (automated via n8n)
- Post: Social recap/testimonial

### Thursday (Event Day)
- Monitor: Decision Night attendance
- Present: Audit offer during session
- Track: Audit bookings

### Friday (Post-Thu)
- Update: Attendance status
- Send: Audit offers (automated)
- Review: Week's funnel performance

---

## 🎯 Next Steps After Launch

1. **A/B Test Hero Copy:** Test different headlines/CTAs
2. **Add Retargeting:** Facebook/Instagram pixels for no-shows
3. **SMS Opt-In:** Add phone capture to RSVP form
4. **Testimonial Collection:** Record sessions, get quotes
5. **Referral Program:** Incentivize enrolled families to invite friends
6. **Automated Follow-Up:** Sequences for no-shows, missed audits
7. **Analytics Dashboard:** Custom Grafana/Metabase for team visibility

---

## 📞 Support

**Technical Issues:**
- Email: info@go4itsports.org
- Phone: +1 205-434-8405

**Repository:**
- GitHub: Shatzii/Go4it-V2
- Branch: main

**Documentation:**
- This runbook
- Automation prompts: `/automation/prompts/*.md`
- API docs: Check each route file for inline comments

---

**Status:** ✅ Ready for Production Deployment

**Last Updated:** November 3, 2025
