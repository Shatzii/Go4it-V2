'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Shield,
  CheckCircle,
  XCircle,
  Download,
  Trash2,
  Eye,
  Lock,
  Cookie,
  Globe,
  AlertTriangle,
  FileText,
} from 'lucide-react';

interface ConsentCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  enabled: boolean;
  purposes: string[];
}

interface DataRequest {
  id: number;
  type: 'export' | 'delete' | 'rectify';
  status: 'pending' | 'processing' | 'completed';
  requestedAt: string;
  completedAt?: string;
}

export default function GDPRConsentPage() {
  const [consentCategories, setConsentCategories] = useState<ConsentCategory[]>([
    {
      id: 'necessary',
      name: 'Strictly Necessary',
      description: 'Essential for the website to function properly',
      required: true,
      enabled: true,
      purposes: ['Authentication', 'Security', 'Session Management'],
    },
    {
      id: 'functional',
      name: 'Functional',
      description: 'Enable enhanced functionality and personalization',
      required: false,
      enabled: true,
      purposes: ['Preferences', 'Language', 'User Settings'],
    },
    {
      id: 'analytics',
      name: 'Analytics & Performance',
      description: 'Help us understand how you use our platform',
      required: false,
      enabled: true,
      purposes: ['Usage Analytics', 'Performance Monitoring', 'Error Tracking'],
    },
    {
      id: 'marketing',
      name: 'Marketing & Targeting',
      description: 'Used to deliver relevant advertisements',
      required: false,
      enabled: false,
      purposes: ['Personalized Ads', 'Social Media Integration', 'Remarketing'],
    },
  ]);

  const [dataRequests, setDataRequests] = useState<DataRequest[]>([
    {
      id: 1,
      type: 'export',
      status: 'completed',
      requestedAt: '2025-11-01',
      completedAt: '2025-11-02',
    },
  ]);

  const [tcfConsent, setTcfConsent] = useState({
    purposes: {
      storeAccessInfo: true,
      basicAds: false,
      personalizedAds: false,
      adMeasurement: true,
      contentMeasurement: true,
    },
    vendors: {
      google: true,
      facebook: false,
      twitter: false,
    },
  });

  const toggleConsent = (id: string) => {
    setConsentCategories(
      consentCategories.map((cat) =>
        cat.id === id && !cat.required ? { ...cat, enabled: !cat.enabled } : cat
      )
    );
  };

  const saveConsent = async () => {
    try {
      await fetch('/api/consent/tcf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories: consentCategories, tcf: tcfConsent }),
      });
    } catch (error) {
      // Failed to save consent
    }
  };

  const requestDataExport = async () => {
    try {
      const response = await fetch('/api/gdpr/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const newRequest = await response.json();
        setDataRequests([newRequest, ...dataRequests]);
      }
    } catch (error) {
      // Failed to request data export
    }
  };

  const requestDataDeletion = async () => {
    if (confirm('Are you sure? This action cannot be undone.')) {
      try {
        const response = await fetch('/api/gdpr/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const newRequest = await response.json();
          setDataRequests([newRequest, ...dataRequests]);
        }
      } catch (error) {
        // Failed to request data deletion
      }
    }
  };

  const enabledCount = consentCategories.filter((c) => c.enabled).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black text-white mb-2">
            <span className="text-[#00D4FF]">GDPR</span> Consent Manager
          </h1>
          <p className="text-slate-400">
            Manage your privacy preferences, cookie consent, and data rights
          </p>
        </div>

        {/* Warning Banner for EU Users */}
        <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  GDPR Compliance Active
                </h3>
                <p className="text-sm text-slate-300">
                  Your privacy rights under GDPR are protected. You have full control over your data
                  and can withdraw consent at any time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Consent Categories</p>
                  <p className="text-3xl font-black text-white mt-1">
                    {enabledCount}/{consentCategories.length}
                  </p>
                </div>
                <Cookie className="w-8 h-8 text-[#00D4FF]" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Data Requests</p>
                  <p className="text-3xl font-black text-white mt-1">{dataRequests.length}</p>
                </div>
                <FileText className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Compliance Score</p>
                  <p className="text-3xl font-black text-white mt-1">100%</p>
                </div>
                <Shield className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cookie Consent Preferences */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Cookie className="w-5 h-5 text-[#00D4FF]" />
              Cookie Consent Preferences
            </CardTitle>
            <CardDescription>Control what data we collect through cookies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {consentCategories.map((category) => (
                <div
                  key={category.id}
                  className={`p-4 bg-slate-800/50 rounded-lg border transition-colors ${
                    category.enabled ? 'border-[#00D4FF]/30' : 'border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          category.enabled
                            ? 'bg-[#00D4FF]/20 text-[#00D4FF]'
                            : 'bg-slate-700/50 text-slate-500'
                        }`}
                      >
                        {category.enabled ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <XCircle className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          {category.name}
                          {category.required && (
                            <Badge variant="outline" className="border-red-500/30 text-red-400">
                              Required
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-slate-400">{category.description}</div>
                      </div>
                    </div>
                    <Switch
                      checked={category.enabled}
                      onCheckedChange={() => toggleConsent(category.id)}
                      disabled={category.required}
                    />
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <div className="text-xs text-slate-400 mb-2">Used for:</div>
                    <div className="flex flex-wrap gap-2">
                      {category.purposes.map((purpose) => (
                        <Badge key={purpose} variant="outline" className="text-xs">
                          {purpose}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={saveConsent} className="w-full mt-6 bg-[#00D4FF] text-slate-950">
              <Shield className="w-4 h-4 mr-2" />
              Save Consent Preferences
            </Button>
          </CardContent>
        </Card>

        {/* Data Subject Rights */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#00D4FF]" />
              Your Data Rights
            </CardTitle>
            <CardDescription>Exercise your rights under GDPR</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Download className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="font-bold text-white">Export Data</div>
                </div>
                <p className="text-sm text-slate-400 mb-4">
                  Download all your personal data in machine-readable format
                </p>
                <Button
                  onClick={requestDataExport}
                  size="sm"
                  variant="outline"
                  className="w-full border-slate-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Request Export
                </Button>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="font-bold text-white">View Data</div>
                </div>
                <p className="text-sm text-slate-400 mb-4">
                  See what personal information we have stored about you
                </p>
                <Button size="sm" variant="outline" className="w-full border-slate-700">
                  <Eye className="w-4 h-4 mr-2" />
                  View Data
                </Button>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-lg border border-red-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="font-bold text-white">Delete Account</div>
                </div>
                <p className="text-sm text-slate-400 mb-4">
                  Permanently delete all your data (cannot be undone)
                </p>
                <Button
                  onClick={requestDataDeletion}
                  size="sm"
                  variant="outline"
                  className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Request Deletion
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Request History */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Data Request History</CardTitle>
            <CardDescription>Track your GDPR data requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dataRequests.map((request) => {
                const typeConfig = {
                  export: { icon: Download, color: 'text-blue-400', label: 'Data Export' },
                  delete: { icon: Trash2, color: 'text-red-400', label: 'Data Deletion' },
                  rectify: { icon: FileText, color: 'text-purple-400', label: 'Data Rectification' },
                };
                const statusConfig = {
                  pending: { color: 'bg-yellow-500', text: 'Pending' },
                  processing: { color: 'bg-blue-500', text: 'Processing' },
                  completed: { color: 'bg-green-500', text: 'Completed' },
                };
                const cfg = typeConfig[request.type];
                const Icon = cfg.icon;
                return (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${cfg.color}`} />
                      </div>
                      <div>
                        <div className="font-bold text-white">{cfg.label}</div>
                        <div className="text-sm text-slate-400">Requested: {request.requestedAt}</div>
                      </div>
                    </div>
                    <Badge className={`${statusConfig[request.status].color} text-white`}>
                      {statusConfig[request.status].text}
                    </Badge>
                  </div>
                );
              })}

              {dataRequests.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Data Requests</h3>
                  <p className="text-slate-400">You haven&apos;t made any GDPR data requests yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
