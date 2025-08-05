'use client';

import { useState, useEffect } from 'react';

interface CMSSection {
  id: string;
  name: string;
  type: string;
  isVisible: boolean;
  order: number;
  content: any;
  lastUpdated: string;
}

interface CMSContent {
  sections: CMSSection[];
  globalSettings: {
    siteName: string;
    tagline: string;
    primaryColor: string;
    secondaryColor: string;
    logoUrl: string;
    favIconUrl: string;
    metaDescription: string;
    socialMediaLinks: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      youtube?: string;
    };
  };
}

export function useCMS() {
  const [cmsContent, setCmsContent] = useState<CMSContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPublicContent();
  }, []);

  const loadPublicContent = async () => {
    try {
      setLoading(true);
      
      // Try to load from the CMS API first
      const response = await fetch('/api/admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getPublicContent' })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.sections) {
          setCmsContent(data);
        } else {
          // Fallback to default content if CMS returns null
          setCmsContent(getDefaultContent());
        }
      } else {
        // Fallback to default content if API fails
        setCmsContent(getDefaultContent());
      }
    } catch (err) {
      console.error('Failed to load CMS content:', err);
      // Use fallback content instead of showing error
      setCmsContent(getDefaultContent());
    } finally {
      setLoading(false);
    }
  };
  
  const getDefaultContent = () => ({
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
          features: [
            'GAR Score Analysis (13 sports)',
            'StarPath XP Progression System',
            '24/7 AI Coaching Engine'
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
              usaFootballBenefits: {
                membershipType: 'Standard Edition',
                price: '$35 (normally $119)',
                discount: '70% OFF',
                includes: [
                  '6-month Go4It Sports platform access',
                  'Digital USA Football Athlete ID Card',
                  '$100,000 accident medical coverage',
                  'USA Football age verification',
                  'Access to sanctioned tournaments',
                  'National Team Development eligibility'
                ]
              }
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
      metaDescription: 'AI-powered athletics platform for neurodivergent student athletes',
      socialMediaLinks: {
        instagram: 'https://instagram.com/go4itsports',
        twitter: 'https://twitter.com/go4itsports'
      }
    }
  });

  const getSection = (sectionId: string) => {
    return cmsContent?.sections.find(section => section.id === sectionId);
  };

  const getSectionContent = (sectionId: string) => {
    const section = getSection(sectionId);
    return section?.content;
  };

  const getGlobalSettings = () => {
    return cmsContent?.globalSettings;
  };

  const isLoaded = !loading && !error && cmsContent;

  return {
    cmsContent,
    loading,
    error,
    isLoaded,
    getSection,
    getSectionContent,
    getGlobalSettings,
    refetch: loadPublicContent
  };
}

// Hook for admin CMS management
export function useAdminCMS() {
  const [cmsContent, setCmsContent] = useState<CMSContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAdminContent();
  }, []);

  const loadAdminContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/cms');

      if (response.ok) {
        const data = await response.json();
        setCmsContent(data);
      } else {
        throw new Error('Failed to load admin content');
      }
    } catch (err) {
      console.error('Failed to load admin CMS content:', err);
      setError('Failed to load admin content');
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async (content: CMSContent) => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });

      if (response.ok) {
        setCmsContent(content);
        return { success: true };
      } else {
        throw new Error('Failed to save content');
      }
    } catch (err) {
      console.error('Failed to save CMS content:', err);
      return { success: false, error: 'Failed to save content' };
    } finally {
      setSaving(false);
    }
  };

  return {
    cmsContent,
    setCmsContent,
    loading,
    saving,
    error,
    saveContent,
    refetch: loadAdminContent
  };
}