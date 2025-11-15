# Marketing & Services Overview — Current Status & Immediate Work

This doc summarizes the product ladder, assets available (we now have committed PDFs), how to access them on the site, and immediate marketing/operations risks relevant to deployment on Replit.

## Product Ladder (short)
- Free / Awareness: Parent Info Nights, podcast, webinars.
- Entry: StarPath Assessment™ — Transcript Audit + GAR + 30-day plan + optional live review call.
- Ongoing: StarPath Student — subscription-based tracking and weekly coaching.
- Premium: Go4it Academy full-time academic+athletic program.
- Residencies: 12-week immersive residencies (Vienna / Dallas) — marketed separately.

## Assets available (what I added)
- Static PDFs committed to the repo & served from `public/pdfs/`:
  - `/pdfs/spring2026flyer.pdf`
  - `/pdfs/Starpathflyer.pdf`
  - `/pdfs/weeklyOS.pdf`
  - `/pdfs/viennaresidency.pdf`
  - `/pdfs/DallasResidency.pdf`
  - A small static index page: `/pdfs/` (`public/pdfs/index.html`).
- A repository zip `go4it-pdfs.zip` was created at the repo root containing the `pdfs/` folder and `public/pdfs`.

## What can be delivered immediately via the site
- Assessment purchases via Stripe Checkout (endpoints implemented).
- Direct download links for PDFs (static files in `public/`).
- Booking flow and pricing pages are present under `app/pricing` and `app/book-session`.

## Marketing/ops issues to be aware of
1. Committed PDF artifacts increase repo size — for large-scale marketing campaigns prefer hosting assets externally (S3, CDN).
2. Git LFS pointer problems occurred earlier when pushing to `main`. We avoided touching `main` and pushed a deployment branch `deploy/replit-pdfs` instead. Action: resolve LFS pointers before merging to `main`.
3. Replit build size & native deps can cause build failures; test a Replit build from `deploy/replit-pdfs` branch first.
4. Webhook reliability: ensure `STRIPE_WEBHOOK_SECRET` is configured in the Replit Secrets dashboard and test with `stripe-cli`.

## Immediate marketing tasks (priorities)
1. Point landing pages at the new static PDF URLs (or S3 URLs if you prefer). Use `/pdfs/Starpathflyer.pdf` for StarPath funnel marketing.
2. Gate `webinar.pdf` or use it as a lead magnet — add a simple form + redirect to `/pdfs/webinar.pdf` (we can add `webinar.pdf` to `public/pdfs/` when converted).
3. Add social proof / case studies to `app/pricing` and link to the PDF download as a one-click asset.
4. Run a Replit test deployment (branch `deploy/replit-pdfs`) and verify the `/pdfs/` endpoints are public.

## Operational recommendations
- Use object storage for frequently-updated, large marketing assets.
- Create a simple KPI dashboard for: assessment purchases, assessment completion (uploading transcripts), and StarPath conversion rate.
- Run weekly webhook and payment reconciliation checks (automate with `scripts/smoke-parent-night` or `npm run smoke`).

---

If you'd like, I can:
- Open a short PR resolving `.gitignore`/LFS issues so `deploy/replit-pdfs` can be safely merged to `main`.
- Convert `Webinar.html` to `webinar.pdf` and add it to `public/pdfs/`.
- Add a small Next.js `app` page for a nicer downloads UI (instead of static `index.html`).
