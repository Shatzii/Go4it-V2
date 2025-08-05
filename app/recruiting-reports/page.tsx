'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, Download, Send, Star, Trophy, Target,
  GraduationCap, MapPin, Calendar, Award, Share2,
  CheckCircle, Clock, AlertCircle, ExternalLink
} from 'lucide-react';

interface RecruitingReport {
  id: string;
  athleteName: string;
  sport: string;
  position: string;
  classYear: number;
  garScore: number;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  reportStatus: 'generated' | 'sent' | 'pending';
  generatedAt: string;
  lastUpdated: string;
  collegeTargets: string[];
  highlights: {
    technicalSkills: number;
    athleticism: number;
    gameAwareness: number;
    consistency: number;
    improvementPotential: number;
  };
  academicInfo: {
    gpa: number;
    satScore?: number;
    actScore?: number;
    ncaaEligible: boolean;
  };
  contactInfo: {
    email: string;
    phone: string;
    guardianEmail?: string;
  };
}

const mockReports: RecruitingReport[] = [
  {
    id: '1',
    athleteName: 'Marcus Johnson',
    sport: 'Football',
    position: 'Wide Receiver',
    classYear: 2026,
    garScore: 87,
    verificationStatus: 'verified',
    reportStatus: 'generated',
    generatedAt: '2025-01-03',
    lastUpdated: '2025-01-05',
    collegeTargets: ['University of Miami', 'Ohio State', 'Alabama', 'Georgia'],
    highlights: {
      technicalSkills: 89,
      athleticism: 92,
      gameAwareness: 85,
      consistency: 83,
      improvementPotential: 88
    },
    academicInfo: {
      gpa: 3.7,
      satScore: 1290,
      ncaaEligible: true
    },
    contactInfo: {
      email: 'marcus.johnson@email.com',
      phone: '(555) 123-4567',
      guardianEmail: 'parent.johnson@email.com'
    }
  },
  {
    id: '2',
    athleteName: 'Sofia Rodriguez',
    sport: 'Soccer',
    position: 'Midfielder',
    classYear: 2027,
    garScore: 91,
    verificationStatus: 'verified',
    reportStatus: 'sent',
    generatedAt: '2025-01-02',
    lastUpdated: '2025-01-04',
    collegeTargets: ['Stanford', 'UCLA', 'North Carolina', 'Duke'],
    highlights: {
      technicalSkills: 93,
      athleticism: 88,
      gameAwareness: 94,
      consistency: 90,
      improvementPotential: 89
    },
    academicInfo: {
      gpa: 4.1,
      satScore: 1420,
      ncaaEligible: true
    },
    contactInfo: {
      email: 'sofia.rodriguez@email.com',
      phone: '(555) 987-6543',
      guardianEmail: 'parent.rodriguez@email.com'
    }
  }
];

export default function RecruitingReportsPage() {
  const [reports, setReports] = useState<RecruitingReport[]>(mockReports);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<RecruitingReport | null>(null);
  const [filterSport, setFilterSport] = useState('all');
  const [filterClass, setFilterClass] = useState('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'generated': return <FileText className="w-4 h-4 text-blue-400" />;
      case 'sent': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />;
      default: return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified': return <Badge className="bg-green-500 text-white">VERIFIED</Badge>;
      case 'pending': return <Badge className="bg-yellow-500 text-black">PENDING</Badge>;
      case 'unverified': return <Badge className="bg-slate-500 text-white">UNVERIFIED</Badge>;
      default: return null;
    }
  };

  const generateReport = async (athleteId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/recruiting/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ athleteId })
      });

      if (response.ok) {
        const data = await response.json();
        // Update reports list
        setReports(prev => prev.map(r => 
          r.id === athleteId ? { ...r, reportStatus: 'generated', lastUpdated: new Date().toISOString().split('T')[0] } : r
        ));
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendReport = async (reportId: string, colleges: string[]) => {
    setLoading(true);
    try {
      const response = await fetch('/api/recruiting/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, colleges })
      });

      if (response.ok) {
        setReports(prev => prev.map(r => 
          r.id === reportId ? { ...r, reportStatus: 'sent', lastUpdated: new Date().toISOString().split('T')[0] } : r
        ));
      }
    } catch (error) {
      console.error('Failed to send report:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(report => {
    const sportMatch = filterSport === 'all' || report.sport.toLowerCase() === filterSport;
    const classMatch = filterClass === 'all' || report.classYear.toString() === filterClass;
    return sportMatch && classMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <GraduationCap className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              RECRUITING REPORTS
            </h1>
          </div>
          <p className="text-xl text-slate-300 mb-8">
            AI-generated recruiting reports for verified athletes ready for college recruitment
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Label htmlFor="sport-filter" className="text-slate-300 mb-2 block">Filter by Sport</Label>
            <Select value={filterSport} onValueChange={setFilterSport}>
              <SelectTrigger className="bg-slate-800 border-slate-700">
                <SelectValue placeholder="All Sports" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                <SelectItem value="football">Football</SelectItem>
                <SelectItem value="soccer">Soccer</SelectItem>
                <SelectItem value="basketball">Basketball</SelectItem>
                <SelectItem value="baseball">Baseball</SelectItem>
                <SelectItem value="tennis">Tennis</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <Label htmlFor="class-filter" className="text-slate-300 mb-2 block">Filter by Class</Label>
            <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger className="bg-slate-800 border-slate-700">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="2025">Class of 2025</SelectItem>
                <SelectItem value="2026">Class of 2026</SelectItem>
                <SelectItem value="2027">Class of 2027</SelectItem>
                <SelectItem value="2028">Class of 2028</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <Card key={report.id} className="bg-slate-800 border-slate-700 hover:border-blue-500/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl text-white mb-2">{report.athleteName}</CardTitle>
                    <div className="space-y-1">
                      <p className="text-slate-300 text-sm">{report.sport} • {report.position}</p>
                      <p className="text-slate-400 text-sm">Class of {report.classYear}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getVerificationBadge(report.verificationStatus)}
                    <div className="flex items-center gap-1 mt-2">
                      {getStatusIcon(report.reportStatus)}
                      <span className="text-xs text-slate-400 capitalize">{report.reportStatus}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* GAR Score */}
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">GAR Score</span>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <span className="text-2xl font-bold text-white">{report.garScore}</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">
                    Technical: {report.highlights.technicalSkills} • 
                    Athletic: {report.highlights.athleticism} • 
                    Awareness: {report.highlights.gameAwareness}
                  </div>
                </div>

                {/* Academic Info */}
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">Academic</span>
                    <div className="flex items-center gap-2">
                      {report.academicInfo.ncaaEligible ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className="text-sm text-white">GPA: {report.academicInfo.gpa}</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">
                    {report.academicInfo.satScore && `SAT: ${report.academicInfo.satScore} • `}
                    {report.academicInfo.ncaaEligible ? 'NCAA Eligible' : 'NCAA Review Needed'}
                  </div>
                </div>

                {/* College Targets */}
                <div>
                  <span className="text-sm font-medium text-slate-300 mb-2 block">Target Colleges ({report.collegeTargets.length})</span>
                  <div className="flex flex-wrap gap-1">
                    {report.collegeTargets.slice(0, 3).map((college, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {college}
                      </Badge>
                    ))}
                    {report.collegeTargets.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{report.collegeTargets.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-2">
                  {report.reportStatus === 'pending' && (
                    <Button 
                      onClick={() => generateReport(report.id)}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  )}
                  
                  {report.reportStatus === 'generated' && (
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        onClick={() => sendReport(report.id, report.collegeTargets)}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Send
                      </Button>
                      <Button 
                        onClick={() => setSelectedReport(report)}
                        variant="outline"
                        className="border-slate-600"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  )}
                  
                  {report.reportStatus === 'sent' && (
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        onClick={() => setSelectedReport(report)}
                        variant="outline"
                        className="border-slate-600"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button 
                        onClick={() => {}}
                        variant="outline"
                        className="border-slate-600"
                      >
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  )}
                </div>

                {/* Last Updated */}
                <div className="text-xs text-slate-500 text-center pt-2 border-t border-slate-700">
                  Last updated: {report.lastUpdated}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredReports.length === 0 && (
          <Card className="bg-slate-800 border-slate-700 max-w-2xl mx-auto text-center">
            <CardContent className="p-12">
              <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Reports Found</h3>
              <p className="text-slate-400 mb-6">
                No recruiting reports match your current filters. Try adjusting your search criteria.
              </p>
              <Button 
                onClick={() => {
                  setFilterSport('all');
                  setFilterClass('all');
                }}
                variant="outline"
                className="border-slate-600"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 max-w-3xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Get Your Athletes Recruited</h3>
              <p className="text-slate-300 mb-6">
                Our AI-powered recruiting reports showcase your verified athletes to college coaches with comprehensive performance analytics and academic profiles.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.location.href = '/gar-upload'}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  Get GAR Analysis
                </Button>
                <Button 
                  onClick={() => window.location.href = '/leaderboard'}
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                >
                  <Award className="w-5 h-5 mr-2" />
                  View Verified Athletes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}