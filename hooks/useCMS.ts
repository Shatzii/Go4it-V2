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
      const response = await fetch('/api/admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getPublicContent' })
      });

      if (response.ok) {
        const data = await response.json();
        setCmsContent(data);
      } else {
        throw new Error('Failed to load content');
      }
    } catch (err) {
      console.error('Failed to load CMS content:', err);
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

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