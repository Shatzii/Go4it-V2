# Go4It Sports Platform Site Map & Reorganization Plan

## Current Structure Analysis

The current application structure has several issues:
1. Duplicate or similar functionality in multiple files (e.g., multiple dashboard pages, GAR visualizations)
2. Flat file organization with limited categorization
3. Naming inconsistencies (e.g., "-fixed", "-enhanced" suffixes)
4. Files that serve similar purposes but are not grouped together

## Proposed File Structure

```
client/src/
├── components/
│   ├── academics/           # Academic performance related components
│   ├── accessibility/       # Accessibility features
│   ├── admin/               # Admin panel components
│   ├── analytics/           # Analytics & reporting components
│   ├── animations/          # Animation related components
│   ├── athlete/
│   │   ├── profile/         # Athlete profile components
│   │   ├── social/          # Social networking components
│   │   └── combine/         # Athletic combine components
│   ├── dashboard/           # Dashboard UI components
│   ├── gar/                 # Growth & Ability Rating components
│   ├── layout/              # Layout components (sidebar, header, etc.)
│   ├── messaging/           # Messaging system components
│   ├── myplayer/
│   │   ├── xp/              # Experience system
│   │   ├── star-path/       # Star path progression
│   │   ├── verification/    # Workout verification
│   │   └── ai-coach/        # AI coaching components
│   ├── scout/               # Scouting related components
│   ├── skill-tree/          # Skill tree components
│   ├── ui/                  # Shared UI components
│   └── video/               # Video processing & analysis components
│
├── pages/
│   ├── admin/               # Admin pages
│   │   ├── dashboard.tsx
│   │   ├── content-manager.tsx
│   │   └── analytics-dashboard.tsx
│   ├── academics/           # Academic performance pages
│   │   └── academic-progress.tsx
│   ├── athlete/             # Athlete pages
│   │   ├── profile.tsx
│   │   ├── social-hub.tsx
│   │   ├── star-profiles.tsx
│   │   └── sport-recommendations.tsx
│   ├── auth/                # Authentication pages
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── reset-password.tsx
│   ├── blog/                # Blog pages
│   │   ├── list.tsx
│   │   └── post.tsx
│   ├── combine/             # Combine pages
│   │   ├── tour.tsx
│   │   ├── tour-detail.tsx
│   │   ├── public.tsx
│   │   └── showcase.tsx
│   ├── dashboard/           # User dashboard
│   │   └── index.tsx
│   ├── gar/                 # GAR score pages
│   │   ├── visualization.tsx
│   │   └── score.tsx
│   ├── messaging/           # Messaging pages
│   │   ├── index.tsx
│   │   └── sms.tsx
│   ├── myplayer/            # MyPlayer experience pages
│   │   ├── xp.tsx
│   │   ├── star-path.tsx
│   │   ├── ai-coach.tsx
│   │   ├── interface.tsx
│   │   ├── weight-room.tsx
│   │   └── verification/
│   │       ├── index.tsx
│   │       ├── detail.tsx
│   │       └── submit.tsx
│   ├── scout/               # Scouting pages
│   │   ├── vision-feed.tsx
│   │   ├── nextup-spotlight.tsx
│   │   ├── spotlight-profile.tsx
│   │   └── spotlight-create.tsx
│   ├── skill/               # Skill tree pages
│   │   ├── tree.tsx
│   │   └── development-tracker.tsx
│   ├── settings/            # Settings pages
│   │   └── index.tsx
│   ├── video/               # Video related pages
│   │   ├── analysis.tsx
│   │   ├── analysis-detail.tsx
│   │   ├── analysis-gar.tsx
│   │   ├── highlights.tsx
│   │   ├── highlight-generator.tsx
│   │   ├── ai-player.tsx
│   │   └── upload.tsx
│   ├── film/                # Film comparison pages
│   │   ├── comparison.tsx
│   │   ├── create.tsx
│   │   ├── detail.tsx
│   │   └── edit.tsx
│   ├── index.tsx            # Home page
│   ├── not-found.tsx        # 404 page
│   └── text-to-animation.tsx # Animation page
│
└── App.tsx                  # Main app component with routes
```

## Duplicate Files to Consolidate

1. **Dashboard Pages**:
   - `dashboard.tsx` - Main user dashboard
   - `admin-dashboard.tsx` -> Move to `admin/dashboard.tsx`
   - `analytics-dashboard.tsx` -> Move to `admin/analytics-dashboard.tsx`

2. **GAR Visualization Pages**:
   - `gar-score.tsx` -> Move to `gar/score.tsx`
   - `gar-score-enhanced.tsx` -> Merge with `gar/score.tsx`
   - `enhanced-gar.tsx` -> Move to `gar/visualization.tsx`
   - `enhanced-gar-visualization.tsx` -> Merge with `gar/visualization.tsx`

3. **Skill Tree Pages**:
   - `skill-tree.tsx` -> Move to `skill/tree.tsx`
   - `skill-tree-page.tsx` -> Merge with `skill/tree.tsx`
   - `enhanced-skill-tree-page.tsx` -> Merge with `skill/tree.tsx`
   - `skill-development-tracker.tsx` -> Move to `skill/development-tracker.tsx`

4. **Video Analysis Pages**:
   - `video-analysis.tsx` -> Move to `video/analysis.tsx`
   - `video-analysis-detail.tsx` -> Move to `video/analysis-detail.tsx`
   - `video-analysis-page.tsx` -> Move to `video/analysis-gar.tsx`
   - `video-highlights-page.tsx` -> Move to `video/highlights.tsx`
   - `upload-video.tsx` -> Move to `video/upload.tsx`
   - `ai-video-player-demo.tsx` -> Move to `video/ai-player.tsx`
   - `highlight-generator.tsx` -> Move to `video/highlight-generator.tsx`

5. **MyPlayer Pages**:
   - `myplayer-xp.tsx` & `myplayer-xp-enhanced.tsx` -> Merge into `myplayer/xp.tsx`
   - `myplayer-star-path.tsx` -> Move to `myplayer/star-path.tsx`
   - `myplayer-ai-coach.tsx` -> Move to `myplayer/ai-coach.tsx`
   - `myplayer-interface.tsx` -> Move to `myplayer/interface.tsx`
   - `weight-room.tsx` -> Move to `myplayer/weight-room.tsx`
   - `workout-verification.tsx` -> Move to `myplayer/verification/index.tsx`
   - `verification-detail.tsx` -> Move to `myplayer/verification/detail.tsx`
   - `submit-verification.tsx` -> Move to `myplayer/verification/submit.tsx`

6. **Other Files to Reorganize**:
   - `nextup-spotlight.tsx` & `nextup-spotlight-fixed.tsx` -> Merge into `scout/nextup-spotlight.tsx`
   - `spotlight-profile.tsx` -> Move to `scout/spotlight-profile.tsx`
   - `spotlight-create.tsx` -> Move to `scout/spotlight-create.tsx`
   - `scoutvision-feed.tsx` -> Move to `scout/vision-feed.tsx`
   - `athlete-profile.tsx` -> Move to `athlete/profile.tsx`
   - `athlete-social-hub.tsx` -> Move to `athlete/social-hub.tsx`
   - `athlete-star-profiles.tsx` -> Move to `athlete/star-profiles.tsx`
   - `messaging.tsx` -> Move to `messaging/index.tsx`
   - `sms-messaging.tsx` -> Move to `messaging/sms.tsx`

## Implementation Plan

1. Create the new directory structure
2. Move each file to its new location
3. Update import statements in moved files
4. Update route configuration in App.tsx
5. Test each section after migration
6. Remove redundant or merged files after successful testing

## Benefits of Reorganization

1. **Improved Code Organization**: Logically grouped files make navigation easier
2. **Reduced Redundancy**: Merged similar files to prevent duplication
3. **Simpler Maintenance**: Related functionality is co-located
4. **Better Developer Experience**: Clear structure helps onboarding and development
5. **Reduced Server Load**: Fewer files to process and manage
6. **Streamlined Navigation**: Logical URL structure