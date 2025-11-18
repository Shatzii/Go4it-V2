# Replit Deployment Fix Instructions

## Current Status
✅ All code fixes have been pushed to GitHub (commit: d315d9ae)
✅ Duplicate table exports removed from `shared/schema.ts`
✅ Auth import path fixed in `app/api/admin/roles/assign/route.ts`
✅ 16 duplicate component files removed

## Issue
Replit is building from **outdated code**. The build errors you're seeing were already fixed in commits:
- `4f378dbb` - Fix duplicate table exports
- `13ea3b22` - Fix lib/auth import path
- `d315d9ae` - Remove unused duplicate components

## Solution: Force Replit to Pull Latest Code

### Option 1: Pull via Replit Shell (RECOMMENDED)
1. Open your Replit project
2. Click **Shell** tab (bottom of screen)
3. Run these commands:
```bash
git fetch origin
git reset --hard origin/main
rm -rf .next node_modules/.cache
```
4. Click **Deploy** button again

### Option 2: Reconnect Git Repository
1. Go to Replit **Tools** → **Version Control**
2. Click **Pull from GitHub**
3. Clear build cache: `rm -rf .next`
4. Redeploy

### Option 3: Trigger Fresh Deploy
1. In Replit, go to **Deployments** tab
2. Click **Options** (three dots) on latest failed deployment
3. Select **Redeploy**
4. If still fails, run in Shell: `git pull && rm -rf .next`

## Verification Commands
Run these in Replit Shell to verify fixes are present:

```bash
# Should show only 3 lines (71, 88, 102) - no duplicates at 1206+
grep -n "export const activityLog\|export const taskDependencies\|export const timeEntries" shared/schema.ts

# Should show: import { requireRole } from '@/lib/auth';
head -3 app/api/admin/roles/assign/route.ts

# Should show latest commit
git log --oneline -1
```

## Expected Output
After pulling latest code, you should see:
- ✅ `git log` shows commit: `d315d9ae Remove unused duplicate component files`
- ✅ Only 3 table exports in schema.ts (lines 71, 88, 102)
- ✅ Auth import uses `@/lib/auth` not `../../../../lib/auth`
- ✅ Build succeeds with no Turbopack errors

## Still Failing?
If errors persist after pulling latest code:
1. Check Replit is connected to correct repo: `Shatzii/Go4it-V2`
2. Verify branch: `git branch` (should show `main`)
3. Force clean build: `rm -rf .next node_modules && npm install && npm run build:production`
4. Contact Replit support if git pull is not working
