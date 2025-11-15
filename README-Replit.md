# Deploying Go4it to Replit

This document describes the minimum steps to run the Go4it platform on Replit.

Add files

- `.replit` — run/build command (already added to repo).
- `replit.nix` — pins Node 20 environment.
- `.env.example` — lists environment variables you must set.

Set Replit Secrets

- Open your Replit project -> Secrets (🔒) and add the following keys (use values from your provider dashboards):
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `DATABASE_URL` (Neon/Supabase/Postgres)
  - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (if using payments)
  - `OPENAI_API_KEY` or other AI keys
  - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (if used)
  - `NEXT_PUBLIC_APP_URL` — set to your Replit URL (e.g., `https://<repl>.<username>.repl.co`)

Build & run

On Replit the project will run the command in `.replit`. Locally you can run:

```bash
npm ci
npm run build
npm run start
```

Database migrations (if using Drizzle/Postgres)

- After provisioning a Postgres DB and setting `DATABASE_URL` in Replit Secrets, run migrations (from Replit shell or locally before pushing):

```bash
npm run db:push
```

Migrate headless content (optional)

If you have headless file-backed content and want to move it into the DB, set `FEATURE_STUDIO_DB=true` in Replit Secrets and run:

```bash
NODE_ENV=production FEATURE_STUDIO_DB=true node scripts/migrate_headless_to_db.js
```

Clerk & Stripe configuration

- Add your Replit app URL to Clerk allowed origins and redirect URLs.
- Add the webhook endpoint in Stripe dashboard: `https://<repl>.<username>.repl.co/api/payments/webhook`

Troubleshooting

- If you see an error about `useUser` needing `ClerkProvider`, ensure `app/layout.tsx` includes `ClerkProvider` and that you are using a single installed version of `@clerk/*` (run `npm ls @clerk/shared`).
- If Replit's default Node is older than 20, `replit.nix` will pin Node 20.

If you want, I can also add a small helper script to verify required secrets are present at runtime and fail early with a clear message.
