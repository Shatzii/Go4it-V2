# UI Components Needing Backend Connections

## Summary
While the backend APIs are complete, several UI components have **mock handlers** or **incomplete integrations** that need to be connected to the live APIs.

---

## 1. 🎯 Social Media Dashboard (`/app/admin/social-media/page.tsx`)

### ✅ Already Connected:
- **Stats fetching** - Line 51: `useQuery` → `/api/social-media/campaigns?type=stats`
- **Templates fetching** - Line 57: `useQuery` → `/api/social-media/campaigns?type=templates`
- **Content generation** - Line 62: `useMutation` → `/api/social-media/generate`
- **Campaign creation** - Line 92: `useMutation` → `/api/social-media/campaigns`

### ⚠️ Needs Connection:

#### Quick Generate Buttons (Lines 243-268)
```tsx
// Currently calls handleQuickGenerate() which uses generateContent mutation
// But needs more specific API parameters

<Button onClick={() => handleQuickGenerate('screenshots')}>
  Generate Feature Screenshots
</Button>

<Button onClick={() => handleQuickGenerate('promotional')}>
  Create Promotional Images
</Button>

<Button onClick={() => handleQuickGenerate('complete-campaign')}>
  Full Campaign Package
</Button>
```

**Fix Needed:**
```tsx
const handleQuickGenerate = async (type: string) => {
  // Add feature selection
  const features = ['gar-analysis', 'starpath', 'recruiting-hub'];
  
  if (type === 'screenshots') {
    // Call screenshot API for each feature
    for (const feature of features) {
      await fetch('/api/screenshots', {
        method: 'POST',
        body: JSON.stringify({ feature, width: 1080, height: 1920 })
      });
    }
  } else if (type === 'complete-campaign') {
    // Create campaign first
    const campaign = await fetch('/api/social-media/campaigns', {
      method: 'POST',
      body: JSON.stringify({
        name: `Auto Campaign ${Date.now()}`,
        platforms: selectedPlatforms,
        features: selectedFeatures,
      })
    });
    
    // Then generate content for each platform
    for (const platform of selectedPlatforms) {
      await fetch('/api/social-media/generate', {
        method: 'POST',
        body: JSON.stringify({ platform, features: selectedFeatures })
      });
    }
  }
};
```

#### Platform Status (Lines 285-310)
```tsx
// Currently shows hardcoded status
<Badge className="bg-green-600">Ready</Badge>
<Badge className="bg-orange-600">Setup Required</Badge>
```

**Fix Needed:**
- Add API to check platform OAuth status
- Create `/api/social-media/platforms/status` endpoint
- Fetch real connection status from database

#### Campaign List in Campaigns Tab (Lines ~500+)
```tsx
// Currently no campaign list is rendered
// Need to fetch and display existing campaigns
```

**Add:**
```tsx
const { data: campaigns } = useQuery({
  queryKey: ['/api/social-media/campaigns'],
  refetchInterval: 30000,
});

// Then render:
{campaigns?.data?.map(campaign => (
  <Card key={campaign.id}>
    <h3>{campaign.name}</h3>
    <p>{campaign.status}</p>
    <Button onClick={() => handleEditCampaign(campaign.id)}>Edit</Button>
    <Button onClick={() => handleDeleteCampaign(campaign.id)}>Delete</Button>
  </Card>
))}
```

#### Schedule Post Button
**Missing entirely** - Need to add:
```tsx
const handleSchedulePost = async (content: any, scheduledFor: Date) => {
  await fetch('/api/social-media/schedule', {
    method: 'POST',
    body: JSON.stringify({
      campaignId: currentCampaign.id,
      platform: content.platform,
      content,
      scheduledFor,
    })
  });
};
```

---

## 2. 📝 Content Creator Page (`/app/admin/content-creator/page.tsx`)

### ⚠️ Needs Complete Connection:

#### Content Generation (Line 82)
```tsx
const handleGenerateContent = async () => {
  setIsGenerating(true);
  // Currently uses setTimeout - MOCK IMPLEMENTATION
  setTimeout(() => {
    setGeneratedContent(`...hardcoded template...`);
    setIsGenerating(false);
  }, 2000);
};
```

**Fix Needed:**
```tsx
const handleGenerateContent = async () => {
  setIsGenerating(true);
  
  try {
    const response = await fetch('/api/social-media/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform: 'instagram', // or selected platform
        feature: selectedTemplate, // Use template as feature
        customPrompt: `Create educational content about ${contentTitle}: ${contentDescription}`,
      })
    });
    
    const data = await response.json();
    setGeneratedContent(data.caption);
    
    // Show preview with ContentPreview component
    setShowPreview(true);
    setPreviewContent({
      platform: 'instagram',
      caption: data.caption,
      hashtags: data.hashtags,
      media: [],
    });
  } catch (error) {
    toast.error('Failed to generate content');
  } finally {
    setIsGenerating(false);
  }
};
```

#### Preview & Publish
**Missing** - Need to add ContentPreview component:
```tsx
import ContentPreview from '@/components/admin/ContentPreview';

const [showPreview, setShowPreview] = useState(false);
const [previewContent, setPreviewContent] = useState(null);

{showPreview && previewContent && (
  <ContentPreview
    content={previewContent}
    onClose={() => setShowPreview(false)}
    onPublish={handlePublishNow}
    onSchedule={handleSchedulePost}
    onEdit={(edited) => setPreviewContent(edited)}
  />
)}
```

---

## 3. 🔍 Scraper Dashboard (`/app/admin/scraper-dashboard/page.tsx`)

### ✅ Already Connected (Lines 150-250):
- **US Scraping** - `handleUSScrapingSubmit()` → `/api/scraper/production`
- **Enhanced Scraping** - Uses `/api/scraper/enhanced`
- **Database Stats** - `loadScrapingStats()` → `/api/recruiting/athletes/database`

### ⚠️ Needs Enhancement:

#### Save Scraped Data to Social Media System
**Add connection** to save results:
```tsx
const handleUSScrapingSubmit = async (e: React.FormEvent) => {
  // ... existing scraping code ...
  
  // After successful scrape, save to scraperResults table
  await fetch('/api/scraper/results', {
    method: 'POST',
    body: JSON.stringify({
      source: 'maxpreps',
      sport: selectedSport,
      region: selectedState,
      data: scrapedAthletes,
      totalRecords: scrapedAthletes.length,
      status: 'success',
      processingTime: elapsedTime,
    })
  });
};
```

**Create new API route:** `/app/api/scraper/results/route.ts`
```typescript
import { db } from '@/lib/db';
import { scraperResults } from '@/shared/schema';

export async function POST(req: Request) {
  const body = await req.json();
  
  await db.insert(scraperResults).values({
    source: body.source,
    sport: body.sport,
    region: body.region,
    data: JSON.stringify(body.data),
    totalRecords: body.totalRecords,
    successfulRecords: body.totalRecords,
    failedRecords: 0,
    status: body.status,
    processingTime: body.processingTime,
  });
  
  return NextResponse.json({ success: true });
}
```

---

## 4. 📊 Analytics Dashboard Component (`/components/admin/AnalyticsDashboard.tsx`)

### ✅ Already Connected:
- **Analytics API** - Line 31: `useQuery` → `/api/analytics/dashboard?range=${timeRange}`
- **Auto-refresh** - Every 30 seconds

### ⚠️ Minor Type Fixes Needed:
```tsx
// Line 203, 239, 307 - Add type annotations
{scraperStats.recentScrapes.slice(0, 5).map((scrape: any) => (
  // ... rendering
))}

{socialStats.topPerformingPosts.slice(0, 5).map((post: any) => (
  // ... rendering
))}
```

---

## 5. 🎨 Content Preview Component (`/components/admin/ContentPreview.tsx`)

### ✅ Component Complete

### ⚠️ Needs Integration:

#### Publish Now Handler
```tsx
// Add to parent component that uses ContentPreview
const handlePublishNow = async (content: any) => {
  try {
    // First schedule it
    const schedule = await fetch('/api/social-media/schedule', {
      method: 'POST',
      body: JSON.stringify({
        campaignId: currentCampaign.id,
        platform: content.platform,
        content: {
          caption: content.caption,
          hashtags: content.hashtags,
          media: content.media,
        },
        scheduledFor: new Date(), // Now
      })
    });
    
    const scheduleData = await schedule.json();
    
    // Then publish immediately
    await fetch('/api/social-media/publish', {
      method: 'POST',
      body: JSON.stringify({ postId: scheduleData.data.id })
    });
    
    useToast().success('Published!', 'Post is now live');
  } catch (error) {
    useToast().error('Failed to publish', error.message);
  }
};
```

#### Schedule Handler
```tsx
const handleSchedulePost = async (content: any, scheduledFor: Date) => {
  try {
    await fetch('/api/social-media/schedule', {
      method: 'POST',
      body: JSON.stringify({
        campaignId: currentCampaign.id,
        platform: content.platform,
        content,
        scheduledFor,
      })
    });
    
    useToast().success('Scheduled!', `Post scheduled for ${scheduledFor.toLocaleString()}`);
  } catch (error) {
    useToast().error('Failed to schedule', error.message);
  }
};
```

---

## 6. 🔔 Toast Notifications

### ✅ Already Integrated:
- ToastProvider in `/app/layout.tsx`

### ⚠️ Usage Needed:
Replace all existing `toast()` calls with `useToast()` from the new provider:

```tsx
// OLD (shadcn/ui)
import { useToast } from '@/hooks/use-toast';
const { toast } = useToast();
toast({ title: 'Success', description: 'Done' });

// NEW (Custom ToastProvider)
import { useToast } from '@/components/providers/ToastProvider';
const { success, error, warning, info } = useToast();
success('Success!', 'Operation completed');
error('Error!', 'Something went wrong');
```

**Update in:**
- `/app/admin/social-media/page.tsx` (Lines 48, 74-88, 106-113)
- `/app/admin/content-creator/page.tsx` (Add toast notifications)
- All API error handlers

---

## 7. 📅 Missing UI Components

### Need to Create:

#### 1. Schedule Manager Page
**File:** `/app/admin/schedule/page.tsx`

```tsx
'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/components/providers/ToastProvider';

export default function ScheduleManagerPage() {
  const { success, error } = useToast();
  
  const { data: schedules } = useQuery({
    queryKey: ['/api/social-media/schedule'],
    refetchInterval: 30000,
  });
  
  const deleteSchedule = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/social-media/schedule?id=${id}`, {
        method: 'DELETE',
      });
      return response.json();
    },
    onSuccess: () => success('Deleted', 'Schedule removed'),
  });
  
  return (
    <div>
      <h1>Scheduled Posts</h1>
      {schedules?.data?.map(schedule => (
        <Card key={schedule.id}>
          <h3>{schedule.platform}</h3>
          <p>Scheduled for: {new Date(schedule.scheduledFor).toLocaleString()}</p>
          <Badge>{schedule.status}</Badge>
          <Button onClick={() => deleteSchedule.mutate(schedule.id)}>Cancel</Button>
        </Card>
      ))}
    </div>
  );
}
```

#### 2. Campaign Management Modal
**Add to social-media page:**

```tsx
const [editingCampaign, setEditingCampaign] = useState(null);

const updateCampaign = useMutation({
  mutationFn: async ({ id, updates }: any) => {
    const response = await fetch('/api/social-media/campaigns', {
      method: 'PUT',
      body: JSON.stringify({ id, ...updates }),
    });
    return response.json();
  },
});

{editingCampaign && (
  <Dialog open onOpenChange={() => setEditingCampaign(null)}>
    <form onSubmit={(e) => {
      e.preventDefault();
      updateCampaign.mutate({
        id: editingCampaign.id,
        updates: formData,
      });
    }}>
      {/* Campaign edit form */}
    </form>
  </Dialog>
)}
```

---

## 8. 🎬 Screenshot Generation Integration

### Current Status:
- API exists: `/api/screenshots`
- Not integrated in UI

### Add to Social Media Dashboard:

```tsx
const generateScreenshots = async () => {
  const features = ['gar-analysis', 'starpath', 'recruiting-hub', 'college-search'];
  const screenshots = [];
  
  for (const feature of features) {
    const response = await fetch('/api/screenshots', {
      method: 'POST',
      body: JSON.stringify({
        feature,
        width: 1080,
        height: 1920,
      })
    });
    
    const data = await response.json();
    screenshots.push({
      feature,
      url: data.screenshot,
    });
  }
  
  return screenshots;
};

// Add button in UI
<Button onClick={async () => {
  setGenerating(true);
  const screenshots = await generateScreenshots();
  // Display or save screenshots
  setGenerating(false);
}}>
  Generate All Screenshots
</Button>
```

---

## Priority Connection Checklist

### 🔴 High Priority (Core Functionality):
- [ ] **Social Media Dashboard** - Complete campaign CRUD UI
- [ ] **Content Creator** - Replace mock generation with real API
- [ ] **Content Preview** - Wire up publish/schedule handlers
- [ ] **Scraper Dashboard** - Save results to `scraperResults` table

### 🟡 Medium Priority (Enhanced Features):
- [ ] **Schedule Manager Page** - Create dedicated scheduling UI
- [ ] **Campaign Edit Modal** - Add inline editing
- [ ] **Platform Status Checker** - Real OAuth status
- [ ] **Screenshot Gallery** - Display generated screenshots

### 🟢 Low Priority (Polish):
- [ ] **Toast Migration** - Switch from shadcn to custom ToastProvider
- [ ] **Loading States** - Add skeletons for all data fetching
- [ ] **Error Boundaries** - Wrap each major section
- [ ] **Optimistic Updates** - Add for mutations

---

## Quick Start Guide

### 1. Fix Social Media Dashboard Content Generation
File: `/app/admin/social-media/page.tsx`

```tsx
// Replace handleQuickGenerate (line 120)
const handleQuickGenerate = async (type: string) => {
  setGenerating(true);
  
  try {
    if (type === 'screenshots') {
      // Generate screenshots for all features
      const features = ['gar-analysis', 'starpath', 'recruiting-hub'];
      for (const feature of features) {
        await fetch('/api/screenshots', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ feature, width: 1080, height: 1920 })
        });
      }
      toast.success('Screenshots Generated!', `Created ${features.length} screenshots`);
    } 
    else if (type === 'complete-campaign') {
      // Full workflow
      const campaign = await fetch('/api/social-media/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Auto Campaign ${new Date().toISOString()}`,
          platforms: selectedPlatforms,
          features: selectedFeatures,
          contentType: 'promotional',
        })
      }).then(r => r.json());
      
      for (const platform of selectedPlatforms) {
        const content = await fetch('/api/social-media/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ platform, feature: selectedFeatures[0] })
        }).then(r => r.json());
        
        await fetch('/api/social-media/schedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            campaignId: campaign.data.id,
            platform,
            content,
            scheduledFor: new Date(Date.now() + 24*60*60*1000), // Tomorrow
          })
        });
      }
      
      toast.success('Campaign Created!', 'All content generated and scheduled');
    }
  } catch (error) {
    toast.error('Failed', error.message);
  } finally {
    setGenerating(false);
  }
};
```

### 2. Fix Content Creator
File: `/app/admin/content-creator/page.tsx`

```tsx
// Replace handleGenerateContent (line 82)
const handleGenerateContent = async () => {
  setIsGenerating(true);
  
  try {
    const response = await fetch('/api/social-media/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform: 'instagram',
        customPrompt: `Create educational content titled "${contentTitle}": ${contentDescription}. Include neurodivergent adaptations.`,
      })
    });
    
    if (!response.ok) throw new Error('Generation failed');
    
    const data = await response.json();
    setGeneratedContent(data.caption + '\n\n' + data.hashtags.join(' '));
  } catch (error) {
    setGeneratedContent('Error: ' + error.message);
  } finally {
    setIsGenerating(false);
  }
};
```

---

## Summary

**Total UI Components:** 7
- ✅ **2 Fully Connected** (Analytics Dashboard, ContentPreview)
- ⚠️ **5 Need Connections** (Social Media, Content Creator, Scraper, Schedule Manager, Campaign Manager)

**Estimated Work:** 4-6 hours
- Social Media Dashboard fixes: 2 hours
- Content Creator integration: 1 hour
- Scraper integration: 1 hour
- New UI components: 2 hours

**Next Step:** Start with Social Media Dashboard `handleQuickGenerate` function for immediate functionality.
