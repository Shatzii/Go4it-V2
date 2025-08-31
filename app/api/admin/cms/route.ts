import { NextRequest, NextResponse } from 'next/server';

// Landing page content structure
interface LandingPageContent {
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
    ctaLink: string;
    features: string[];
  };
  features: {
    title: string;
    subtitle: string;
    items: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
      color: string;
    }>;
  };
  events: {
    title: string;
    subtitle: string;
    events: Array<{
      id: string;
      title: string;
      description: string;
      price: string;
      location: string;
      dates: string;
      category: string;
      features: string[];
    }>;
  };
  globalSettings: {
    siteName: string;
    tagline: string;
    primaryColor: string;
    secondaryColor: string;
    logoUrl: string;
    metaDescription: string;
  };
}

// Default landing page content
const defaultContent: LandingPageContent = {
  hero: {
    headline: 'Elite Athletic Development Platform',
    subheadline:
      'Comprehensive sports analytics platform designed specifically for neurodivergent student athletes. Advanced AI-powered GAR analysis, StarPath progression tracking, and NCAA compliance tools.',
    ctaText: 'Get Your GAR Score',
    ctaLink: '/gar-upload',
    features: [
      'GAR Score Analysis (13 sports)',
      'StarPath XP Progression System',
      '24/7 AI Coaching Engine',
    ],
  },
  features: {
    title: 'Comprehensive Athletic Development',
    subtitle: 'Advanced tools and analytics for elite performance',
    items: [
      {
        id: 'gar',
        title: 'GAR Analysis',
        description:
          'Advanced AI-powered athletic performance analysis with standardized scoring system and biomechanical insights.',
        icon: '🎯',
        color: 'blue',
      },
      {
        id: 'starpath',
        title: 'StarPath System',
        description:
          'Gamified progression tracking designed for neurodivergent athletes with clear goals and visual feedback.',
        icon: '⭐',
        color: 'purple',
      },
      {
        id: 'ncaa',
        title: 'NCAA Compliance',
        description:
          'Complete academic tracking and eligibility monitoring with international diploma recognition.',
        icon: '🏆',
        color: 'green',
      },
    ],
  },
  events: {
    title: 'UPCOMING EVENTS',
    subtitle: 'Elite training camps and competitions to elevate your game',
    events: [
      {
        id: 'friday-night-lights',
        title: 'Friday Night Lights',
        description:
          'UniversalOne School open house with tryouts for basketball, soccer, and flag football',
        price: '$20USD',
        location: 'Conkal, Mexico',
        dates: 'August 15th, 2025',
        category: 'OPEN HOUSE',
        features: [
          'UniversalOne School open house event',
          'Tryouts for basketball, soccer, and flag football',
          'Boys and girls welcome',
          'USA Football flag football season',
          'Professional coaching evaluation',
        ],
      },
    ],
  },
  globalSettings: {
    siteName: 'Go4It Sports',
    tagline: 'Get Verified. Get Ranked. Get Recruited.',
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    logoUrl: '/logo.png',
    metaDescription: 'AI-powered athletics platform for neurodivergent student athletes',
  },
};

// In-memory store (in production, this would be in a database)
let cmsContent: LandingPageContent = { ...defaultContent };

export async function GET(request: NextRequest) {
  try {
    const action = request.nextUrl.searchParams.get('action');

    if (action === 'getPublicContent') {
      // Return public content for the frontend
      return NextResponse.json({
        sections: [
          {
            id: 'hero',
            name: 'Hero Section',
            type: 'hero',
            isVisible: true,
            order: 1,
            content: cmsContent.hero,
            lastUpdated: new Date().toISOString(),
          },
          {
            id: 'features',
            name: 'Features Section',
            type: 'features',
            isVisible: true,
            order: 2,
            content: cmsContent.features,
            lastUpdated: new Date().toISOString(),
          },
          {
            id: 'events',
            name: 'Events Section',
            type: 'events',
            isVisible: true,
            order: 3,
            content: cmsContent.events,
            lastUpdated: new Date().toISOString(),
          },
        ],
        globalSettings: cmsContent.globalSettings,
      });
    }

    // Return full admin content
    return NextResponse.json(cmsContent);
  } catch (error) {
    console.error('Error fetching CMS content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // In production, verify admin access here
    const updatedContent = await request.json();

    // Validate the content structure
    if (!updatedContent.hero || !updatedContent.features || !updatedContent.globalSettings) {
      return NextResponse.json({ error: 'Invalid content structure' }, { status: 400 });
    }

    // Update the content
    cmsContent = { ...cmsContent, ...updatedContent };

    return NextResponse.json({
      success: true,
      message: 'Content updated successfully',
      content: cmsContent,
    });
  } catch (error) {
    console.error('Error updating CMS content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Handle empty requests gracefully
    const text = await request.text();
    if (!text.trim()) {
      return NextResponse.json({
        success: true,
        content: cmsContent,
      });
    }

    const body = JSON.parse(text);
    const { action, section, data } = body;

    switch (action) {
      case 'updateSection':
        if (section === 'hero') {
          cmsContent.hero = { ...cmsContent.hero, ...data };
        } else if (section === 'features') {
          cmsContent.features = { ...cmsContent.features, ...data };
        } else if (section === 'events') {
          cmsContent.events = { ...cmsContent.events, ...data };
        } else if (section === 'globalSettings') {
          cmsContent.globalSettings = { ...cmsContent.globalSettings, ...data };
        }
        break;

      case 'addEvent':
        cmsContent.events.events.push({
          id: Date.now().toString(),
          ...data,
        });
        break;

      case 'updateEvent':
        const eventIndex = cmsContent.events.events.findIndex((e) => e.id === data.id);
        if (eventIndex !== -1) {
          cmsContent.events.events[eventIndex] = { ...data };
        }
        break;

      case 'deleteEvent':
        cmsContent.events.events = cmsContent.events.events.filter((e) => e.id !== data.id);
        break;

      case 'addFeature':
        cmsContent.features.items.push({
          id: Date.now().toString(),
          ...data,
        });
        break;

      case 'updateFeature':
        const featureIndex = cmsContent.features.items.findIndex((f) => f.id === data.id);
        if (featureIndex !== -1) {
          cmsContent.features.items[featureIndex] = { ...data };
        }
        break;

      case 'deleteFeature':
        cmsContent.features.items = cmsContent.features.items.filter((f) => f.id !== data.id);
        break;

      case 'getPublicContent':
        return NextResponse.json({
          sections: [
            {
              id: 'hero',
              name: 'Hero Section',
              type: 'hero',
              isVisible: true,
              order: 1,
              content: cmsContent.hero,
              lastUpdated: new Date().toISOString(),
            },
            {
              id: 'features',
              name: 'Features Section',
              type: 'features',
              isVisible: true,
              order: 2,
              content: cmsContent.features,
              lastUpdated: new Date().toISOString(),
            },
            {
              id: 'events',
              name: 'Events Section',
              type: 'events',
              isVisible: true,
              order: 3,
              content: cmsContent.events,
              lastUpdated: new Date().toISOString(),
            },
          ],
          globalSettings: cmsContent.globalSettings,
        });

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Content updated successfully',
      content: cmsContent,
    });
  } catch (error) {
    console.error('Error processing CMS request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
