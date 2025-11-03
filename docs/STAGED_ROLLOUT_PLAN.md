# Go4It Site Upgrade - Staged Rollout Plan

## Executive Summary

**Rollout Duration**: 4 weeks  
**Strategy**: Incremental feature enablement with monitoring gates  
**Risk Level**: Low (rollback capability via feature flags)  
**Success Criteria**: <1% error rate, <500ms API response time, positive user feedback

---

## Pre-Deployment Checklist

### Database Preparation
- [x] Run `npm run db:push` to create new tables
- [ ] Verify tables exist: `studyHall`, `ncaaChecklist`, `garScores`
- [ ] Set up database backups (daily snapshots)
- [ ] Test database connection from production environment
- [ ] Configure connection pooling (recommended: 10-20 connections)

### Clerk Authentication
- [ ] Configure Public Metadata schema for `role` field
- [ ] Assign roles to existing users (see `docs/CLERK_RBAC_SETUP.md`)
- [ ] Set up webhook for auto-role assignment on signup
- [ ] Test RBAC guards with student/coach/admin accounts
- [ ] Verify Clerk keys in production `.env.local`

### Code Deployment
- [ ] Merge feature branch to `main`
- [ ] Deploy to staging environment first
- [ ] Run API test suite: `./scripts/test-apis.sh https://staging.go4it.com`
- [ ] Verify all tests pass (15/15)
- [ ] Deploy to production
- [ ] Verify deployment health check

### Monitoring Setup
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Configure API response time alerts (>500ms threshold)
- [ ] Set up uptime monitoring (Pingdom, UptimeRobot)
- [ ] Create dashboard for key metrics (Grafana, Datadog)
- [ ] Set up Slack/email alerts for critical errors

---

## Week 1: Backend APIs Only (Low Risk)

### What to Enable
```env
# .env.local
NEXT_PUBLIC_FLAG_STUDY_HALL=true
NEXT_PUBLIC_FLAG_NCAA_TRACKER=true
NEXT_PUBLIC_FLAG_GAR_INTEGRATION=true

# Keep disabled
NEXT_PUBLIC_FLAG_DASHBOARD_V2=false
NEXT_PUBLIC_FLAG_NEW_HERO=false
NEXT_PUBLIC_FLAG_HUB_SECTION=false
```

### Features Enabled
✅ **Study Hall API** (`/api/study`)
- Students can log study sessions via API
- Streak calculation active
- No UI changes (API-only)

✅ **NCAA Checklist API** (`/api/ncaa`)
- Auto-initializes 8 default checklist items on first access
- Students can add/update/delete custom items
- No UI changes (API-only)

✅ **GAR Scores API** (`/api/gar`, `/api/gar/latest`)
- Students can POST new GAR scores
- Latest score with breakdowns available
- No UI changes (API-only)

### Monitoring Metrics

**API Performance** (Check daily):
| Endpoint | Target Response Time | Target Success Rate |
|----------|---------------------|-------------------|
| `POST /api/study` | <200ms | >99% |
| `GET /api/study` | <300ms | >99% |
| `GET /api/ncaa` | <400ms | >99% |
| `POST /api/ncaa` | <200ms | >99% |
| `POST /api/gar` | <250ms | >99% |
| `GET /api/gar/latest` | <300ms | >99% |

**Database Queries**:
- Monitor connection pool usage (<80% capacity)
- Check slow query log (>500ms queries)
- Verify no connection leaks

**Error Tracking**:
- Zod validation errors (expected for bad input, should be <5% of requests)
- Database errors (should be 0%)
- Authentication errors (acceptable if users not logged in)

### Testing Tasks

**Day 1-2: Smoke Testing**
- [ ] Test each API endpoint manually with Postman/curl
- [ ] Verify database records created correctly
- [ ] Check error responses for invalid data (400 status)
- [ ] Test with multiple concurrent requests (simulate 10 users)

**Day 3-4: Integration Testing**
- [ ] Run full test suite: `./scripts/test-apis.sh`
- [ ] Test with real user accounts (student role)
- [ ] Verify NCAA auto-initialization works
- [ ] Test study streak calculation accuracy
- [ ] Verify GAR breakdown calculations correct

**Day 5-7: Monitoring & Optimization**
- [ ] Review error logs daily
- [ ] Optimize slow queries (if any)
- [ ] Check database indexes (add if needed)
- [ ] Monitor API usage patterns
- [ ] Gather baseline metrics for Week 2

### Success Criteria (Required to proceed to Week 2)
- ✅ All API endpoints respond in <500ms (95th percentile)
- ✅ Error rate <1% (excluding expected validation errors)
- ✅ Zero database connection errors
- ✅ NCAA auto-initialization working for 100% of new students
- ✅ Study streak calculation accurate over 7-day period

### Rollback Procedure (If issues arise)
```bash
# Disable all Week 1 flags immediately
NEXT_PUBLIC_FLAG_STUDY_HALL=false
NEXT_PUBLIC_FLAG_NCAA_TRACKER=false
NEXT_PUBLIC_FLAG_GAR_INTEGRATION=false

# Redeploy
npm run build && npm run deploy
```

---

## Week 2: Dashboard V2 with Real-Time Data (Medium Risk)

### Prerequisites
- ✅ Week 1 success criteria met
- ✅ APIs stable for 7 consecutive days
- ✅ No critical errors in production logs

### What to Enable
```env
# .env.local (add to Week 1 flags)
NEXT_PUBLIC_FLAG_DASHBOARD_V2=true
```

### Features Enabled
✅ **Dashboard Tiles Component**
- Real-time data from Study Hall, NCAA, GAR APIs
- SWR auto-refresh (30s-5min intervals)
- Quick-log study buttons (+30m, +45m, +60m)
- NCAA checklist completion percentage
- GAR latest score with star rating

### Monitoring Metrics

**Client-Side Performance** (Check daily):
| Metric | Target | Tool |
|--------|--------|------|
| Initial page load | <2s | Lighthouse |
| Time to Interactive | <3s | Lighthouse |
| SWR cache hit rate | >80% | Browser DevTools |
| API calls per session | <20 | Analytics |

**User Engagement** (Check weekly):
- Study Hall: % of students logging sessions
- NCAA Tracker: Avg completion rate
- GAR Scores: % of students with scores
- Dashboard views: Daily active users

**Error Tracking**:
- SWR fetch failures (should be <0.5%)
- Hydration errors (should be 0%)
- Component render errors (should be 0%)

### Testing Tasks

**Day 1-2: Component Testing**
- [ ] Verify Dashboard Tiles render correctly
- [ ] Test SWR data fetching (check Network tab)
- [ ] Click +30m/45m/60m buttons, verify POST to `/api/study`
- [ ] Verify study streak updates after logging session
- [ ] Test NCAA completion percentage calculation
- [ ] Verify GAR stars display correctly (1-5 stars)

**Day 3-4: User Acceptance Testing**
- [ ] Recruit 5-10 beta testers (students with different roles)
- [ ] Gather feedback on UI/UX
- [ ] Test on different devices (mobile, tablet, desktop)
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Verify accessibility (screen reader compatibility)

**Day 5-7: Performance Optimization**
- [ ] Analyze SWR cache patterns
- [ ] Optimize refresh intervals if needed
- [ ] Check for unnecessary re-renders
- [ ] Profile component performance (React DevTools)
- [ ] Monitor bundle size (should be <200KB for dashboard)

### Success Criteria (Required to proceed to Week 3)
- ✅ Dashboard loads in <2s (95th percentile)
- ✅ SWR fetch success rate >99.5%
- ✅ Zero hydration errors
- ✅ Positive user feedback (>80% satisfaction)
- ✅ At least 20% of active students using study log feature

### Rollback Procedure
```bash
# Disable Dashboard V2 only (keep Week 1 flags)
NEXT_PUBLIC_FLAG_DASHBOARD_V2=false

# Redeploy
npm run build && npm run deploy

# APIs remain active, users just see old dashboard
```

---

## Week 3: New Hero Section (Low Risk, High Visibility)

### Prerequisites
- ✅ Week 2 success criteria met
- ✅ Dashboard V2 stable for 7 consecutive days
- ✅ Content review completed (marketing team approval)

### What to Enable
```env
# .env.local (add to Week 1-2 flags)
NEXT_PUBLIC_FLAG_NEW_HERO=true
```

### Features Enabled
✅ **HeroNew Component**
- Modern hero section with gradient text
- Content from centralized `/content/go4it.ts`
- CTA tracking via `data-cta` attributes
- Stats badges (NCAA, Classes, GAR)
- Responsive design (mobile-first)

### Content Review Checklist
- [ ] Marketing team approves hero copy
- [ ] Legal reviews claims ("40% higher recruiter responses")
- [ ] Design team approves visual layout
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] SEO team reviews title/description

### Monitoring Metrics

**Conversion Tracking** (Check daily):
| CTA | Current Rate | Target Rate | Change |
|-----|-------------|-------------|--------|
| "Start Free Trial" | X% | +10% | TBD |
| "Watch Demo" | X% | +5% | TBD |
| "Learn More" | X% | +5% | TBD |

**A/B Testing Setup** (Optional):
- Split traffic 50/50 between NEW_HERO (true/false)
- Track conversion rates for each variant
- Run for 7 days minimum (statistical significance)
- Choose winning variant based on data

**SEO Metrics**:
- Core Web Vitals (LCP <2.5s, FID <100ms, CLS <0.1)
- Mobile-friendliness score (Google Search Console)
- Structured data validation (schema.org)

### Testing Tasks

**Day 1-2: Visual Testing**
- [ ] Verify hero renders on landing page
- [ ] Test gradient text appearance (cross-browser)
- [ ] Verify CTA buttons clickable and styled correctly
- [ ] Test responsive layout (mobile, tablet, desktop)
- [ ] Check stats badges display correctly

**Day 3-4: Analytics Integration**
- [ ] Verify `data-cta` attributes present on all CTAs
- [ ] Set up analytics event tracking (Google Analytics, PostHog)
- [ ] Test CTA click tracking in analytics dashboard
- [ ] Set up conversion goals
- [ ] Create analytics report template

**Day 5-7: Optimization & Monitoring**
- [ ] Analyze CTA click patterns
- [ ] Compare conversion rates to legacy hero (if A/B testing)
- [ ] Gather user feedback on messaging
- [ ] Optimize copy if needed (coordinate with marketing)
- [ ] Monitor bounce rate (should not increase)

### Success Criteria (Required to proceed to Week 4)
- ✅ Hero loads with no visual glitches
- ✅ CTA click tracking working in analytics
- ✅ Conversion rates stable or improved vs. legacy hero
- ✅ Core Web Vitals pass (all metrics in green)
- ✅ No increase in bounce rate

### Rollback Procedure
```bash
# Disable New Hero only (revert to legacy hero)
NEXT_PUBLIC_FLAG_NEW_HERO=false

# Redeploy
npm run build && npm run deploy

# Legacy hero displays immediately, no data loss
```

---

## Week 4: Hub Section - Full Rollout (Low Risk)

### Prerequisites
- ✅ Week 3 success criteria met
- ✅ New Hero stable for 7 consecutive days
- ✅ All previous features performing well

### What to Enable
```env
# .env.local (full rollout)
NEXT_PUBLIC_FLAG_STUDY_HALL=true
NEXT_PUBLIC_FLAG_NCAA_TRACKER=true
NEXT_PUBLIC_FLAG_GAR_INTEGRATION=true
NEXT_PUBLIC_FLAG_DASHBOARD_V2=true
NEXT_PUBLIC_FLAG_NEW_HERO=true
NEXT_PUBLIC_FLAG_HUB_SECTION=true  # NEW
```

### Features Enabled
✅ **Hub Component**
- "Everything In One Place" section on landing page
- Three-column grid (NCAA, Classes, Athlete Development)
- Icons (Shield, BookOpen, Trophy)
- 2 CTAs with tracking
- Responsive grid layout

### Monitoring Metrics

**Engagement Tracking** (Check daily):
- Hub section scroll rate (% of visitors who scroll to Hub)
- CTA clicks from Hub section
- Time spent on page (should increase)
- Conversion rate from landing page → dashboard

**User Journey Analysis**:
- Track: Landing Page → Hub CTA → Dashboard
- Identify drop-off points
- Compare to previous funnel (without Hub)

### Testing Tasks

**Day 1-2: Integration Testing**
- [ ] Verify Hub renders below Hero on landing page
- [ ] Test three-column grid layout
- [ ] Verify icons display (Shield, BookOpen, Trophy)
- [ ] Test CTA buttons link correctly
- [ ] Check responsive grid on mobile/tablet

**Day 3-4: Final UAT (User Acceptance Testing)**
- [ ] Recruit 10-20 users for full site walkthrough
- [ ] Test complete user journey: Landing → Sign Up → Dashboard
- [ ] Gather feedback on overall experience
- [ ] Identify any friction points
- [ ] Document feature requests for future iterations

**Day 5-7: Full System Monitoring**
- [ ] Monitor all APIs simultaneously under full load
- [ ] Check database performance (connection pool, query times)
- [ ] Review error logs across all components
- [ ] Analyze user feedback from Week 4
- [ ] Prepare final rollout report

### Success Criteria (Full Rollout Complete)
- ✅ Hub section loads without performance degradation
- ✅ All 7 feature flags stable simultaneously
- ✅ Error rate <1% across all features
- ✅ Positive user feedback (>85% satisfaction)
- ✅ Key metrics improved or stable vs. baseline

### Post-Rollout Tasks
- [ ] Document lessons learned
- [ ] Update team on rollout success
- [ ] Plan next iteration features
- [ ] Archive feature flags (consider making permanent)
- [ ] Celebrate with team! 🎉

---

## Emergency Rollback Procedures

### Scenario 1: API Errors Spike (>5%)
**Symptoms**: Error tracking shows >5% error rate on any API endpoint

**Immediate Actions**:
1. Disable problematic API flag:
   ```bash
   NEXT_PUBLIC_FLAG_STUDY_HALL=false  # If Study Hall API failing
   # OR
   NEXT_PUBLIC_FLAG_NCAA_TRACKER=false  # If NCAA API failing
   # OR
   NEXT_PUBLIC_FLAG_GAR_INTEGRATION=false  # If GAR API failing
   ```
2. Redeploy: `npm run build && vercel --prod`
3. Investigate database connection pool
4. Check for slow queries (>1s)
5. Review error logs for patterns

**Root Cause Analysis**:
- Database connection exhaustion?
- Query timeout issues?
- Zod validation too strict?
- Authentication middleware failing?

### Scenario 2: Dashboard Performance Degradation
**Symptoms**: Dashboard loads in >5s, users reporting slowness

**Immediate Actions**:
1. Disable Dashboard V2:
   ```bash
   NEXT_PUBLIC_FLAG_DASHBOARD_V2=false
   ```
2. Redeploy: `npm run build && vercel --prod`
3. Analyze SWR cache patterns
4. Check API response times
5. Profile component rendering (React DevTools)

**Root Cause Analysis**:
- Too many SWR requests?
- Slow API responses?
- Unnecessary re-renders?
- Large bundle size?

### Scenario 3: Database Connection Pool Exhausted
**Symptoms**: "Too many connections" errors in logs

**Immediate Actions**:
1. Disable all API flags temporarily:
   ```bash
   NEXT_PUBLIC_FLAG_STUDY_HALL=false
   NEXT_PUBLIC_FLAG_NCAA_TRACKER=false
   NEXT_PUBLIC_FLAG_GAR_INTEGRATION=false
   NEXT_PUBLIC_FLAG_DASHBOARD_V2=false
   ```
2. Redeploy immediately
3. Increase connection pool size in `drizzle.config.ts`
4. Check for connection leaks (missing `.finally()` in API routes)
5. Re-enable flags one-by-one after fix

**Prevention**:
- Always use `try/catch/finally` in API routes
- Close database connections in `finally` blocks
- Set connection pool max to 20-30 for production

### Scenario 4: User Role Issues (RBAC Failures)
**Symptoms**: Students can't access dashboard, 403 errors

**Immediate Actions**:
1. Check Clerk Dashboard → Users → Public Metadata
2. Verify users have `role` field set
3. Run migration script if needed:
   ```bash
   npx tsx scripts/migrate-user-roles.ts
   ```
4. Force Clerk session refresh for affected users

**Root Cause Analysis**:
- Clerk Public Metadata schema not configured?
- Webhook not firing on user signup?
- `requireRole()` guard too restrictive?

### Scenario 5: Complete System Failure
**Symptoms**: Multiple errors, site down, panic mode

**Nuclear Option** (Disable everything):
```bash
# .env.local - Full rollback to legacy site
NEXT_PUBLIC_FLAG_STUDY_HALL=false
NEXT_PUBLIC_FLAG_NCAA_TRACKER=false
NEXT_PUBLIC_FLAG_GAR_INTEGRATION=false
NEXT_PUBLIC_FLAG_DASHBOARD_V2=false
NEXT_PUBLIC_FLAG_NEW_HERO=false
NEXT_PUBLIC_FLAG_HUB_SECTION=false

# Redeploy immediately
npm run build && vercel --prod
```

**Post-Mortem**:
1. Document what went wrong
2. Identify root cause
3. Create fix in staging environment
4. Test thoroughly before re-enabling
5. Update rollout plan to prevent recurrence

---

## Monitoring Dashboard Setup

### Recommended Tools

**Error Tracking**:
- **Sentry**: Real-time error reporting with stack traces
- **LogRocket**: Session replay for debugging user issues
- **Datadog**: APM for API performance monitoring

**Analytics**:
- **Google Analytics 4**: User behavior, conversion tracking
- **PostHog**: Product analytics, feature flags, A/B testing
- **Mixpanel**: Funnel analysis, cohort retention

**Uptime Monitoring**:
- **Pingdom**: 1-minute interval checks
- **UptimeRobot**: Free tier for basic monitoring
- **Better Uptime**: Status page + incident management

### Key Metrics Dashboard

Create a dashboard (Grafana, Datadog, or custom) with:

**API Health**:
- Response times (p50, p95, p99) for each endpoint
- Success rate (%) per endpoint
- Error rate (%) with breakdown by error type

**Database Performance**:
- Connection pool usage (%)
- Query execution time (avg, p95)
- Slow query count (>500ms)

**User Engagement**:
- Daily active users (DAU)
- Study logs per day
- NCAA checklist items completed per day
- GAR scores added per day

**Feature Flag Status**:
- Visual indicator: ✅ Enabled, ❌ Disabled
- Days since enabled
- Error rate per flag

**Alerts**:
- 🔴 Critical: API error rate >5%
- 🟡 Warning: API response time >500ms (p95)
- 🔴 Critical: Database connection pool >90%
- 🟡 Warning: User complaints/feedback

---

## Communication Plan

### Internal Team Updates

**Week 1** (Day 1):
```
📢 DEPLOYMENT ALERT
- APIs deployed to production
- Flags: STUDY_HALL, NCAA_TRACKER, GAR_INTEGRATION enabled
- Monitor: API response times, error rates
- Next: Week 2 (Dashboard V2) on [date]
```

**Week 1** (Day 7):
```
✅ WEEK 1 SUCCESS
- All APIs stable (error rate: 0.3%)
- Avg response time: 180ms
- Study logs: 150 sessions logged
- NCAA: 42 students initialized
- GAR: 18 new scores added
- Ready for Week 2 rollout
```

**Week 2-4**: Similar updates at start/end of each week

### User-Facing Communication

**Announcement (Day 1)**:
```
🚀 New Features Coming Soon!
We're rolling out exciting updates to Go4It over the next month:
- Real-time dashboard with study tracking
- Automated NCAA eligibility checklist
- Enhanced GAR score analytics
- Modern, faster interface

Stay tuned for updates!
```

**Feature Spotlight (Each Week)**:
- Email newsletter highlighting new feature
- In-app notification for relevant features
- Tutorial video or guide
- FAQ section on website

**Feedback Collection**:
- In-app feedback widget (e.g., Canny, Typeform)
- Weekly user survey (2-3 questions max)
- Office hours: Live Q&A with product team
- Support email: support@go4it.com

---

## Success Metrics Summary

### Week 1 (APIs)
| Metric | Baseline | Target | Actual |
|--------|----------|--------|--------|
| API Error Rate | N/A | <1% | ___ |
| Avg Response Time | N/A | <300ms | ___ |
| Study Logs Created | 0 | 100+ | ___ |
| NCAA Auto-Init Rate | N/A | 100% | ___ |
| GAR Scores Added | 0 | 20+ | ___ |

### Week 2 (Dashboard)
| Metric | Baseline | Target | Actual |
|--------|----------|--------|--------|
| Page Load Time | 3.2s | <2s | ___ |
| Dashboard DAU | X | +20% | ___ |
| Study Log Usage | 0% | 20% | ___ |
| SWR Success Rate | N/A | >99% | ___ |

### Week 3 (Hero)
| Metric | Baseline | Target | Actual |
|--------|----------|--------|--------|
| CTA Click Rate | X% | +10% | ___ |
| Bounce Rate | X% | No increase | ___ |
| Core Web Vitals | Pass/Fail | Pass | ___ |

### Week 4 (Hub)
| Metric | Baseline | Target | Actual |
|--------|----------|--------|--------|
| Hub Engagement | 0% | 50% | ___ |
| Time on Page | Xs | +10% | ___ |
| Overall Satisfaction | X% | >85% | ___ |

---

## Post-Rollout: Feature Flag Retirement

After 2-4 weeks of stable operation with all flags enabled:

### Option A: Make Permanent (Remove Flags)
```typescript
// Remove conditional rendering
// Before:
{flags.NEW_HERO ? <HeroNew /> : <LegacyHero />}

// After:
<HeroNew />

// Delete legacy components
// Delete /lib/flags.ts
// Remove flag env vars
```

**Pros**: Cleaner codebase, no flag overhead  
**Cons**: Harder to rollback if issues arise later

### Option B: Keep Flags (Long-term)
```env
# Keep flags for future A/B testing
NEXT_PUBLIC_FLAG_NEW_HERO=true  # Keep for A/B tests
NEXT_PUBLIC_FLAG_HUB_SECTION=true
```

**Pros**: Flexibility for A/B testing, easy rollback  
**Cons**: Code complexity, technical debt

**Recommendation**: Keep flags for 3-6 months, then retire if no issues.

---

## Conclusion

This staged rollout plan provides:
- ✅ **Safety**: Feature flags enable instant rollback
- ✅ **Visibility**: Comprehensive monitoring at each stage
- ✅ **Control**: Week-by-week enablement with clear gates
- ✅ **Communication**: Internal/external updates at each phase

**Timeline**: 4 weeks to full rollout  
**Risk**: Low (rollback capability via flags)  
**Effort**: Medium (daily monitoring required)

**Next Steps**:
1. Complete pre-deployment checklist
2. Deploy to staging environment
3. Begin Week 1 rollout
4. Monitor, iterate, succeed! 🚀

---

**Questions? Contact:**
- Engineering Lead: [Name]
- Product Manager: [Name]
- DevOps: [Name]

**Documentation**:
- API Tests: `scripts/test-apis.sh`
- RBAC Setup: `docs/CLERK_RBAC_SETUP.md`
- Feature Implementation: `SITE_UPGRADE_COMPLETE.md`
