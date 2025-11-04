'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  GraduationCap,
  FileText,
  Download,
  Calendar,
  User,
  Building,
  CheckCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface PSEODocument {
  id: number;
  studentName: string;
  school: string;
  createdAt: string;
  status: 'draft' | 'generated' | 'submitted';
  pdfUrl?: string;
}

export default function PSEOGeneratorPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    gradYear: '',
    school: '',
    college: '',
    courses: '',
    gpa: '',
    guardianName: '',
    guardianEmail: '',
    guardianPhone: '',
  });
  const [documents, setDocuments] = useState<PSEODocument[]>([
    {
      id: 1,
      studentName: 'Jordan Matthews',
      school: 'Lincoln High School',
      createdAt: '2025-11-01',
      status: 'generated',
      pdfUrl: '/pseo/jordan-matthews-pseo.pdf',
    },
  ]);

  const generatePSEO = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/pseo/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const doc = await response.json();
        setDocuments([doc, ...documents]);
        setFormData({
          studentName: '',
          gradYear: '',
          school: '',
          college: '',
          courses: '',
          gpa: '',
          guardianName: '',
          guardianEmail: '',
          guardianPhone: '',
        });
      }
    } catch (error) {
      // Failed to generate PSEO document
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    draft: { color: 'bg-slate-500', text: 'Draft' },
    generated: { color: 'bg-green-500', text: 'Generated' },
    submitted: { color: 'bg-blue-500', text: 'Submitted' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black text-white mb-2">
            <span className="text-[#00D4FF]">PSEO</span> Documentation Generator
          </h1>
          <p className="text-slate-400">
            Generate Post-Secondary Enrollment Options documentation for college credit pathways
          </p>
        </div>

        {/* Info Banner */}
        <Card className="bg-gradient-to-r from-[#00D4FF]/10 to-purple-500/10 border-[#00D4FF]/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#00D4FF]/20 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#00D4FF]" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">What is PSEO?</h3>
                <p className="text-sm text-slate-300">
                  PSEO allows high school students to take college courses for both high school and college
                  credit, helping student-athletes get ahead academically while managing their sports
                  schedule.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#00D4FF]" />
                Generate PSEO Documentation
              </CardTitle>
              <CardDescription>Fill in student information to create PSEO forms</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  generatePSEO();
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label className="text-white">Student Name *</Label>
                  <Input
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="Full legal name"
                    required
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Graduation Year *</Label>
                    <Input
                      type="number"
                      value={formData.gradYear}
                      onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
                      placeholder="2026"
                      required
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Current GPA *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.gpa}
                      onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                      placeholder="3.75"
                      required
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">High School *</Label>
                  <Input
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                    placeholder="Lincoln High School"
                    required
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">College/University *</Label>
                  <Input
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    placeholder="University of Minnesota"
                    required
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Intended Courses *</Label>
                  <Textarea
                    value={formData.courses}
                    onChange={(e) => setFormData({ ...formData, courses: e.target.value })}
                    placeholder="List courses you plan to take (e.g., Intro to Psychology, College Algebra, etc.)"
                    required
                    rows={3}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <h4 className="text-sm font-bold text-white mb-3">Guardian Information</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-white">Guardian Name *</Label>
                      <Input
                        value={formData.guardianName}
                        onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                        placeholder="Full name"
                        required
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Guardian Email *</Label>
                      <Input
                        type="email"
                        value={formData.guardianEmail}
                        onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
                        placeholder="parent@email.com"
                        required
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Guardian Phone *</Label>
                      <Input
                        type="tel"
                        value={formData.guardianPhone}
                        onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                        placeholder="(555) 123-4567"
                        required
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#00D4FF] text-slate-950 hover:bg-[#00D4FF]/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate PSEO Documents
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Generated Documents */}
          <div className="space-y-4">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Generated Documents</CardTitle>
                <CardDescription>View and download your PSEO documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.map((doc) => {
                    const config = statusConfig[doc.status];
                    return (
                      <div
                        key={doc.id}
                        className="p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                              <div className="font-bold text-white">{doc.studentName}</div>
                              <div className="text-sm text-slate-400">{doc.school}</div>
                            </div>
                          </div>
                          <Badge className={`${config.color} text-white`}>{config.text}</Badge>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700">
                          <div className="text-xs text-slate-500">
                            Generated: {doc.createdAt}
                          </div>
                          {doc.pdfUrl && (
                            <Button size="sm" className="bg-[#00D4FF] text-slate-950">
                              <Download className="w-4 h-4 mr-1" />
                              Download PDF
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {documents.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">No Documents Yet</h3>
                      <p className="text-slate-400">
                        Fill out the form to generate your first PSEO document
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Documents</p>
                      <p className="text-3xl font-black text-white mt-1">{documents.length}</p>
                    </div>
                    <FileText className="w-8 h-8 text-[#00D4FF]" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Submitted</p>
                      <p className="text-3xl font-black text-white mt-1">
                        {documents.filter((d) => d.status === 'submitted').length}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
