'use client';

import { useState, useEffect } from 'react';
import { 
  Save, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Image as ImageIcon, 
  FileText, 
  Settings, 
  Upload,
  Edit3,
  Copy,
  RefreshCw,
  Globe,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Star,
  CheckCircle,
  AlertCircle,
  Video,
  Play
} from 'lucide-react';
import { MediaIntegration, FeaturedMediaSection } from '../../../components/cms/media-integration';

interface CMSSection {
  id: string;
  name: string;
  type: 'hero' | 'events' | 'pricing' | 'features' | 'testimonials' | 'text' | 'gallery';
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

export default function SeamlessCMS() {
  const [cmsContent, setCmsContent] = useState<CMSContent | null>(null);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [mediaAssets, setMediaAssets] = useState<any[]>([]);
  const [showMediaBrowser, setShowMediaBrowser] = useState(false);
  const [featuredAssets, setFeaturedAssets] = useState<string[]>([]);

  useEffect(() => {
    loadCMSContent();
    loadMediaAssets();
  }, []);

  const loadCMSContent = async () => {
    try {
      const response = await fetch('/api/admin/cms');
      if (response.ok) {
        const data = await response.json();
        setCmsContent(data);
      } else {
        // Initialize with default content structure
        setCmsContent({
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
                    ]
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
                    features: [
                      'Basic GAR analysis',
                      'Limited StarPath access',
                      'Community support'
                    ]
                  },
                  {
                    id: 'starter',
                    name: 'Starter',
                    price: '$19',
                    period: 'month',
                    features: [
                      'Full GAR analysis',
                      'Complete StarPath system',
                      'AI coaching insights',
                      'Performance tracking'
                    ]
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
      }
    } catch (error) {
      console.error('Failed to load CMS content:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMediaAssets = async () => {
    try {
      const response = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getForCMS' })
      });
      if (response.ok) {
        const data = await response.json();
        setMediaAssets(data.assets || []);
        setFeaturedAssets(data.featured?.map((asset: any) => asset.id) || []);
      }
    } catch (error) {
      console.error('Failed to load media assets:', error);
    }
  };

  const updateFeaturedAssets = async (assetIds: string[]) => {
    try {
      const response = await fetch('/api/admin/media', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'updateFeatured',
          featuredAssets: assetIds 
        })
      });
      
      if (response.ok) {
        setFeaturedAssets(assetIds);
        console.log('Featured assets updated successfully');
      }
    } catch (error) {
      console.error('Failed to update featured assets:', error);
    }
  };

  const saveContent = async () => {
    if (!cmsContent) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/admin/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cmsContent)
      });

      if (response.ok) {
        setUnsavedChanges(false);
        alert('Content saved successfully!');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save content. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (sectionId: string, updates: Partial<CMSSection>) => {
    if (!cmsContent) return;
    
    setCmsContent({
      ...cmsContent,
      sections: cmsContent.sections.map(section =>
        section.id === sectionId 
          ? { ...section, ...updates, lastUpdated: new Date().toISOString() }
          : section
      )
    });
    setUnsavedChanges(true);
  };

  const updateGlobalSettings = (updates: Partial<CMSContent['globalSettings']>) => {
    if (!cmsContent) return;
    
    setCmsContent({
      ...cmsContent,
      globalSettings: { ...cmsContent.globalSettings, ...updates }
    });
    setUnsavedChanges(true);
  };

  const toggleSectionVisibility = (sectionId: string) => {
    if (!cmsContent) return;
    
    const section = cmsContent.sections.find(s => s.id === sectionId);
    if (section) {
      updateSection(sectionId, { isVisible: !section.isVisible });
    }
  };

  const addNewEvent = () => {
    if (!cmsContent) return;
    
    const eventsSection = cmsContent.sections.find(s => s.id === 'events');
    if (eventsSection) {
      const newEvent = {
        id: Date.now().toString(),
        title: 'New Event',
        description: 'Event description',
        price: '$0',
        location: 'Location TBD',
        dates: 'Dates TBD',
        category: 'EVENT',
        features: ['Feature 1', 'Feature 2'],
        maxParticipants: 50,
        schedule: 'TBD',
        featuredStaff: []
      };

      updateSection('events', {
        content: {
          ...eventsSection.content,
          events: [...eventsSection.content.events, newEvent]
        }
      });
    }
  };

  const removeEvent = (eventId: string) => {
    if (!cmsContent) return;
    
    const eventsSection = cmsContent.sections.find(s => s.id === 'events');
    if (eventsSection) {
      updateSection('events', {
        content: {
          ...eventsSection.content,
          events: eventsSection.content.events.filter((e: any) => e.id !== eventId)
        }
      });
    }
  };

  const renderHeroEditor = () => {
    const heroSection = cmsContent?.sections.find(s => s.id === 'hero');
    if (!heroSection) return null;

    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Main Headline</label>
          <input
            type="text"
            value={heroSection.content.headline || ''}
            onChange={(e) => updateSection('hero', {
              content: { ...heroSection.content, headline: e.target.value }
            })}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Enter main headline"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Subheadline</label>
          <textarea
            value={heroSection.content.subheadline || ''}
            onChange={(e) => updateSection('hero', {
              content: { ...heroSection.content, subheadline: e.target.value }
            })}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            rows={3}
            placeholder="Enter subheadline"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">CTA Button Text</label>
            <input
              type="text"
              value={heroSection.content.ctaText || ''}
              onChange={(e) => updateSection('hero', {
                content: { ...heroSection.content, ctaText: e.target.value }
              })}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Button text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">CTA Link</label>
            <input
              type="text"
              value={heroSection.content.ctaLink || ''}
              onChange={(e) => updateSection('hero', {
                content: { ...heroSection.content, ctaLink: e.target.value }
              })}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="/register"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Key Features (one per line)</label>
          <textarea
            value={heroSection.content.features?.join('\n') || ''}
            onChange={(e) => updateSection('hero', {
              content: { 
                ...heroSection.content, 
                features: e.target.value.split('\n').filter(f => f.trim()) 
              }
            })}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            rows={5}
            placeholder="GAR Score Analysis (13 sports)&#10;StarPath XP Progression System&#10;24/7 AI Coaching Engine"
          />
        </div>
      </div>
    );
  };

  const renderEventsEditor = () => {
    const eventsSection = cmsContent?.sections.find(s => s.id === 'events');
    if (!eventsSection) return null;

    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Section Title</label>
            <input
              type="text"
              value={eventsSection.content.title || ''}
              onChange={(e) => updateSection('events', {
                content: { ...eventsSection.content, title: e.target.value }
              })}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Section Subtitle</label>
            <input
              type="text"
              value={eventsSection.content.subtitle || ''}
              onChange={(e) => updateSection('events', {
                content: { ...eventsSection.content, subtitle: e.target.value }
              })}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Events & Camps</h3>
          <button
            onClick={addNewEvent}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>

        <div className="space-y-6">
          {eventsSection.content.events?.map((event: any, index: number) => (
            <div key={event.id} className="bg-slate-800 border border-slate-600 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-medium text-white">Event {index + 1}</h4>
                <button
                  onClick={() => removeEvent(event.id)}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={event.title || ''}
                    onChange={(e) => {
                      const updatedEvents = eventsSection.content.events.map((ev: any) =>
                        ev.id === event.id ? { ...ev, title: e.target.value } : ev
                      );
                      updateSection('events', {
                        content: { ...eventsSection.content, events: updatedEvents }
                      });
                    }}
                    className="w-full bg-slate-700 border border-slate-500 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Price</label>
                  <input
                    type="text"
                    value={event.price || ''}
                    onChange={(e) => {
                      const updatedEvents = eventsSection.content.events.map((ev: any) =>
                        ev.id === event.id ? { ...ev, price: e.target.value } : ev
                      );
                      updateSection('events', {
                        content: { ...eventsSection.content, events: updatedEvents }
                      });
                    }}
                    className="w-full bg-slate-700 border border-slate-500 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={event.location || ''}
                    onChange={(e) => {
                      const updatedEvents = eventsSection.content.events.map((ev: any) =>
                        ev.id === event.id ? { ...ev, location: e.target.value } : ev
                      );
                      updateSection('events', {
                        content: { ...eventsSection.content, events: updatedEvents }
                      });
                    }}
                    className="w-full bg-slate-700 border border-slate-500 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Dates</label>
                  <input
                    type="text"
                    value={event.dates || ''}
                    onChange={(e) => {
                      const updatedEvents = eventsSection.content.events.map((ev: any) =>
                        ev.id === event.id ? { ...ev, dates: e.target.value } : ev
                      );
                      updateSection('events', {
                        content: { ...eventsSection.content, events: updatedEvents }
                      });
                    }}
                    className="w-full bg-slate-700 border border-slate-500 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Features (one per line)</label>
                <textarea
                  value={event.features?.join('\n') || ''}
                  onChange={(e) => {
                    const updatedEvents = eventsSection.content.events.map((ev: any) =>
                      ev.id === event.id ? { 
                        ...ev, 
                        features: e.target.value.split('\n').filter(f => f.trim()) 
                      } : ev
                    );
                    updateSection('events', {
                      content: { ...eventsSection.content, events: updatedEvents }
                    });
                  }}
                  className="w-full bg-slate-700 border border-slate-500 rounded px-3 py-2 text-white text-sm"
                  rows={4}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderGlobalSettings = () => {
    if (!cmsContent) return null;

    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Site Name</label>
            <input
              type="text"
              value={cmsContent.globalSettings.siteName || ''}
              onChange={(e) => updateGlobalSettings({ siteName: e.target.value })}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Tagline</label>
            <input
              type="text"
              value={cmsContent.globalSettings.tagline || ''}
              onChange={(e) => updateGlobalSettings({ tagline: e.target.value })}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Meta Description</label>
          <textarea
            value={cmsContent.globalSettings.metaDescription || ''}
            onChange={(e) => updateGlobalSettings({ metaDescription: e.target.value })}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Primary Color</label>
            <input
              type="color"
              value={cmsContent.globalSettings.primaryColor || '#3B82F6'}
              onChange={(e) => updateGlobalSettings({ primaryColor: e.target.value })}
              className="w-full h-12 bg-slate-800 border border-slate-600 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Secondary Color</label>
            <input
              type="color"
              value={cmsContent.globalSettings.secondaryColor || '#8B5CF6'}
              onChange={(e) => updateGlobalSettings({ secondaryColor: e.target.value })}
              className="w-full h-12 bg-slate-800 border border-slate-600 rounded-lg"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Social Media Links</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Instagram</label>
              <input
                type="url"
                value={cmsContent.globalSettings.socialMediaLinks?.instagram || ''}
                onChange={(e) => updateGlobalSettings({
                  socialMediaLinks: {
                    ...cmsContent.globalSettings.socialMediaLinks,
                    instagram: e.target.value
                  }
                })}
                className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Twitter/X</label>
              <input
                type="url"
                value={cmsContent.globalSettings.socialMediaLinks?.twitter || ''}
                onChange={(e) => updateGlobalSettings({
                  socialMediaLinks: {
                    ...cmsContent.globalSettings.socialMediaLinks,
                    twitter: e.target.value
                  }
                })}
                className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                placeholder="https://twitter.com/..."
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading CMS...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Top Bar */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Seamless CMS</h1>
            {unsavedChanges && (
              <div className="flex items-center gap-2 text-yellow-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                Unsaved changes
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                previewMode 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-slate-600 hover:bg-slate-500'
              }`}
            >
              {previewMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {previewMode ? 'Exit Preview' : 'Preview'}
            </button>
            <button
              onClick={saveContent}
              disabled={saving || !unsavedChanges}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-slate-800 border-r border-slate-700 min-h-screen p-6">
          <nav className="space-y-2">
            <div className="text-sm font-medium text-slate-400 mb-3">Content Sections</div>
            {cmsContent?.sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors text-left ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${section.isVisible ? 'bg-green-400' : 'bg-slate-500'}`} />
                  <span>{section.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSectionVisibility(section.id);
                  }}
                  className="opacity-60 hover:opacity-100"
                >
                  {section.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </button>
            ))}
            
            <div className="border-t border-slate-700 pt-4 mt-6">
              <button
                onClick={() => setActiveSection('media')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                  activeSection === 'media'
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-slate-700 text-slate-300'
                }`}
              >
                <Video className="w-4 h-4" />
                Featured Media
              </button>
              
              <button
                onClick={() => setActiveSection('global')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                  activeSection === 'global'
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-slate-700 text-slate-300'
                }`}
              >
                <Settings className="w-4 h-4" />
                Global Settings
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl">
            {activeSection === 'global' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Global Settings</h2>
                {renderGlobalSettings()}
              </div>
            )}
            
            {activeSection === 'hero' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Hero Section</h2>
                {renderHeroEditor()}
              </div>
            )}
            
            {activeSection === 'events' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Events & Camps</h2>
                {renderEventsEditor()}
              </div>
            )}
            
            {activeSection === 'media' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Featured Media Management</h2>
                <p className="text-slate-400 mb-6">
                  Select up to 6 media assets to feature on the homepage. These will be displayed in the Featured Content and Training in Action sections.
                </p>
                
                <FeaturedMediaSection
                  mediaAssets={mediaAssets}
                  featuredAssets={featuredAssets}
                  onUpdateFeatured={updateFeaturedAssets}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}