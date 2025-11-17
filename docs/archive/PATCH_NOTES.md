# Go4it OS vNext Patch Notes

This patch introduces feature-flagged scaffolding for Go4it OS vNext without breaking prod.

## What’s included
- Feature flags: EDGE_ICS, OFFERS (safe-off by default)
- Brand tokens: `lib/brand.ts`
- Compliance: `middleware.ts` header injection; `lib/compliance/mailerSigner.ts`
- Content CI linter: `scripts/content-lint.mjs` + `npm run ci:content-lint`
- DB schema: new tables in `lib/db/schema/go4it_os.ts` (creditAudits, households, householdMembers, clubs, referrers, referrals, payouts, pseoPages)
- APIs:
  - `/api/events/next` and `/api/events/rsvp`
  - `/api/ics/[id]` now Edge runtime
  - `/api/audit/create-payment-intent` (Stripe) + `/api/stripe/webhook` (stub)
  - `/api/analytics/ingest` PostHog proxy
  - `/api/shortlink` (Kutt), `/api/eligibility/pdf` (stub), `/api/pseo/generate`
- Vercel cron: weekly P-SEO
- n8n workflows skeletons: parent night, decision short-circuit, dunning, hot-lead SLA, P-SEO weekly, compliance guard
- Listmonk and SMS templates with compliance footer
- Env: expanded `.env.example`

## Safe rollout plan
1) Set env keys in Vercel and local; keep flags OFF.
2) Run `npm run ci:content-lint` in CI to enforce compliance.
3) Validate `/api/events/next` and `/api/events/rsvp` in dev.
4) Flip `NEXT_PUBLIC_FEATURE_EDGE_ICS=true`; verify ICS download and calendar clients.
5) Configure Stripe + webhook, then enable `NEXT_PUBLIC_FEATURE_OFFERS=true` and test payments (test mode).
6) Start n8n workflows in staging; verify Listmonk/SMS sends include footer and safety line.
7) Enable cron for `/api/pseo/generate`; confirm pages land under `content/pseo`.
8) Gradually enable Parent Night related flags; monitor PostHog via `/api/analytics/ingest`.

## Notes
- ICS route now runs on Edge; timezone blocks (VTIMEZONE) can be added later to enhance cross-calendar fidelity.
- Existing funnel tables are reused; new OS tables avoid collisions.
- Stripe webhook is a placeholder; add signature verification before enabling in prod.