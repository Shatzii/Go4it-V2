# Kutt Shortlink Examples

Generate branded shortlinks with UTM parameters for social media and SMS campaigns.

## Setup

1. Get API key from your Kutt instance: https://kutt.it (or self-hosted)
2. Set environment variable: `KUTT_API_KEY`
3. Configure custom domain: `go.go4itsports.org`

## CLI Examples

### Create Parent Night Shortlink (Instagram)

```bash
curl -X POST https://kutt.it/api/v2/links \
  -H "X-API-Key: $KUTT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "target": "https://go4itsports.org/parent-night?utm_source=ig&utm_medium=post&utm_campaign=parent-night&utm_content=tuesday_promo",
    "customurl": "pn-ig",
    "domain": "go.go4itsports.org",
    "description": "Parent Night - Instagram Post"
  }'
```

**Result:** `https://go.go4itsports.org/pn-ig`

### Create Thursday Decision Night (LinkedIn)

```bash
curl -X POST https://kutt.it/api/v2/links \
  -H "X-API-Key: $KUTT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "target": "https://go4itsports.org/parent-night?utm_source=li&utm_medium=post&utm_campaign=parent-night&utm_content=thursday_decision",
    "customurl": "decision-li",
    "domain": "go.go4itsports.org",
    "description": "Decision Night - LinkedIn Post"
  }'
```

**Result:** `https://go.go4itsports.org/decision-li`

### Create SMS Reminder Link (3-hour)

```bash
curl -X POST https://kutt.it/api/v2/links \
  -H "X-API-Key: $KUTT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "target": "https://meet.go4itsports.org/parent-night-us?utm_source=sms&utm_medium=reminder&utm_campaign=parent-night&utm_content=3h_reminder",
    "customurl": "pn-3h",
    "domain": "go.go4itsports.org",
    "description": "Parent Night 3hr SMS Reminder"
  }'
```

**Result:** `https://go.go4itsports.org/pn-3h`

### Create Audit Offer Link (Email)

```bash
curl -X POST https://kutt.it/api/v2/links \
  -H "X-API-Key: $KUTT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "target": "https://go4itsports.org/audit?utm_source=email&utm_medium=conversion&utm_campaign=audit-offer&utm_content=thursday_attendee",
    "customurl": "audit",
    "domain": "go.go4itsports.org",
    "description": "48-Hour Credit Audit Offer"
  }'
```

**Result:** `https://go.go4itsports.org/audit`

## Node.js Integration

```typescript
import fetch from 'node-fetch';

async function createShortlink(target: string, slug: string, description?: string) {
  const response = await fetch('https://kutt.it/api/v2/links', {
    method: 'POST',
    headers: {
      'X-API-Key': process.env.KUTT_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      target,
      customurl: slug,
      domain: 'go.go4itsports.org',
      description,
    }),
  });

  const data = await response.json();
  return data.link; // https://go.go4itsports.org/slug
}

// Example usage
const igLink = await createShortlink(
  'https://go4itsports.org/parent-night?utm_source=ig&utm_medium=post&utm_campaign=parent-night&utm_content=reel_nov11',
  'pn-reel',
  'Parent Night IG Reel - Nov 11'
);
```

## UTM Parameter Conventions

**Source (`utm_source`):**
- `site` — Website organic traffic
- `email` — Email campaigns
- `sms` — Text message reminders
- `ig` — Instagram
- `li` — LinkedIn
- `x` — Twitter/X
- `tiktok` — TikTok

**Medium (`utm_medium`):**
- `organic` — Non-paid traffic
- `post` — Social media posts
- `story` — Instagram/TikTok stories
- `paid` — Paid advertising
- `reminder` — Automated reminders (email/SMS)
- `conversion` — Post-event conversion emails

**Campaign (`utm_campaign`):**
- `parent-night` — Tuesday/Thursday sessions
- `onboarding-monday` — Monday onboarding sessions
- `audit-offer` — 48-Hour Credit Audit promotion
- `events` — General event calendar

**Content (`utm_content`):**
- Descriptive snake_case: `tuesday_promo`, `3h_reminder`, `hero_banner`, etc.

## Bulk Creation Script

```bash
#!/bin/bash
# bulk-create-links.sh

KUTT_API_KEY="your-api-key"
BASE_URL="https://go4itsports.org"
DOMAIN="go.go4itsports.org"

links=(
  "pn-ig|/parent-night?utm_source=ig&utm_medium=post&utm_campaign=parent-night&utm_content=feed"
  "pn-li|/parent-night?utm_source=li&utm_medium=post&utm_campaign=parent-night&utm_content=article"
  "pn-x|/parent-night?utm_source=x&utm_medium=post&utm_campaign=parent-night&utm_content=tweet"
  "pn-3h|https://meet.go4itsports.org/parent-night-us?utm_source=sms&utm_medium=reminder&utm_campaign=parent-night&utm_content=3h_reminder"
  "pn-30m|https://meet.go4itsports.org/parent-night-us?utm_source=sms&utm_medium=reminder&utm_campaign=parent-night&utm_content=30m_reminder"
)

for link in "${links[@]}"; do
  IFS='|' read -r slug path <<< "$link"
  
  curl -X POST https://kutt.it/api/v2/links \
    -H "X-API-Key: $KUTT_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"target\": \"$BASE_URL$path\",
      \"customurl\": \"$slug\",
      \"domain\": \"$DOMAIN\"
    }" \
    --silent | jq '.link'
done
```

## Analytics

Track shortlink clicks in Kutt dashboard:
- Click-through rates by channel
- Geographic distribution
- Time-of-day patterns
- Device types (mobile vs desktop)

Combine with PostHog events (`cta_click`, `rsvp_submit`) for full funnel visibility.
