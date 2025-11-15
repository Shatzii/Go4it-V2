# Headless Content LMS (Option C) — Go4it-V2

This file documents the headless content system we've added as Option C: a minimal in-app course storage and enrollment flow using Markdown files and file-backed enrollments.

What was added
- `content/courses/*.md` — course Markdown files. A sample course `sample-course.md` is included.
- `lib/content.ts` — helpers to list/read/create courses and store enrollments in `data/enrollments.json`.
- `lib/md.ts` — very small Markdown -> HTML helper for safe rendering of course content.
- API routes:
  - `GET/POST /api/academy/courses` — list courses and create new course Markdown.
  - `GET/POST /api/academy/enroll` — list enrollments and create new enrollment records.
- Pages:
  - `/academy/enroll` — student-facing enroll page (client) to pick a course and enroll with name + email.
  - `/teacher/courses` — teacher-facing page to create new Markdown course content.
  - `/academy/course/[slug]` — course view page that renders Markdown content.
  - `/student/dashboard` — simple student dashboard listing enrollments; filter by email.

How it works
- Courses are simple `.md` files in `content/courses/` and can be edited by teachers via the `/teacher/courses` page or committed to the repo.
- Enrollments are stored in `data/enrollments.json` (file-backed). For production, swap this to your database (Drizzle) and update `lib/content.ts`.
- The AI companion and other tools can remain in the app and reference these courses/enrollments.

Running locally
1. Ensure dependencies installed and dev server running:
```bash
npm install
npm run dev
```
2. Visit `/academy/enroll` to see courses and enroll.

Next steps / Production hardening
- Replace file-backed enrollments with a real DB (Drizzle/Postgres) and update `lib/content.ts`.
- Add authentication/roles (Clerk) to protect teacher pages and map students to Clerk users.
- If desired, migrate course content to a headless CMS (Sanity, Tina) for live editing.
- Add tests for API routes and add rate-limits for enroll/create endpoints.
