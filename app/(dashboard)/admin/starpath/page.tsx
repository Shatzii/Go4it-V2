'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TrendingUp, Users, FileText, Award, Activity } from 'lucide-react';

interface AdminSummaryData {
  stats: {
    totalAthletes: number;
    totalAudits: number;
    ncaaOnTrackPercentage: number;
    averageGAR: number;
    averageARI: number;
    newAthletesThisMonth: number;
  };
  ariTrend: Array<{
    month: string;
    average: number;
  }>;
  athletes: Array<{
    id: string;
    name: string;
    sport: string;
    gradYear: number;
    ari: number;
    garScore: number;
    starRating: number;
    ncaaStatus: string;
    progressPercent: number;
    lastAuditDate: string;
  }>;
  recentAudits: Array<{
    id: string;
    athleteName: string;
    sport: string;
    ari: number;
    ncaaRiskLevel: string;
    createdAt: string;
  }>;
}

export default function AdminStarPathDashboard() {
  const [data, setData] = useState<AdminSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [auditFormOpen, setAuditFormOpen] = useState(false);
  const [followupFormOpen, setFollowupFormOpen] = useState(false);

  useEffect(() => {
    fetchAdminSummary();
  }, []);

  const fetchAdminSummary = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/starpath/admin-summary');
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      // Failed to fetch admin summary
    } finally {
      setLoading(false);
    }
  };

  const handleRunAudit = async (formData: FormData) => {
    try {
      const response = await fetch('/api/transcript-audits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          athleteId: formData.get('athleteId'),
          coreGpa: parseFloat(formData.get('coreGpa') as string),
          coreCoursesCompleted: parseInt(formData.get('coreCoursesCompleted') as string),
          coreCoursesRequired: parseInt(formData.get('coreCoursesRequired') as string),
          notes: formData.get('notes'),
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert('Audit completed successfully!');
        setAuditFormOpen(false);
        fetchAdminSummary(); // Refresh data
      }
    } catch (error) {
      // Failed to run audit
      alert('Failed to complete audit');
    }
  };

  const handleSendFollowup = async (formData: FormData) => {
    try {
      const response = await fetch('/api/automation/starpath-followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          athleteId: formData.get('athleteId'),
          triggerType: formData.get('triggerType'),
          recipientType: formData.get('recipientType'),
          deliveryMethod: formData.get('deliveryMethod'),
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert('Follow-up sent successfully!');
        setFollowupFormOpen(false);
      }
    } catch (error) {
      // Failed to send followup
      alert('Failed to send followup');
    }
  };

  const getNcaaStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-500';
      case 'at-risk':
        return 'bg-yellow-500';
      case 'needs-review':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStarRating = (rating: number) => {
    return '⭐'.repeat(rating);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading StarPath Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Failed to load dashboard data</p>
          <Button onClick={fetchAdminSummary} className="mt-4">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">StarPath Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Unified athlete tracking: Academic • Athletic • Behavioral
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog open={auditFormOpen} onOpenChange={setAuditFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <FileText className="w-4 h-4 mr-2" />
                Run Audit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Run Transcript Audit</DialogTitle>
                <DialogDescription>
                  Complete the audit form to calculate ARI and NCAA status
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRunAudit(new FormData(e.currentTarget));
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="athleteId">Athlete ID</Label>
                  <Input id="athleteId" name="athleteId" required />
                </div>
                <div>
                  <Label htmlFor="coreGpa">Core GPA</Label>
                  <Input
                    id="coreGpa"
                    name="coreGpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="coreCoursesCompleted">Core Courses Completed</Label>
                  <Input
                    id="coreCoursesCompleted"
                    name="coreCoursesCompleted"
                    type="number"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="coreCoursesRequired">Core Courses Required</Label>
                  <Input
                    id="coreCoursesRequired"
                    name="coreCoursesRequired"
                    type="number"
                    defaultValue="16"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea id="notes" name="notes" rows={3} />
                </div>
                <Button type="submit" className="w-full">Complete Audit</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={followupFormOpen} onOpenChange={setFollowupFormOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Activity className="w-4 h-4 mr-2" />
                Send Follow-Up
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Send StarPath Follow-Up</DialogTitle>
                <DialogDescription>
                  Generate and send personalized communication
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendFollowup(new FormData(e.currentTarget));
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="followup-athleteId">Athlete ID</Label>
                  <Input id="followup-athleteId" name="athleteId" required />
                </div>
                <div>
                  <Label htmlFor="triggerType">Trigger Type</Label>
                  <select
                    id="triggerType"
                    name="triggerType"
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="audit-complete">Audit Complete</option>
                    <option value="gar-update">GAR Update</option>
                    <option value="ncaa-change">NCAA Change</option>
                    <option value="milestone">Milestone</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="recipientType">Recipient</Label>
                  <select
                    id="recipientType"
                    name="recipientType"
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="both">Both (Parent & Athlete)</option>
                    <option value="parent">Parent Only</option>
                    <option value="athlete">Athlete Only</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="deliveryMethod">Delivery Method</Label>
                  <select
                    id="deliveryMethod"
                    name="deliveryMethod"
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="email">Email Only</option>
                    <option value="sms">SMS Only</option>
                    <option value="both">Both (Email & SMS)</option>
                  </select>
                </div>
                <Button type="submit" className="w-full">Send Follow-Up</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Athletes</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.totalAthletes}</div>
            <p className="text-xs text-green-600 mt-1">
              +{data.stats.newAthletesThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Audits</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.totalAudits}</div>
            <p className="text-xs text-gray-600 mt-1">Completed assessments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">NCAA On-Track</CardTitle>
            <Award className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.ncaaOnTrackPercentage}%</div>
            <p className="text-xs text-gray-600 mt-1">Eligibility rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Scores</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-sm">
                <span className="font-semibold">ARI:</span> {data.stats.averageARI.toFixed(1)}
              </div>
              <div className="text-sm">
                <span className="font-semibold">GAR:</span> {data.stats.averageGAR.toFixed(1)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ARI Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>ARI Trend (Last 5 Months)</CardTitle>
          <CardDescription>Average Academic Rigor Index over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 h-40">
            {data.ariTrend.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${(item.average / 100) * 100}%` }}
                ></div>
                <div className="text-xs mt-2 font-medium">{item.month}</div>
                <div className="text-xs text-gray-600">{item.average.toFixed(1)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Athletes Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Athletes</CardTitle>
          <CardDescription>Complete roster with metrics and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Athlete</th>
                  <th className="text-left p-3 font-medium">Sport</th>
                  <th className="text-left p-3 font-medium">Grad Year</th>
                  <th className="text-left p-3 font-medium">ARI</th>
                  <th className="text-left p-3 font-medium">GAR</th>
                  <th className="text-left p-3 font-medium">Stars</th>
                  <th className="text-left p-3 font-medium">NCAA Status</th>
                  <th className="text-left p-3 font-medium">Progress</th>
                  <th className="text-left p-3 font-medium">Last Audit</th>
                </tr>
              </thead>
              <tbody>
                {data.athletes.map((athlete) => (
                  <tr key={athlete.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{athlete.name}</td>
                    <td className="p-3">{athlete.sport}</td>
                    <td className="p-3">{athlete.gradYear}</td>
                    <td className="p-3">
                      <Badge variant="outline">{athlete.ari}/100</Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{athlete.garScore}</Badge>
                    </td>
                    <td className="p-3">{getStarRating(athlete.starRating)}</td>
                    <td className="p-3">
                      <Badge className={getNcaaStatusColor(athlete.ncaaStatus)}>
                        {athlete.ncaaStatus.replace('-', ' ')}
                      </Badge>
                    </td>
                    <td className="p-3">{athlete.progressPercent}%</td>
                    <td className="p-3 text-sm text-gray-600">
                      {new Date(athlete.lastAuditDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Audits */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Audits</CardTitle>
          <CardDescription>Latest transcript assessments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.recentAudits.map((audit) => (
              <div
                key={audit.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <div className="font-medium">{audit.athleteName}</div>
                  <div className="text-sm text-gray-600">{audit.sport}</div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">
                    ARI: {audit.ari}/100
                  </Badge>
                  <div className="text-xs text-gray-600">
                    Risk: {audit.ncaaRiskLevel}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(audit.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer Note */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> Database not yet connected. Showing mock data for UI preview.
            Uncomment production code in API routes to connect to real database.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
