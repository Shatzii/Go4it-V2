# StarPath v2 - Production Acceptance Tests

## Quick Validation (5 minutes)

```bash
# 1. Type check
npm run typecheck

# 2. Build
npm run build

# 3. Database migration
npm run db:push

# 4. Seed data
npm run seed:starpath

# 5. Start dev server
npm run dev &

# 6. Wait for server
sleep 5

# 7. Integrity check
npm run integrity

# 8. Smoke tests
npm run smoke
```

---

## Detailed Test Cases

### 1. Health Checks ✅

**Test**: Basic application health
```bash
curl http://0.0.0.0:3000/api/healthz
```
**Expected**: `{ "ok": true, "timestamp": "..." }`

**Test**: StarPath feature health
```bash
curl http://0.0.0.0:3000/api/healthz/starpath
```
**Expected**: 
```json
{
  "ok": true,
  "checks": {
    "database": "ok",
    "schema": "ok"
  },
  "timestamp": "..."
}
```

---

### 2. Feature Flag Toggle ✅

**Test**: Feature OFF
```bash
# .env: NEXT_PUBLIC_FEATURE_STARPATH=false
npm run build
# Navigate to /academy/dashboard
```
**Expected**: No StarPath tile visible, no console errors

**Test**: Feature ON
```bash
# .env: NEXT_PUBLIC_FEATURE_STARPATH=true
npm run build
# Navigate to /academy/dashboard
```
**Expected**: StarPath tile renders with NCAA + GAR data

---

### 3. Event Check-in Flow ✅

**Test**: Staff checks in athlete
```bash
curl -X POST http://0.0.0.0:3000/api/event/checkin \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <STAFF_CLERK_TOKEN>' \
  -d '{
    "eventId": "event-co-2025-11-16",
    "userId": "demo-student-1",
    "wave": "AM"
  }'
```
**Expected**:
```json
{
  "success": true,
  "sessionId": "uuid",
  "registrationId": "uuid",
  "message": "Athlete checked in successfully"
}
```

**Verify**:
- Registration status = "checked_in"
- GAR session created with duration=0
- PostHog event `svr_event_checked_in` logged
- Audit log entry created

---

### 4. GAR Bulk Upload ✅

**Test**: Upload 5 metrics for session
```bash
curl -X POST http://0.0.0.0:3000/api/event/results/upload \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <STAFF_CLERK_TOKEN>' \
  -d '{
    "sessionId": "<SESSION_UUID>",
    "duration": 45,
    "metrics": [
      { "metric": "speed_40yd", "value": 4.85, "units": "s" },
      { "metric": "vertical", "value": 28, "units": "in", "percentile": 82 },
      { "metric": "pro_agility", "value": 4.32, "units": "s", "percentile": 75 },
      { "metric": "broad", "value": 98, "units": "in", "percentile": 80 },
      { "metric": "mobility_fms", "value": 15, "units": "score", "percentile": 70 }
    ],
    "verifiedBy": "staff-user-id"
  }'
```
**Expected**:
```json
{
  "success": true,
  "sessionId": "uuid",
  "metricsUploaded": 5,
  "message": "Results uploaded successfully"
}
```

**Verify**:
- 5 rows in `starpath_gar_metrics`
- Session duration updated to 45
- Metrics have `verified=true`, `verified_by` set
- PostHog event `svr_gar_batch_uploaded` with `metricsCount=5`

---

### 5. StarPath Summary with ETag ✅

**Test**: First request (200 + ETag)
```bash
curl -i http://0.0.0.0:3000/api/starpath/summary?studentId=demo-student-1 \
  -H 'Authorization: Bearer <CLERK_TOKEN>'
```
**Expected**:
- Status: 200
- Headers: `ETag: "sp-demo-student-1-..."`, `Cache-Control: private, max-age=60`
- Body: Full summary with `nba[]` array

**Test**: Second request with If-None-Match (304)
```bash
curl -i http://0.0.0.0:3000/api/starpath/summary?studentId=demo-student-1 \
  -H 'Authorization: Bearer <CLERK_TOKEN>' \
  -H 'If-None-Match: "sp-demo-student-1-..."'
```
**Expected**:
- Status: 304
- No body
- Headers: `ETag: "sp-demo-student-1-..."`

---

### 6. Next Best Actions (NBA) ✅

**Test**: Student with no audit
```bash
curl http://0.0.0.0:3000/api/starpath/summary?studentId=student-no-audit \
  -H 'Authorization: Bearer <CLERK_TOKEN>'
```
**Expected**: `nba[]` contains:
```json
{
  "id": "book-audit",
  "priority": "high",
  "title": "Get NCAA Eligibility Report",
  "cta": "Book $299 Audit",
  "ctaUrl": "/audit/book"
}
```

**Test**: Student with missing credits
```bash
curl http://0.0.0.0:3000/api/starpath/summary?studentId=demo-student-1 \
  -H 'Authorization: Bearer <CLERK_TOKEN>'
```
**Expected**: `nba[]` contains:
```json
{
  "id": "complete-missing-credits",
  "priority": "high",
  "title": "Complete math Credits",
  "cta": "Auto-Plan Courses",
  "ctaUrl": "/academy/plan?target=math"
}
```

---

### 7. Event Context (QR Code Flow) ✅

**Test**: Summary from event QR
```bash
curl http://0.0.0.0:3000/api/starpath/summary?studentId=demo-student-1&eventId=event-co-2025-11-16 \
  -H 'Authorization: Bearer <CLERK_TOKEN>'
```
**Expected**: Response includes:
```json
{
  "eventContext": {
    "eventId": "event-co-2025-11-16",
    "registrationId": "uuid",
    "checkedIn": true,
    "proPack": false,
    "auditAddon": false
  },
  "nba": [
    {
      "id": "add-audit-addon",
      "priority": "medium",
      "title": "Add NCAA Audit to Event",
      "cta": "Add Audit",
      "ctaUrl": "/event/event-co-2025-11-16/upgrade"
    }
  ]
}
```

---

### 8. Audit Link Idempotency ✅

**Test**: Link evaluation twice
```bash
curl -X POST http://0.0.0.0:3000/api/audit/link-to-student \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <CLERK_TOKEN>' \
  -d '{ "studentId": "demo-student-1", "leadId": "lead-123", "evaluationId": "eval-001" }'

curl -X POST http://0.0.0.0:3000/api/audit/link-to-student \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <CLERK_TOKEN>' \
  -d '{ "studentId": "demo-student-1", "leadId": "lead-123", "evaluationId": "eval-001" }'
```
**Expected**:
- Both return 200
- Only 1 row in `starpath_lead_links`
- Only 1 audit log entry

---

### 9. RBAC (Role-Based Access) ✅

**Test**: Parent views student summary
```bash
curl http://0.0.0.0:3000/api/starpath/summary?studentId=student-123 \
  -H 'Authorization: Bearer <PARENT_CLERK_TOKEN>'
```
**Expected**: 200 + full summary (if parent linked to student via `starpath_memberships`)

**Test**: Coach views roster aggregate
```bash
curl http://0.0.0.0:3000/api/academy/roster?orgId=org-go4it-internal \
  -H 'Authorization: Bearer <COACH_CLERK_TOKEN>'
```
**Expected**: List of students with summary data (no PII unless authorized)

---

### 10. Consent Gates ✅

**Test**: Kiosk photo capture without consent
```bash
curl -X POST http://0.0.0.0:3000/api/event/consent/check \
  -H 'Content-Type: application/json' \
  -d '{ "userId": "demo-student-1", "kind": "recording" }'
```
**Expected**:
```json
{
  "granted": false,
  "message": "Consent required for recording"
}
```

**Test**: Grant consent
```bash
curl -X POST http://0.0.0.0:3000/api/event/consent/grant \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <CLERK_TOKEN>' \
  -d '{
    "userId": "demo-student-1",
    "kind": "recording",
    "granted": true,
    "version": "1.0"
  }'
```
**Expected**: 200 + consent record created

---

### 11. Event Summary (Operations Dashboard) ✅

**Test**: Staff views event stats
```bash
curl http://0.0.0.0:3000/api/event/summary?eventId=event-co-2025-11-16 \
  -H 'Authorization: Bearer <STAFF_CLERK_TOKEN>'
```
**Expected**:
```json
{
  "event": { "id": "...", "name": "Colorado Combine", "status": "open" },
  "stats": {
    "totalRegistrations": 45,
    "checkedIn": 38,
    "noShow": 2,
    "sessionsCompleted": 35,
    "completionRate": 92.1
  },
  "revenue": {
    "total": 446100,
    "proPack": 15,
    "auditAddon": 12,
    "auditAttachRate": 26.7,
    "proPackAttachRate": 33.3
  },
  "topPerformers": [
    { "userId": "...", "metric": "vertical", "value": 34, "units": "in" }
  ]
}
```

---

### 12. PostHog Analytics Validation ✅

**Test**: Client event deduplication
```typescript
// In browser console
posthog.capture('ui_starpath_tile_click', { tile: 'NCAA', userId: 'demo-student-1' });
```
**Expected**: Single event in PostHog with prefix `ui_`

**Test**: Server event
```bash
# Trigger any server action (e.g., checkin, link audit)
```
**Expected**: Event in PostHog with:
- Prefix `svr_`
- Property `source: "server"`
- Correct `distinct_id` (user ID, not session ID)

---

### 13. Performance Budget ✅

**Test**: Dashboard load time
```bash
curl -o /dev/null -s -w '%{time_total}\n' \
  http://0.0.0.0:3000/academy/dashboard
```
**Expected**: < 2s on Replit dev, < 1.5s on prod

**Test**: Summary API response time
```bash
curl -o /dev/null -s -w '%{time_total}\n' \
  http://0.0.0.0:3000/api/starpath/summary?studentId=demo-student-1
```
**Expected**: < 500ms

---

### 14. Error Handling ✅

**Test**: Invalid student ID
```bash
curl http://0.0.0.0:3000/api/starpath/summary?studentId=invalid \
  -H 'Authorization: Bearer <CLERK_TOKEN>'
```
**Expected**: 404 or empty data (no 500 error)

**Test**: Missing auth
```bash
curl http://0.0.0.0:3000/api/starpath/summary?studentId=demo-student-1
```
**Expected**: 401 Unauthorized

---

### 15. Rollback Verification ✅

**Test**: Disable feature flag
```bash
# .env: NEXT_PUBLIC_FEATURE_STARPATH=false
npm run build
npm start
```
**Expected**:
- App starts without errors
- /academy/dashboard renders (no StarPath tile)
- No broken imports or 404s
- Health checks still pass

---

## Acceptance Criteria Summary

✅ **Ready for Production** when:
1. All 15 test cases pass
2. Type check completes with no errors
3. Build succeeds (no warnings)
4. ETag caching works (304 responses)
5. Event Mode flow complete (checkin → upload → summary)
6. RBAC enforced (parents/coaches see correct data)
7. PostHog events logged correctly (no duplicates, correct prefixes)
8. Consent gates block unauthorized actions
9. Performance < 2s dashboard, < 500ms API
10. Rollback works (feature flag OFF = no errors)

---

## Next Steps After Acceptance

1. **Production database**: Migrate from SQLite to Postgres
2. **Sentry**: Enable error tracking
3. **Backups**: Configure automated Postgres backups
4. **CDN**: Serve GetVerified™ page via CDN
5. **Monitoring**: Set up PostHog dashboards for event ops
6. **Documentation**: Update runbook for event staff

---

**Last Updated**: November 3, 2025  
**Version**: StarPath v2.0 (Production Hardened)
