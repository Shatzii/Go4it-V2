'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Key,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Plus,
  Trash2,
  RefreshCw,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface License {
  id: number;
  key: string;
  type: 'prospect' | 'elite' | 'pro' | 'academy';
  status: 'active' | 'expired' | 'revoked' | 'pending';
  assignedTo?: string;
  assignedEmail?: string;
  maxUsers: number;
  currentUsers: number;
  createdAt: string;
  expiresAt: string;
}

export default function LicenseControlPage() {
  const [licenses, setLicenses] = useState<License[]>([
    {
      id: 1,
      key: 'GO4IT-ELITE-A7B2C9D4',
      type: 'elite',
      status: 'active',
      assignedTo: 'Jordan Matthews',
      assignedEmail: 'jordan.m@email.com',
      maxUsers: 5,
      currentUsers: 3,
      createdAt: '2025-10-01',
      expiresAt: '2026-10-01',
    },
    {
      id: 2,
      key: 'GO4IT-PRO-E8F3G1H5',
      type: 'pro',
      status: 'active',
      assignedTo: 'Lincoln HS Football',
      assignedEmail: 'coach@lincolnhs.edu',
      maxUsers: 25,
      currentUsers: 18,
      createdAt: '2025-09-15',
      expiresAt: '2026-09-15',
    },
    {
      id: 3,
      key: 'GO4IT-PROS-I6J2K8L3',
      type: 'prospect',
      status: 'expired',
      assignedTo: 'Trial User',
      assignedEmail: 'trial@email.com',
      maxUsers: 1,
      currentUsers: 1,
      createdAt: '2025-08-01',
      expiresAt: '2025-08-31',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const createLicense = async (type: string, maxUsers: number) => {
    setLoading(true);
    try {
      const response = await fetch('/api/license-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, maxUsers }),
      });
      if (response.ok) {
        const newLicense = await response.json();
        setLicenses([newLicense, ...licenses]);
        setShowCreateForm(false);
      }
    } catch (error) {
      // Failed to create license
    } finally {
      setLoading(false);
    }
  };

  const revokeLicense = async (licenseId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/license-control/${licenseId}/revoke`, {
        method: 'POST',
      });
      if (response.ok) {
        setLicenses(
          licenses.map((l) => (l.id === licenseId ? { ...l, status: 'revoked' as const } : l))
        );
      }
    } catch (error) {
      // Failed to revoke license
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    active: { color: 'bg-green-500', icon: CheckCircle, text: 'Active' },
    expired: { color: 'bg-red-500', icon: XCircle, text: 'Expired' },
    revoked: { color: 'bg-slate-500', icon: XCircle, text: 'Revoked' },
    pending: { color: 'bg-yellow-500', icon: Clock, text: 'Pending' },
  };

  const typeConfig = {
    prospect: { color: 'border-slate-500/30', text: 'Prospect', price: 'Free' },
    elite: { color: 'border-blue-500/30', text: 'Elite', price: '$49/mo' },
    pro: { color: 'border-purple-500/30', text: 'Pro', price: '$199/mo' },
    academy: { color: 'border-yellow-500/30', text: 'Academy', price: '$499/mo' },
  };

  const totalActive = licenses.filter((l) => l.status === 'active').length;
  const totalUsers = licenses.reduce((acc, l) => acc + l.currentUsers, 0);
  const totalRevenue = licenses
    .filter((l) => l.status === 'active')
    .reduce((acc, l) => {
      const prices = { prospect: 0, elite: 49, pro: 199, academy: 499 };
      return acc + prices[l.type];
    }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">
              License <span className="text-[#00D4FF]">Control</span>
            </h1>
            <p className="text-slate-400">
              Manage software licenses, access control, and user limits
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-[#00D4FF] text-slate-950 hover:bg-[#00D4FF]/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create License
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Active Licenses</p>
                  <p className="text-3xl font-black text-white mt-1">{totalActive}</p>
                </div>
                <Key className="w-8 h-8 text-[#00D4FF]" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Users</p>
                  <p className="text-3xl font-black text-white mt-1">{totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Monthly Revenue</p>
                  <p className="text-3xl font-black text-white mt-1">${totalRevenue}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Expiring Soon</p>
                  <p className="text-3xl font-black text-white mt-1">2</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create License Form */}
        {showCreateForm && (
          <Card className="bg-slate-900/50 border-[#00D4FF]/30">
            <CardHeader>
              <CardTitle className="text-white">Create New License</CardTitle>
              <CardDescription>Generate a new license key for a customer</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  createLicense(
                    formData.get('type') as string,
                    parseInt(formData.get('maxUsers') as string)
                  );
                }}
                className="grid md:grid-cols-4 gap-4"
              >
                <div className="space-y-2">
                  <Label className="text-white">License Type</Label>
                  <select
                    name="type"
                    required
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="prospect">Prospect</option>
                    <option value="elite">Elite</option>
                    <option value="pro">Pro</option>
                    <option value="academy">Academy</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Max Users</Label>
                  <Input
                    name="maxUsers"
                    type="number"
                    defaultValue={1}
                    required
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Assigned To (Optional)</Label>
                  <Input
                    name="assignedTo"
                    placeholder="Customer name"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#00D4FF] text-slate-950"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Key className="w-4 h-4 mr-2" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* License List */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">License Management</CardTitle>
            <CardDescription>All active and inactive licenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {licenses.map((license) => {
                const statusCfg = statusConfig[license.status];
                const typeCfg = typeConfig[license.type];
                const StatusIcon = statusCfg.icon;
                const usagePercent = (license.currentUsers / license.maxUsers) * 100;

                return (
                  <div
                    key={license.id}
                    className={`p-4 bg-slate-800/50 rounded-lg border ${typeCfg.color}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00D4FF]/20 to-purple-500/20 flex items-center justify-center">
                          <Key className="w-6 h-6 text-[#00D4FF]" />
                        </div>
                        <div>
                          <div className="font-mono text-white font-bold">{license.key}</div>
                          <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                            {license.assignedTo && (
                              <span>
                                {license.assignedTo} • {license.assignedEmail}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`${typeCfg.color} text-white`}>
                          {typeCfg.text}
                        </Badge>
                        <Badge className={`${statusCfg.color} text-white`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusCfg.text}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-700">
                      <div>
                        <div className="text-xs text-slate-400 mb-1">User Limit</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#00D4FF]"
                              style={{ width: `${usagePercent}%` }}
                            ></div>
                          </div>
                          <div className="text-sm font-bold text-white">
                            {license.currentUsers}/{license.maxUsers}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Expires</div>
                        <div className="text-sm text-white">{license.expiresAt}</div>
                      </div>
                      <div className="flex items-end justify-end gap-2">
                        {license.status === 'active' && (
                          <>
                            <Button size="sm" variant="outline" className="border-slate-700">
                              <RefreshCw className="w-4 h-4 mr-1" />
                              Renew
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => revokeLicense(license.id)}
                              variant="outline"
                              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Revoke
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
