'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Link as LinkIcon,
  Copy,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Eye,
  MousePointerClick,
  Plus,
  Trash2,
  ExternalLink,
  Loader2,
} from 'lucide-react';

interface Shortlink {
  id: number;
  shortCode: string;
  destination: string;
  title: string;
  campaign?: string;
  clicks: number;
  uniqueClicks: number;
  createdAt: string;
  expiresAt?: string;
  status: 'active' | 'expired' | 'disabled';
}

export default function ShortlinkManagerPage() {
  const [shortlinks, setShortlinks] = useState<Shortlink[]>([
    {
      id: 1,
      shortCode: 'go4it/elite',
      destination: 'https://go4it.app/plans/elite',
      title: 'Elite Plan Signup',
      campaign: 'Q4 2025 Promotion',
      clicks: 1247,
      uniqueClicks: 892,
      createdAt: '2025-10-01',
      status: 'active',
    },
    {
      id: 2,
      shortCode: 'go4it/recruit',
      destination: 'https://go4it.app/recruiting-hub',
      title: 'Recruiting Hub Landing',
      campaign: 'Parent Night Campaign',
      clicks: 534,
      uniqueClicks: 412,
      createdAt: '2025-10-15',
      status: 'active',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const createShortlink = async (data: { destination: string; customCode?: string; title: string }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/shortlink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const newLink = await response.json();
        setShortlinks([newLink, ...shortlinks]);
        setShowCreateForm(false);
      }
    } catch (error) {
      // Failed to create shortlink
    } finally {
      setLoading(false);
    }
  };

  const deleteShortlink = async (id: number) => {
    if (confirm('Are you sure you want to delete this shortlink?')) {
      try {
        await fetch(`/api/shortlink/${id}`, { method: 'DELETE' });
        setShortlinks(shortlinks.filter((s) => s.id !== id));
      } catch (error) {
        // Failed to delete shortlink
      }
    }
  };

  const copyToClipboard = (id: number, shortCode: string) => {
    navigator.clipboard.writeText(`https://${shortCode}`);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const totalClicks = shortlinks.reduce((acc, s) => acc + s.clicks, 0);
  const totalUnique = shortlinks.reduce((acc, s) => acc + s.uniqueClicks, 0);
  const avgCTR = totalUnique > 0 ? ((totalClicks / totalUnique) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">
              <span className="text-[#00D4FF]">Shortlink</span> Manager
            </h1>
            <p className="text-slate-400">
              Create branded short links and track campaign performance
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-[#00D4FF] text-slate-950 hover:bg-[#00D4FF]/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Shortlink
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Links</p>
                  <p className="text-3xl font-black text-white mt-1">{shortlinks.length}</p>
                </div>
                <LinkIcon className="w-8 h-8 text-[#00D4FF]" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Clicks</p>
                  <p className="text-3xl font-black text-white mt-1">{totalClicks}</p>
                </div>
                <MousePointerClick className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Unique Visitors</p>
                  <p className="text-3xl font-black text-white mt-1">{totalUnique}</p>
                </div>
                <Eye className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Avg CTR</p>
                  <p className="text-3xl font-black text-white mt-1">{avgCTR}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Shortlink Form */}
        {showCreateForm && (
          <Card className="bg-slate-900/50 border-[#00D4FF]/30">
            <CardHeader>
              <CardTitle className="text-white">Create New Shortlink</CardTitle>
              <CardDescription>Generate a branded short URL for your campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  createShortlink({
                    destination: formData.get('destination') as string,
                    customCode: formData.get('customCode') as string,
                    title: formData.get('title') as string,
                  });
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label className="text-white">Destination URL *</Label>
                  <Input
                    name="destination"
                    type="url"
                    placeholder="https://go4it.app/your-page"
                    required
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Custom Short Code (Optional)</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">go4it/</span>
                      <Input
                        name="customCode"
                        placeholder="promo2025"
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Title *</Label>
                    <Input
                      name="title"
                      placeholder="Campaign Name"
                      required
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#00D4FF] text-slate-950"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <LinkIcon className="w-4 h-4 mr-2" />
                  )}
                  Create Shortlink
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Shortlink List */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Your Shortlinks</CardTitle>
            <CardDescription>Manage and track all your short URLs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {shortlinks.map((link) => {
                const ctr = link.uniqueClicks > 0 ? ((link.clicks / link.uniqueClicks) * 100).toFixed(1) : 0;
                return (
                  <div
                    key={link.id}
                    className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-[#00D4FF]/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00D4FF]/20 to-purple-500/20 flex items-center justify-center">
                          <LinkIcon className="w-6 h-6 text-[#00D4FF]" />
                        </div>
                        <div>
                          <div className="font-bold text-white">{link.title}</div>
                          <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                            <code className="px-2 py-1 bg-slate-900 rounded text-[#00D4FF]">
                              {link.shortCode}
                            </code>
                            <span>→</span>
                            <span className="truncate max-w-md">{link.destination}</span>
                          </div>
                          {link.campaign && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              {link.campaign}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            link.status === 'active'
                              ? 'bg-green-500 text-white'
                              : 'bg-slate-500 text-white'
                          }
                        >
                          {link.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-700">
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Total Clicks</div>
                        <div className="text-2xl font-black text-white">{link.clicks}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Unique Visitors</div>
                        <div className="text-2xl font-black text-white">{link.uniqueClicks}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Click-Through Rate</div>
                        <div className="text-2xl font-black text-white">{ctr}%</div>
                      </div>
                      <div className="flex items-end justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => copyToClipboard(link.id, link.shortCode)}
                          variant="outline"
                          className="border-slate-700"
                        >
                          {copied === link.id ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1 text-green-400" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-700"
                          onClick={() => window.open(`https://${link.shortCode}`, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => deleteShortlink(link.id)}
                          variant="outline"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {shortlinks.length === 0 && (
                <div className="text-center py-12">
                  <LinkIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Shortlinks Yet</h3>
                  <p className="text-slate-400 mb-4">
                    Create your first shortlink to start tracking clicks
                  </p>
                  <Button onClick={() => setShowCreateForm(true)} className="bg-[#00D4FF] text-slate-950">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Shortlink
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Links */}
        {shortlinks.length > 0 && (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#00D4FF]" />
                Top Performing Links
              </CardTitle>
              <CardDescription>Links with the most engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {shortlinks
                  .sort((a, b) => b.clicks - a.clicks)
                  .slice(0, 3)
                  .map((link, index) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D4FF]/20 to-purple-500/20 flex items-center justify-center">
                          <span className="text-sm font-bold text-[#00D4FF]">#{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{link.title}</div>
                          <div className="text-xs text-slate-400">{link.shortCode}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black text-white">{link.clicks}</div>
                        <div className="text-xs text-slate-400">clicks</div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
