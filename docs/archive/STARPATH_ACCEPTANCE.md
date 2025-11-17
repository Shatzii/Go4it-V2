# 🌟 StarPath Integration - Acceptance Checklist

## Pre-Flight Checks

### 1. Environment Setup
```bash
# Copy and configure environment variables
cp .env.example .env

# Required variables for StarPath:
NEXT_PUBLIC_FEATURE_STARPATH=true
FEATURE_STARPATH_DB=true
NEXT_PUBLIC_POSTHOG_API_KEY=phc_your_key
POSTHOG_API_KEY=phc_your_key
DATABASE_URL=file:./dev.db
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 2. Database & Migrations
```bash
# Push schema to database
npm run db:push

# Verify tables created
npm run db:studio
# Check for: starpath_student_profiles, starpath_gar_sessions, starpath_ncaa_evaluations
```

### 3. Seed Demo Data
```bash
# Generate seed file
npm run seed:starpath

# Verify seed file created
cat seeds/starpath.seed.json
```

---

## Core Tests (Run These First)

### Test 1: Type Check + Build
```bash
npm run typecheck
npm run build
```

**Expected**: No TypeScript errors, build completes successfully

**If fails**: Check for missing type imports in schema-starpath.ts or API routes

---

### Test 2: Health Checks
```bash
# Start dev server
npm run dev

# In another terminal:
curl http://0.0.0.0:3000/api/healthz
curl http://0.0.0.0:3000/api/healthz/starpath
```

**Expected responses**:
```json
// /api/healthz
{
  "ok": true,
  "status": "healthy",
  "timestamp": "2025-11-03T...",
  "services": {
    "database": "up",
    "server": "up"
  }
}

// /api/healthz/starpath
{
  "ok": true,
  "status": "healthy",
  "timestamp": "2025-11-03T...",
  "features": {
    "starpath": "enabled",
    "database": "up",
    "schema": "ready"
  }
}
```

**If fails**:
- `starpath: "disabled"` → Set `NEXT_PUBLIC_FEATURE_STARPATH=true`
- `schema: "missing"` → Run `npm run db:push`
- `status: "error"` → Check DATABASE_URL and db connection

---

### Test 3: Integrity Check
```bash
npm run integrity
```

**Expected**: All files present, exit code 0

**If fails**: Re-run file creation for missing paths

---

### Test 4: Smoke Tests
```bash
npm run smoke
```

**Expected**: All 6 tests pass
- ✅ Basic Health Check
- ✅ StarPath Health Check
- ✅ StarPath Summary
- ✅ NCAA Summary
- ✅ GAR Metrics
- ✅ Studio Today (may return empty, that's OK)

**If fails**: See smoke output for specific endpoint issues

---

## UI Acceptance Tests

### Test 5: Feature Flag Toggle
```bash
# In .env, toggle:
NEXT_PUBLIC_FEATURE_STARPATH=false

# Restart dev server
npm run dev
```

**Expected**:
- StarPath nav links hidden
- `/starpath` route returns 404 or disabled message
- No console errors about missing StarPath modules
- Rest of app functions normally

```bash
# Re-enable
NEXT_PUBLIC_FEATURE_STARPATH=true
# Restart again
```

---

### Test 6: Academy Dashboard - NCAA Integration

**Steps**:
1. Navigate to `/academy` (or `/academy/dashboard` if different route)
2. Verify tiles render:
   - **Classes** tile
   - **NCAA Core** tile (shows GPA, units, missing credits)
   - **GAR Score** tile (shows readiness score)
   - **Events** tile

**Expected NCAA Tile**:
```
NCAA Core Status
Core GPA: 2.85 / 4.0
Core Units: 12 / 16

Missing Credits:
- Math: 1 credit needed
- Additional: 2 credits needed

[Auto-plan Next Courses →]
```

**If NCAA tile shows "Loading" indefinitely**:
- Check `/api/starpath/ncaa?studentId=demo-student-1` returns valid data
- Verify Clerk auth is working (check Network tab for 401s)

**If GAR tile shows "No data"**:
- Check `/api/gar/metrics?studentId=demo-student-1` returns valid data
- Verify seed data was imported to DB

---

### Test 7: StarPath Unified Page

**Steps**:
1. Navigate to `/starpath`
2. Verify sections render:
   - **NCAA Pathway** (GPA, credits, missing requirements)
   - **GAR Analytics** (score, readiness, training load)
   - **Recent Activity** (sessions, studio completions)

**Expected**:
- All data matches seed file (`demo-student-1`)
- "Auto-plan courses" button present and clickable
- Charts/graphs render (if implemented)

---

### Test 8: GAR Analytics Page

**Steps**:
1. Navigate to `/gar`
2. Verify:
   - GAR Score: 74
   - Recent sessions list (2 sessions from seed)
   - Delta chart showing +2 speed, +1 vertical

**Expected**:
- No "undefined" or null values
- Session cards show type, duration, date

---

## API Contract Tests

### Test 9: StarPath Summary Endpoint
```bash
curl -s "http://0.0.0.0:3000/api/starpath/summary?studentId=demo-student-1" | jq
```

**Expected schema**:
```json
{
  "schemaVersion": "1.0",
  "studentId": "demo-student-1",
  "fullTimeStudent": true,
  "ncaa": {
    "status": "ready",
    "coreGPA": 2.85,
    "coreUnits": 12,
    "buckets": {
      "english": 3,
      "math": 2,
      "science": 2,
      "socialScience": 3,
      "additional": 2
    },
    "missing": [
      {"bucket": "math", "creditsNeeded": 1},
      {"bucket": "additional", "creditsNeeded": 2}
    ],
    "lastUpdated": "..."
  },
  "gar": {
    "garScore": 74,
    "lastTestAt": "...",
    "deltas": {"speed": 2, "vertical": 1},
    "readiness": 82
  },
  "timestamp": "..."
}
```

**Validation**:
- `schemaVersion` must be `"1.0"`
- `ncaa.coreGPA` is a number
- `ncaa.missing` is an array
- `gar.garScore` is between 0-100

---

### Test 10: Link Audit to Student
```bash
curl -X POST "http://0.0.0.0:3000/api/audit/link-to-student" \
  -H "Content-Type: application/json" \
  -d '{"studentId":"demo-student-1","leadId":"test-lead","evaluationId":"eval-001"}'
```

**Expected**:
```json
{
  "success": true,
  "message": "Audit evaluation linked to student",
  "evaluationId": "eval-001"
}
```

**If 401**: Needs Clerk auth header (test via authenticated UI instead)

---

## PostHog Analytics Tests

### Test 11: Client Events (UI)

**Steps**:
1. Open browser DevTools → Network tab
2. Filter for `posthog` or `capture`
3. Navigate to Academy dashboard
4. Click "NCAA Core" tile

**Expected events**:
- `ui_starpath_ncaa_tile_view` with properties:
  - `status: "ready"`
  - `coreGPA: 2.85`
  - `source: "client"`

**Verify**:
- Event name starts with `ui_`
- `distinctId` matches Clerk userId
- No duplicate events (check PostHog live view)

---

### Test 12: Server Events (State Changes)

**Steps**:
1. Trigger auto-plan courses (via UI button or API call)
2. Check PostHog live view for:
   - `svr_auto_planned_courses`
   - Properties include `studentId`, `coursesAdded`
   - `source: "server"`

**Expected**:
- Event appears in PostHog within 10 seconds
- No duplicate events
- Event name starts with `svr_`

---

## Edge Cases & Error Handling

### Test 13: Missing Student Data
```bash
curl "http://0.0.0.0:3000/api/starpath/summary?studentId=nonexistent"
```

**Expected**: 404 or empty result, no server crash

---

### Test 14: Pending Evaluation Status

**Setup**: Create evaluation with `status: "pending"`

**Expected UI**:
- NCAA tile shows "Evaluation in progress..."
- "Resume $299 Audit" CTA displayed
- No undefined/null access errors

---

### Test 15: Full-Time vs Part-Time Students

**Test**: Query with `fullTimeStudent: false`

**Expected**:
- StarPath summary still works
- Auto-sync disabled message shown
- Manual upload option available

---

## Rollback Procedure

### Disable StarPath
```bash
# In .env:
NEXT_PUBLIC_FEATURE_STARPATH=false
FEATURE_STARPATH_DB=false

# Restart server
npm run dev
```

**Expected**:
- Nav links disappear
- `/starpath` returns 404
- Academy dashboard still loads (without NCAA/GAR tiles if guarded)
- No build errors

---

### Revert Migrations (if needed)

**StarPath migrations are additive only**. To remove data:
```bash
# Delete seed data
DELETE FROM starpath_student_profiles WHERE student_id = 'demo-student-1';
DELETE FROM starpath_gar_sessions WHERE student_id = 'demo-student-1';
DELETE FROM starpath_ncaa_evaluations WHERE student_id = 'demo-student-1';
```

**To drop tables** (use cautiously):
```sql
DROP TABLE IF EXISTS starpath_student_profiles;
DROP TABLE IF EXISTS starpath_gar_sessions;
DROP TABLE IF EXISTS starpath_ncaa_evaluations;
DROP TABLE IF EXISTS starpath_auto_plan_jobs;
```

---

## Final Checklist

- [ ] All smoke tests pass
- [ ] TypeScript build succeeds
- [ ] Health checks return 200 + `ok: true`
- [ ] Academy dashboard shows NCAA + GAR tiles
- [ ] StarPath page renders with seed data
- [ ] Feature flag OFF hides StarPath without errors
- [ ] PostHog receives events with correct prefixes (ui_* / svr_*)
- [ ] No undefined/null access in console
- [ ] Nav links appear when flag enabled
- [ ] API contracts match Zod schemas in lib/types/starpath.ts

---

## Common Issues & Solutions

### Issue: "starpath_student_profiles table not found"
**Solution**: Run `npm run db:push` to create tables

### Issue: "Clerk user is undefined"
**Solution**: Ensure Clerk keys in .env, wrap routes in `auth()` check

### Issue: PostHog events duplicated
**Solution**: Check event names - client must use `ui_*`, server must use `svr_*`

### Issue: GAR metrics return null
**Solution**: Import seed data to DB, verify `demo-student-1` exists

### Issue: Build fails with module not found
**Solution**: Check import paths match file locations, run `npm install`

### Issue: Port 3000 already in use
**Solution**: Kill process on port 3000 or change to port 3001 in package.json

---

## Success Metrics

✅ **Definition of Done**:
1. All 15 acceptance tests pass
2. No TypeScript errors
3. Feature flag toggles cleanly
4. Demo student data displays correctly
5. PostHog events logged with proper prefixes
6. No console errors in browser or server
7. Rollback procedure tested and works

🎉 **You're ready for production!**
