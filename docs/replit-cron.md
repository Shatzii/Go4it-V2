# Replit Cron Alternatives for Parent Night Scheduling

The Vercel Cron config in `vercel.json` won't run on Replit. Use one of the following options to trigger the weekly event scheduler:

## Option A: n8n (recommended)

1. Host n8n (Cloud or self-hosted)
2. Create a Cron node: Sundays at 09:00 UTC
3. Add HTTP Request node:
   - Method: POST
   - URL: https://<your-repl-username>.<your-repl-name>.repl.co/api/parent-night/schedule
   - Headers: Content-Type: application/json
   - Body: {}
4. Deploy and verify logs in n8n.

## Option B: GitHub Actions

Create `.github/workflows/replit-parent-night-cron.yml` in your repo:

```yaml
name: Parent Night Weekly Scheduler
on:
  schedule:
    - cron: '0 9 * * 0'  # Sunday 09:00 UTC
  workflow_dispatch: {}
jobs:
  call-scheduler:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger schedule endpoint
        run: |
          curl -X POST \
            -H 'Content-Type: application/json' \
            --fail \
            "${{ secrets.REPL_PARENT_NIGHT_SCHEDULE_URL }}"
```

Set `REPL_PARENT_NIGHT_SCHEDULE_URL` in repo secrets to your Replit URL:
`https://<your-repl-username>.<your-repl-name>.repl.co/api/parent-night/schedule`.

## Option C: UptimeRobot / Cron-Job.org

- Create a new HTTP monitor (or cron job)
- Method: POST
- URL: https://<your-repl-username>.<your-repl-name>.repl.co/api/parent-night/schedule
- Headers: Content-Type: application/json
- Interval: Weekly, Sunday 09:00 UTC

## Smoke Test

You can manually run the scheduler to seed the next sessions:

```bash
curl -X POST "https://<your-repl-username>.<your-repl-name>.repl.co/api/parent-night/schedule" -H "Content-Type: application/json" -d '{}'
```

Expect a 200 response with a JSON summary of inserted events (duplicates are ignored).
