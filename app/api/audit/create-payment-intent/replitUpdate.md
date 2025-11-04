Got it—Replit-first. Here’s a tight, **copy-paste playbook** to run Go4It OS (Next.js 15) on Replit with background jobs, payments, analytics, RSVPs, and SEO—**without breaking your current app**.

---

# Go4It OS on Replit — Production Plan

## 0) What changes vs. Vercel (TL;DR)

* **Server model:** One long-running Node app (great).
* **Background jobs:** Use a **worker process** (+ `node-cron`) or **n8n** in a second Repl.
* **ISR & P-SEO:** Use **DB-driven dynamic routes** (no runtime file writes).
* **Keep alive:** Use **Always On** + `/api/health` ping (UptimeRobot).
* **Secrets/ENV:** Set in **Replit Secrets**.
* **DB:** Use **Postgres (Neon/Supabase)** for production; keep SQLite for dev only.

Contacts used everywhere: **[info@go4itsports.org](mailto:info@go4itsports.org)** • **+1-205-434-8405** • go4itsports.org

---

## 1) One-time Replit setup

1. Import your repo → Replit.
2. In **Secrets**, add:

   * `DATABASE_URL` (Postgres), `NEXT_PUBLIC_APP_URL` (your Repl URL or custom domain),
   * `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`,
   * `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
   * `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` (e.g., [https://app.posthog.com](https://app.posthog.com)),
   * `CALCOM_API_KEY`,
   * (optional) `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `KUTT_API_KEY`.
3. Map custom domain in Replit (HTTPS included).
4. Turn on **Always On** (Hacker plan or Deployments).

---

## 2) Add/replace these files

### A) `.replit`

```ini
run = "npm run start:all"

[env]
NODE_ENV = "production"
PORT = "3000"

[[ports]]
localPort = 3000
external = true
```

### B) `replit.nix`

```nix
{ pkgs }:
{
  deps = [
    pkgs.nodejs_20
    pkgs.yarn
    pkgs.python3
    pkgs.vips
    pkgs.pkg-config
    pkgs.openssl
    pkgs.git
  ];
}
```

> Ensures Next/Image (sharp) builds, and node-gyp has what it needs.

### C) `package.json` (scripts & deps)

Add deps:

```bash
npm i concurrently node-cron posthog-js
```

Add/merge scripts:

```json
{
  "scripts": {
    "dev": "concurrently \"next dev -p $PORT\" \"node worker.js\"",
    "build": "next build",
    "start:web": "next start -p $PORT",
    "start:worker": "node worker.js",
    "start:all": "concurrently \"npm run start:web\" \"npm run start:worker\"",
    "db:push": "drizzle-kit push:pg",
    "db:studio": "drizzle-kit studio",
    "type-check": "tsc --noEmit",
    "lint": "next lint"
  }
}
```

### D) `worker.js` (cron + webhooks pings)

```js
// worker.js
import cron from 'node-cron';
const APP = process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${process.env.PORT || 3000}`;

// health log
console.log("🧰 Worker online. Scheduling jobs…");

// Every 5 min: send reminders if a Parent/Decision Night is near
cron.schedule('*/5 * * * *', async () => {
  try {
    await fetch(`${APP}/api/cron/event-reminders`, { method: 'POST' });
    await fetch(`${APP}/api/cron/lead-scoring`, { method: 'POST' });
  } catch (e) { console.error('cron 5m error', e); }
});

// Mon 2am: generate/refresh P-SEO rows from n8n or internal planner
cron.schedule('0 2 * * 1', async () => {
  try {
    await fetch(`${APP}/api/pseo/refresh`, { method: 'POST' });
  } catch (e) { console.error('P-SEO refresh error', e); }
});

// 10 min: keep-alive self ping
cron.schedule('*/10 * * * *', async () => {
  try { await fetch(`${APP}/api/health`); } catch {}
});
```

### E) Health endpoint (keep-alive)

`app/api/health/route.ts`

```ts
export async function GET() {
  return new Response(JSON.stringify({ ok: true, ts: Date.now() }), {
    headers: { "content-type": "application/json" }
  });
}
```

### F) Dynamic P-SEO (no file writes)

Create a DB-driven catch-all page: `app/academy/[...slug]/page.tsx`

```tsx
import { db } from "@/lib/db";
import { pseoPages } from "@/lib/db/schema"; // your table
import { eq } from "drizzle-orm";

export default async function PseoPage({ params }: { params: { slug: string[] } }) {
  const slug = `/academy/${params.slug.join('/')}`;
  const row = await db.select().from(pseoPages).where(eq(pseoPages.slug, slug)).get();
  if (!row) return <div className="p-8 text-white">Not found</div>;

  return (
    <main className="max-w-5xl mx-auto p-8 text-[#E6EAF0]">
      <h1 className="text-4xl font-bold uppercase">NCAA Pathway — {row.sport} in {row.city}, {row.country} ({row.gradYear})</h1>
      <p className="mt-4 text-lg">Train Here. Place Anywhere. Verification ≠ recruitment.</p>
      {/* render sections from row.content (MDX/HTML-safe) */}
      <section className="mt-8" dangerouslySetInnerHTML={{ __html: row.html ?? "" }} />
    </main>
  );
}
```

Add endpoints to **upsert** P-SEO rows: `app/api/pseo/refresh` (called by `worker.js` or **n8n**).

---

## 3) Background automation on Replit

You have 3 options:

1. **Built-in worker** (above): Simple cron using `node-cron`.
2. **Second Repl** running **n8n** (recommended for complex workflows).
3. **External n8n Cloud / Railway** if you want zero ops on Replit.

**What to automate:**

* Tue/Thu Parent Night reminders (T-24h, T-2h, T-30m)
* Tue→Thu “short-circuit” SMS/email
* $299 Audit dunning (3 retries)
* Lead scoring decay (−10 after 7d inactivity)
* Weekly P-SEO target generation
* PostHog cohort sync exports (ads audiences)

---

## 4) Stripe, Clerk, Cal.com on Replit

* **Stripe webhooks:** expose `POST /api/stripe/webhook`. In Stripe CLI:

  ```bash
  stripe listen --forward-to <your-repl-domain>/api/stripe/webhook
  ```
* **Clerk:** set publishable/secret keys in Secrets; your existing `(auth)` pages work unchanged.
* **Cal.com:** embed booking on `/parent-night` + set `CALCOM_API_KEY` for webhooks → your RSVP flow.

---

## 5) Persistence & uploads

* **DB:** Use Postgres (**Neon/Supabase**). Update `drizzle.config.ts` to point to `DATABASE_URL`.
* **Storage:** Supabase Storage or S3-compatible bucket for athlete docs & images.
* **Images:** Next/Image fine on Replit.

---

## 6) Replace “Vercel Cron/ISR” with Replit-safe patterns

* **Cron:** handled by `worker.js` (node-cron) or n8n.
* **Revalidation:** your P-SEO page pulls **fresh DB content** per request; cache in **Redis** (optional) or use `s-maxage` headers via a tiny in-process cache.

---

## 7) Analytics/observability

* **PostHog:** client & server events (as in your brief).
* **Ping:** Add UptimeRobot to `https://<your-repl>/api/health` (1–5 min).
* **Logs:** Replit console + your existing Winston logger.
* **KPIs:** Keep your Friday dashboard page—no changes needed.

---

## 8) Performance on Replit

* Build once (`npm run build`) → Replit runs `next start`.
* **Images:** AVIF/WEBP, hero ≤ 200KB.
* **Bundle:** Disable unused analytics on routes with `next/dynamic`.
* **Node flags:** If needed: `"start:web": "NODE_OPTIONS=--max-old-space-size=512 next start -p $PORT"`.

---

## 9) Security & compliance quick guards

* Inject the **truth-in-marketing footer** on pages/emails touching academics/eligibility.
* Add a **COPPA gate** on RSVP (under-13 flag already in the RSVP form you implemented).
* Verify **Stripe/Cal.com** webhook signatures server-side.

---

## 10) “Do this now” checklist (copy-paste)

1. Add **.replit**, **replit.nix**, **worker.js**, **/api/health**.
2. Set Secrets (Stripe, Clerk, PostHog, Cal, DB, email, SMS).
3. Switch Drizzle to Postgres in prod, run:

   ```bash
   npm run db:push
   ```
4. Start:

   ```bash
   npm run build
   npm run start:all
   ```
5. Set **UptimeRobot** to ping `/api/health`.
6. Test flows:

   * RSVP → receives emails/SMS → ICS works
   * Stripe $299 → webhook → lead.stage = `audit_booked`
   * Tue/Thu reminders fire (watch worker logs)

---

## 11) Nice-to-have (still Replit-friendly)

* **Shortlinks**: `/api/shortlink` → Kutt.it API for SMS-friendly links.
* **Programmatic SEO**: Build MDX via GitHub Action and push to DB (no file writes).
* **Coach/Club portal**: stays the same—just ensure CSV uploads go to Supabase Storage.

---

## 12) “Replit-native” starter snippets

**Cron endpoints** (the worker calls them):

```ts
// app/api/cron/event-reminders/route.ts
export async function POST() {
  // 1) query upcoming events in next 24h
  // 2) get registrations
  // 3) send Listmonk/Resend emails + Twilio SMS
  // 4) post PostHog events
  return new Response(JSON.stringify({ ok: true }));
}

// app/api/cron/lead-scoring/route.ts
export async function POST() {
  // Apply score decay to “inactive > 7d”
  return new Response(JSON.stringify({ ok: true }));
}
```

**Stripe webhook** (unchanged logic; just reachable on Replit):

```ts
// app/api/stripe/webhook/route.ts
import Stripe from 'stripe';
export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!;
  const buf = Buffer.from(await req.arrayBuffer());
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2023-10-16" });
  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) { return new Response("Signature error", { status: 400 }); }

  // handle payment_intent.succeeded → mark audit_booked / audit_paid
  return new Response("ok");
}
```

---

### Bottom line

* Replit can run **Next.js + API routes + a background worker** just fine.
* Replace “serverless” assumptions (Vercel) with **cron worker + DB-driven pages**.
* You keep **all** your funnel features (RSVP → Decision Night → $299 Audit → Apply → Enroll) and the dashboard intact—now Replit-native.

If you want, I can package this as a single PR (adds the files, scripts, and minimal APIs) so you can drop it into your Repl and hit **Run**.
