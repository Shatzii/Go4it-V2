# OER: Add & Publish Courses

This document explains where OER content lives and how to add new courses so they appear on the site and can be sold via Stripe Checkout.

Files & locations
- Course content: `content/oer/*.md` (Markdown files). Keep a short summary at the top and any lesson content below.
- Catalog: `content/oer/catalog.json` — a JSON array describing available courses. Each entry should include:
  - `id` (string)
  - `slug` (string)
  - `title` (string)
  - `summary` (string)
  - `price` (number, USD)
  - `contentPath` (path to the markdown file)

How the site picks up courses
- The server route `app/oer/page.tsx` reads `content/oer/catalog.json` at runtime and renders a simple listing.
- Each course renders an `EnrollButton` that POSTs to `/api/payments` with `{ productId: <slug>, price, title }` and then redirects to Stripe Checkout using the returned `url`.

Adding a new course (step-by-step)
1. Add a markdown file in `content/oer/` (e.g. `my-course.md`) with a short description and lessons.
2. Add an entry to `content/oer/catalog.json` with a unique `id` and `slug` (use hyphenated lowercase), `title`, `summary`, and `price`.
3. (Optional) If you want a dedicated course detail page, implement `app/oer/[slug]/page.tsx`. For now the enrollment flow uses the `productId` = `slug`.
4. Commit the files and push. The `app/oer` listing will show the new course automatically.

Payments mapping
- `/api/payments` should accept the `productId` (we pass `slug`) and create a Stripe Checkout session. The server attaches `metadata.userId` if provided by the frontend (Clerk user). Ensure product/price mapping on the server uses `productId` to choose price IDs or amounts.

Admin & fulfillment
- After purchase, webhook `app/api/payments/webhook.ts` records the purchase to the assessments/enrollments store. For OER courses you may want to create a lightweight enrollment record and grant dashboard access.

Notes & next improvements
- Add course detail pages for richer previews.
- Add secure file uploads (S3) for instructors to attach PDFs or lesson assets.
- Add instructor/admin UI to create courses through the admin panel instead of editing files by hand.
