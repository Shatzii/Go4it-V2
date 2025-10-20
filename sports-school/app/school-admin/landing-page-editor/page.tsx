'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, Eye } from 'lucide-react';

interface LandingPageContent {
  schoolId: string;
  heroTitle: string;
  heroSubtitle: string;
  featuredPrograms: string[];
  announcements: string[];
  contactInfo: {
    phone?: string;
    email?: string;
    address?: string;
  };
}

export default function LandingPageEditor() {
  const { user } = useAuth();
  const [content, setContent] = useState<LandingPageContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchLandingPageContent();
  }, []);

  const fetchLandingPageContent = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/school-admin/landing-page', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setContent(data.content);
      }
    } catch (error) {
      console.error('Failed to fetch landing page content:', error);
    }
  };

  const handleSave = async () => {
    if (!content) return;

    setSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/school-admin/landing-page', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        setMessage('Landing page updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to update landing page');
      }
    } catch (error) {
      setMessage('Error updating landing page');
    } finally {
      setSaving(false);
    }
  };

  if (!content) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Landing Page Editor</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>Main banner content that visitors see first</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Hero Title</label>
              <Input
                value={content.heroTitle}
                onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                placeholder="Enter main headline"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Hero Subtitle</label>
              <Input
                value={content.heroSubtitle}
                onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                placeholder="Enter subtitle or tagline"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Featured Programs</CardTitle>
            <CardDescription>Highlight your school's key programs</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={content.featuredPrograms.join('\n')}
              onChange={(e) =>
                setContent({
                  ...content,
                  featuredPrograms: e.target.value.split('\n').filter((p) => p.trim()),
                })
              }
              placeholder="Enter one program per line"
              className="min-h-32"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
            <CardDescription>Important news and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={content.announcements.join('\n')}
              onChange={(e) =>
                setContent({
                  ...content,
                  announcements: e.target.value.split('\n').filter((a) => a.trim()),
                })
              }
              placeholder="Enter one announcement per line"
              className="min-h-32"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>School contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input
                value={content.contactInfo.phone || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contactInfo: { ...content.contactInfo, phone: e.target.value },
                  })
                }
                placeholder="School phone number"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                value={content.contactInfo.email || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contactInfo: { ...content.contactInfo, email: e.target.value },
                  })
                }
                placeholder="School email address"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Address</label>
              <Textarea
                value={content.contactInfo.address || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contactInfo: { ...content.contactInfo, address: e.target.value },
                  })
                }
                placeholder="School address"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
