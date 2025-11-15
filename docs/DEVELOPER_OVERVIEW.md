```markdown
# Developer Site Overview — Current Specs & Known Issues

This file is the single-pane developer summary to help engineering and ops deploy and maintain the site (Next.js + server routes). It documents the current runtime/build requirements, available features, static assets we added (PDFs), and issues we've observed during recent work (Replit deployment, Git/LFS, native deps).

## High-level architecture (short)
- Frontend: Next.js App Router (project currently uses `next@^16`) + React + TypeScript.
- Backend: Next.js server components & server routes under `app/api/*` plus helper services in `lib/` and `server/`.
- Auth: Clerk (`lib/auth.ts` helpers) for auth + RBAC.
- Data: File-backed JSON stores for local/dev (under `data/`), optional Drizzle DB via `server/storage` when `FEATURE_STUDIO_DB=true`.

# Developer Site Overview — Current Specs & Known Issues

This file is the single-pane developer summary to help engineering and ops deploy and maintain the site (Next.js + server routes). It documents the current runtime/build requirements, available features, static assets we added (PDFs), and issues we've observed during recent work (Replit deployment, Git/LFS, native deps).

## High-level architecture (short)
- Frontend: Next.js App Router (project currently uses `next@^16`) + React + TypeScript.
- Backend: Next.js server components & server routes under `app/api/*` plus helper services in `lib/` and `server/`.
- Auth: Clerk (`lib/auth.ts` helpers) for auth + RBAC.
- Data: File-backed JSON stores for local/dev (under `data/`), optional Drizzle DB via `server/storage` when `FEATURE_STUDIO_DB=true`.

## Runtime & build requirements
- Node: >=20 (package.json `engines` requires Node 20+).
- Next.js: v16 (App Router). Build/test scripts in `package.json` including `start:replit`.
- Native dependencies: packages like `canvas`, `better-sqlite3`, `puppeteer`/`playwright` and `sharp`-style libs require system libraries (libpango, cairo, libjpeg, etc.). Ensure `replit.nix` or Docker images include those (our `replit.nix` already includes many media libs such as `pango`, `cairo`, `ffmpeg`).

## Scripts of note
- `npm run dev` — local development (next dev). Use `HOST`/`PORT` for binding.
- `npm run build` — production build (configured with NODE_OPTIONS for memory).
- `npm run start:replit` — builds then runs `next start` (used by `.replit`).
- `./convert_html_to_pdf.sh` — helper script we added to generate PDFs from local HTML and copy them into `public/pdfs/`.

## Static assets & marketing PDFs (what we added)
- Generated PDFs are now committed to `public/pdfs/` and also live in a `pdfs/` folder with a repo zip `go4it-pdfs.zip`.
- Public URLs (served by Next.js when app is running):
  - `/pdfs/spring2026flyer.pdf`
  - `/pdfs/Starpathflyer.pdf`
  - `/pdfs/weeklyOS.pdf`
  - `/pdfs/viennaresidency.pdf`
  - `/pdfs/DallasResidency.pdf`
  - `/pdfs/` — simple static `index.html` we created at `public/pdfs/index.html`.
- Notes: committing generated artifacts (PDFs/zip) is convenient for static hosts like Replit but not ideal for large repos or frequent regeneration. Consider storing assets in an object store (S3) for production.

## Deployment notes — Replit
- There is a `.replit` file configured to run `npm run start:replit`. The `replit.nix` includes `nodejs-20_x` and many native packages required for optional media processing.
- We pushed a branch `deploy/replit-pdfs` containing the PDF artifacts and the small `public/pdfs/index.html` so Replit can deploy directly from that branch without merging into `main`.
- Build process on Replit should run the `.replit` `build` commands which run `npm ci` and `npm run build`. Ensure Replit provides enough memory for the Next build (the repo is large; consider increasing build resources or using incremental builds).

## Environment variables (most important)
- `CLERK_SECRET`, `CLERK_PUBLISHABLE_KEY`, `NEXT_PUBLIC_CLERK_FRONTEND_API` (Clerk config)
- `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- `OPENAI_API_KEY` (optional for AI endpoints)
- `DATABASE_URL` / Drizzle connection vars when `FEATURE_STUDIO_DB=true`
- `FEATURE_STUDIO_DB` (toggle to use Drizzle DB vs file stores)

## Key features implemented (summary)
- StarPath Assessment funnel (intake → assessment → optional purchase via Stripe Checkout).
- Stripe Checkout + webhook flow that records `checkout.session.completed` and maps via `session.metadata.userId` when present.
- File-backed GAR and assessment stores with migration scripts to Drizzle when needed.
- Admin UI pages for intake, users, and simple content management.
- Static marketing PDFs and a small static index for downloads.

## Known problems & risks (current)
1. Git LFS / large binary handling: during an earlier push the repo complained about LFS pointer inconsistencies for a couple of `attached_assets` images. This blocked pushing straight to `main` and motivated creating a separate `deploy/replit-pdfs` branch. Action: fix LFS pointers or remove/re-add problematic files.
2. Committing generated artifacts: we modified `.gitignore` to allow `public/pdfs` and `pdfs/` into source control. This is deliberate for quick Replit static hosting but increases repo size and can complicate CI. Action: consider moving assets to object storage for production.
3. Native dependency builds: `canvas`, `better-sqlite3`, `puppeteer`/`playwright`, and `sharp` require system libs — ensure `replit.nix` (or Docker) installs them. We have many in `replit.nix`, but test builds on Replit are recommended.
4. Build performance & memory: Next.js build for this monorepo-like repo can exceed default Replit memory. Use `NODE_OPTIONS='--max-old-space-size=4096'` (already in `package.json`) and consider caching `.next` between builds or using incremental builds/CI artifacts.
5. Webhook reliability: ensure `STRIPE_WEBHOOK_SECRET` is present in deployed environment; use `stripe-cli` in local testing. Webhook handler expects `session.metadata.userId` — audit all checkout creators to confirm they set metadata.
6. Secrets in Replit: `.replit` includes default env vars in the file but production secrets must be set via Replit Secrets UI — do not commit real secrets.

## Recommended developer next actions (priority)
- Short term (days):
  1. Verify LFS image pointer issues and clean up `attached_assets/*` files that are failing LFS; push a PR to `main` when clean.
  2. Confirm Replit build by creating a Replit using branch `deploy/replit-pdfs`; run a build and observe memory/failed native builds.
  3. Add a small integration test that uses Stripe CLI to simulate checkout→webhook and validates assessment record creation.

- Medium term (weeks):
  1. Move marketing PDFs to object storage (S3) and update `public/pdfs` to be a thin index that references hosted URLs.
  2. Harden webhook handling to persist `enrollmentId`, actor, and source for audit trails.
  3. Add CI job that builds Next and runs a smoke test (smoke script exists: `npm run smoke`).

## Contacts & where to look
- Admin pages & role management: `app/teacher/*`, `app/admin/*`.
- Payment flow: `app/api/payments/route.ts` and `app/api/payments/webhook.ts`.
- Stores & migrations: `lib/gar.ts`, `lib/assessments.ts`, `scripts/migrate_headless_to_db.js`.
- Conversion script / marketing assets: `convert_html_to_pdf.sh`, `public/pdfs/`, `pdfs/`, `go4it-pdfs.zip` (repo root).
---

If you want, I can open follow-up PRs for any of the recommended items (LFS fix, Replit build test, CI smoke job). Tell me which one to prioritize next.

