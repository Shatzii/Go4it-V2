# RUNBOOK - Parent Night

## Pre-Event
- Verify events seeded for EU (Europe/Vienna) and US (America/Chicago)
- Confirm Listmonk segments and templates (Tue/Thu)
- Ensure PostHog key set; flags: PARENT_NIGHT_PAGE, EDGE_ICS (as needed)

## During
- Monitor /api/events/next health; confirm RSVP intake in PostHog (via proxy)
- Answer live chat; log common questions

## After
- Trigger Decision Night short-circuit for Tue attendees
- Review RSVP -> attendance; queue Audit offer

## Troubleshooting
- ICS download fails -> check /api/ics/[id] and BASE_URL
- Cal.com webhook invalid -> verify CAL_WEBHOOK_SECRET
- Emails missing footer -> check mailer signer / content linter