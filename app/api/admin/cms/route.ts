import { NextRequest, NextResponse } from 'next/server';

// This would typically connect to a database
// For now, we'll simulate with a simple storage mechanism
let cmsData: any = null;

export async function GET(req: NextRequest) {
  try {
    // In production, this would fetch from database
    if (!cmsData) {
      // Return default structure if no data exists
      return NextResponse.json({
        sections: [
          {
            id: 'hero',
            name: 'Hero Section',
            type: 'hero',
            isVisible: true,
            order: 1,
            content: {
              headline: 'Get Verified. Get Ranked. Get Recruited.',
              subheadline: 'The first AI-powered platform built for neurodivergent student athletes',
              ctaText: 'Start Free. Get Ranked. Go4It.',
              ctaLink: '/register',
              backgroundImage: '/hero-bg.jpg',
              features: [
                'GAR Score Analysis (13 sports)',
                'StarPath XP Progression System',
                '24/7 AI Coaching Engine',
                'Academic GPA + NCAA Eligibility Tools',
                'Mental Wellness & Nutrition Hub',
                'National Rankings + Leaderboards',
                'Athlete Dashboard + Mobile Access'
              ]
            },
            lastUpdated: new Date().toISOString()
          },
          {
            id: 'events',
            name: 'Events & Camps',
            type: 'events',
            isVisible: true,
            order: 2,
            content: {
              title: 'UPCOMING EVENTS',
              subtitle: 'Elite training camps and competitions to elevate your game',
              events: [
                {
                  id: '1',
                  title: 'English With Sports Camp',
                  description: 'Learn English through sports & games with native English-speaking coaches',
                  price: '$275USD',
                  location: 'Unidad Deportiva del Sur Henry Martín, Mérida',
                  dates: 'August 4-8 & August 11-15, 2025',
                  category: 'BILINGUAL',
                  features: [
                    'Learn English through sports & games',
                    'Native English-speaking coaches',
                    'Flag football, basketball, soccer, tennis',
                    'Daily lunch and snacks included',
                    'Ages 5-17 years welcome'
                  ],
                  maxParticipants: 60,
                  schedule: '8:00 AM - 4:00 PM',
                  featuredStaff: [
                    '2x Super Bowl Champion Derrick Martin',
                    'NFL alumnus Talib Wise'
                  ],
                  additionalInfo: 'Where language and movement connect. Learn English through games, sports and mentorship from international coaches and American athletes.'
                },
                {
                  id: '2',
                  title: 'Team Camps & Coaching Clinics',
                  description: 'Elite training with USA Football coaches and potential Dallas program qualification',
                  price: '$725USD / $225USD',
                  location: 'Unidad Deportiva del Sur Henry Martín, Mérida',
                  dates: 'August 6-16, 2025',
                  category: 'ELITE',
                  features: [
                    'Work with USA Football coaches',
                    'Develop winning strategies',
                    'Individual players welcome',
                    'USA Football membership included',
                    '3 days = 6 practices = 9 total sessions'
                  ],
                  maxParticipants: 16,
                  schedule: 'Day Camp: 8AM-4PM / Overnight Camp: 6PM-10PM',
                  featuredStaff: [
                    '2x Super Bowl Champion Derrick Martin',
                    'NFL alumnus Talib Wise (Spanish National Team coach)',
                    'USA Football certified coaches'
                  ],
                  additionalInfo: 'Only 4 teams per session. Elite participants may qualify for exclusive 10-week S.T.A.g.e. program in Dallas, Texas.'
                }
              ]
            },
            lastUpdated: new Date().toISOString()
          },
          {
            id: 'pricing',
            name: 'Pricing Plans',
            type: 'pricing',
            isVisible: true,
            order: 3,
            content: {
              title: 'Choose Your Path',
              subtitle: 'Every champion needs the right tools. Pick your level.',
              plans: [
                {
                  id: 'free',
                  name: 'Free',
                  price: '$0',
                  period: 'forever',
                  description: 'Get started with basic features',
                  features: [
                    'Basic GAR analysis',
                    'Limited StarPath access',
                    'Community support',
                    'Basic performance tracking'
                  ],
                  cta: 'Start Free',
                  popular: false
                },
                {
                  id: 'starter',
                  name: 'Starter',
                  price: '$19',
                  period: 'month',
                  description: 'Perfect for dedicated athletes',
                  features: [
                    'Full GAR analysis',
                    'Complete StarPath system',
                    'AI coaching insights',
                    'Performance tracking',
                    'Academic monitoring',
                    'Basic recruitment tools'
                  ],
                  cta: 'Go Starter',
                  popular: true
                },
                {
                  id: 'pro',
                  name: 'Pro',
                  price: '$49',
                  period: 'month',
                  description: 'For serious competitors',
                  features: [
                    'Everything in Starter',
                    'Advanced analytics',
                    'Video analysis',
                    'Personalized coaching',
                    'Priority support',
                    'Recruitment networking'
                  ],
                  cta: 'Go Pro',
                  popular: false
                },
                {
                  id: 'elite',
                  name: 'Elite',
                  price: '$99',
                  period: 'month',
                  description: 'Maximum performance package',
                  features: [
                    'Everything in Pro',
                    'One-on-one coaching',
                    'Custom training plans',
                    'Direct college connections',
                    'Premium analytics',
                    'Elite networking events'
                  ],
                  cta: 'Go Elite',
                  popular: false
                }
              ]
            },
            lastUpdated: new Date().toISOString()
          }
        ],
        globalSettings: {
          siteName: 'Go4It Sports',
          tagline: 'Get Verified. Get Ranked. Get Recruited.',
          primaryColor: '#3B82F6',
          secondaryColor: '#8B5CF6',
          logoUrl: '/logo.png',
          favIconUrl: '/favicon.ico',
          metaDescription: 'AI-powered athletics platform for neurodivergent student athletes featuring GAR scoring, StarPath progression, and comprehensive recruitment tools.',
          socialMediaLinks: {
            instagram: 'https://instagram.com/go4itsports',
            twitter: 'https://twitter.com/go4itsports',
            facebook: 'https://facebook.com/go4itsports',
            youtube: 'https://youtube.com/@go4itsports'
          }
        }
      });
    }

    return NextResponse.json(cmsData);
  } catch (error) {
    console.error('Failed to fetch CMS content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CMS content' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    
    // In production, save to database
    cmsData = {
      ...body,
      lastUpdated: new Date().toISOString()
    };
    
    console.log('CMS content updated:', {
      sectionsCount: cmsData.sections?.length || 0,
      siteName: cmsData.globalSettings?.siteName || 'Unknown',
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'CMS content updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to update CMS content:', error);
    return NextResponse.json(
      { error: 'Failed to update CMS content' },
      { status: 500 }
    );
  }
}

// GET sections for live website
export async function POST(req: NextRequest) {
  try {
    const { action } = await req.json();
    
    if (action === 'getPublicContent') {
      // Return only visible sections for the public website
      const publicContent = cmsData ? {
        ...cmsData,
        sections: cmsData.sections.filter((section: any) => section.isVisible)
      } : null;
      
      return NextResponse.json(publicContent);
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('CMS POST error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}