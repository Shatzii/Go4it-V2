'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Award,
  FileText,
  Download,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  GraduationCap,
  Trophy,
  BookOpen,
} from 'lucide-react';

interface Certificate {
  id: string;
  studentName: string;
  studentInitials: string;
  courseName: string;
  title: string;
  description: string;
  issuedDate: string;
  certificateNumber: string;
  status: 'active' | 'revoked' | 'expired';
  type: string;
}

interface TranscriptEntry {
  id: string;
  studentName: string;
  courseName: string;
  courseCode: string;
  grade: string;
  gradePoints: number;
  credits: number;
  status: string;
  academicYear: string;
  semester: string;
}

interface Achievement {
  id: string;
  studentName: string;
  title: string;
  description: string;
  achievementType: string;
  awardedDate: string;
  academicYear: string;
}

export default function CertificationManager({ teacherId }: { teacherId: string }) {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('certificates');
  const [showIssueDialog, setShowIssueDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const [newCertificate, setNewCertificate] = useState({
    studentId: '',
    courseId: '',
    templateId: '1',
    title: '',
    description: '',
    type: 'course_completion',
  });

  useEffect(() => {
    loadData();
  }, [teacherId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [certRes, transRes, achieveRes, studentsRes, coursesRes] = await Promise.all([
        fetch(`/api/academy/certification/certificates?teacherId=${teacherId}`),
        fetch(`/api/academy/certification/transcripts?teacherId=${teacherId}`),
        fetch(`/api/academy/certification/achievements?teacherId=${teacherId}`),
        fetch(`/api/academy/certification/students?teacherId=${teacherId}`),
        fetch(`/api/academy/certification/courses?teacherId=${teacherId}`),
      ]);

      if (certRes.ok) {
        const certData = await certRes.json();
        setCertificates(certData.certificates);
      }

      if (transRes.ok) {
        const transData = await transRes.json();
        setTranscripts(transData.transcripts);
      }

      if (achieveRes.ok) {
        const achieveData = await achieveRes.json();
        setAchievements(achieveData.achievements);
      }

      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudents(studentsData.students);
      }

      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(coursesData.courses);
      }
    } catch (error) {
      console.error('Error loading certification data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const issueCertificate = async () => {
    if (!newCertificate.studentId || !newCertificate.title) return;

    try {
      const response = await fetch('/api/academy/certification/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCertificate,
          teacherId,
        }),
      });

      if (response.ok) {
        setNewCertificate({
          studentId: '',
          courseId: '',
          templateId: '1',
          title: '',
          description: '',
          type: 'course_completion',
        });
        setShowIssueDialog(false);
        loadData();
      }
    } catch (error) {
      console.error('Error issuing certificate:', error);
    }
  };

  const downloadCertificate = async (certificateId: string) => {
    try {
      const response = await fetch(`/api/academy/certification/certificates/${certificateId}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificate-${certificateId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading certificate:', error);
    }
  };

  const revokeCertificate = async (certificateId: string) => {
    if (!confirm('Are you sure you want to revoke this certificate?')) return;

    try {
      const response = await fetch(`/api/academy/certification/certificates/${certificateId}/revoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId }),
      });

      if (response.ok) {
        loadData();
      }
    } catch (error) {
      console.error('Error revoking certificate:', error);
    }
  };

  const filteredCertificates = certificates.filter(cert =>
    cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === 'all' || cert.type === filterType)
  );

  const filteredTranscripts = transcripts.filter(transcript =>
    transcript.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAchievements = achievements.filter(achievement =>
    achievement.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600';
      case 'revoked': return 'bg-red-600';
      case 'expired': return 'bg-yellow-600';
      default: return 'bg-slate-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course_completion': return <GraduationCap className="w-4 h-4" />;
      case 'honor_roll': return <Trophy className="w-4 h-4" />;
      case 'achievement': return <Award className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading certification manager...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Certification Manager</h1>
          <p className="text-slate-400">Issue certificates, manage transcripts, and track achievements</p>
        </div>
        <Dialog open={showIssueDialog} onOpenChange={setShowIssueDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Issue Certificate
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Issue New Certificate</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Student</label>
                <Select value={newCertificate.studentId} onValueChange={(value) => setNewCertificate(prev => ({ ...prev, studentId: value }))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {students.map(student => (
                      <SelectItem key={student.id} value={student.id} className="text-white">
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Course (Optional)</label>
                <Select value={newCertificate.courseId} onValueChange={(value) => setNewCertificate(prev => ({ ...prev, courseId: value }))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id} className="text-white">
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Certificate Type</label>
                <Select value={newCertificate.type} onValueChange={(value) => setNewCertificate(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="course_completion" className="text-white">Course Completion</SelectItem>
                    <SelectItem value="achievement" className="text-white">Achievement</SelectItem>
                    <SelectItem value="honor_roll" className="text-white">Honor Roll</SelectItem>
                    <SelectItem value="graduation" className="text-white">Graduation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Certificate Title</label>
                <Input
                  value={newCertificate.title}
                  onChange={(e) => setNewCertificate(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Certificate of Completion"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <Textarea
                  value={newCertificate.description}
                  onChange={(e) => setNewCertificate(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Certificate description..."
                  rows={3}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={issueCertificate} className="bg-blue-600 hover:bg-blue-700">
                  Issue Certificate
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowIssueDialog(false)}
                  className="border-slate-600 text-slate-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students..."
            className="pl-10 bg-slate-800 border-slate-700 text-white"
          />
        </div>
        {activeTab === 'certificates' && (
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="all" className="text-white">All Types</SelectItem>
              <SelectItem value="course_completion" className="text-white">Course Completion</SelectItem>
              <SelectItem value="achievement" className="text-white">Achievement</SelectItem>
              <SelectItem value="honor_roll" className="text-white">Honor Roll</SelectItem>
              <SelectItem value="graduation" className="text-white">Graduation</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'certificates', label: 'Certificates', icon: Award },
          { id: 'transcripts', label: 'Transcripts', icon: FileText },
          { id: 'achievements', label: 'Achievements', icon: Trophy },
        ].map(tab => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'outline'}
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? 'bg-blue-600' : 'border-slate-600 text-slate-300'}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Certificates Tab */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          {filteredCertificates.map(certificate => (
            <Card key={certificate.id} className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-slate-600">
                        {certificate.studentInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-white font-medium">{certificate.studentName}</h3>
                      <p className="text-slate-400 text-sm">{certificate.courseName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(certificate.status)}>
                      {certificate.status}
                    </Badge>
                    <div className="flex gap-1">
                      {getTypeIcon(certificate.type)}
                      <span className="text-slate-300 text-sm capitalize">
                        {certificate.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-white font-medium">{certificate.title}</h4>
                  <p className="text-slate-300 text-sm mt-1">{certificate.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                    <span>Certificate #{certificate.certificateNumber}</span>
                    <span>Issued: {new Date(certificate.issuedDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    onClick={() => downloadCertificate(certificate.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  {certificate.status === 'active' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => revokeCertificate(certificate.id)}
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Revoke
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Transcripts Tab */}
      {activeTab === 'transcripts' && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Student Transcripts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Student</TableHead>
                  <TableHead className="text-slate-300">Course</TableHead>
                  <TableHead className="text-slate-300">Grade</TableHead>
                  <TableHead className="text-slate-300">Credits</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Year/Semester</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTranscripts.map(transcript => (
                  <TableRow key={transcript.id} className="border-slate-700">
                    <TableCell className="text-white">{transcript.studentName}</TableCell>
                    <TableCell className="text-white">
                      <div>
                        <div className="font-medium">{transcript.courseName}</div>
                        <div className="text-slate-400 text-sm">{transcript.courseCode}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white">
                      <Badge className={transcript.grade.includes('A') ? 'bg-green-600' : transcript.grade.includes('B') ? 'bg-blue-600' : 'bg-yellow-600'}>
                        {transcript.grade}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white">{transcript.credits}</TableCell>
                    <TableCell>
                      <Badge className={transcript.status === 'completed' ? 'bg-green-600' : 'bg-slate-600'}>
                        {transcript.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {transcript.academicYear} {transcript.semester}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="space-y-4">
          {filteredAchievements.map(achievement => (
            <Card key={achievement.id} className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Trophy className="w-8 h-8 text-yellow-400" />
                    <div>
                      <h3 className="text-white font-medium">{achievement.studentName}</h3>
                      <p className="text-slate-400 text-sm">{achievement.title}</p>
                    </div>
                  </div>
                  <Badge className="bg-purple-600">
                    {achievement.achievementType.replace('_', ' ')}
                  </Badge>
                </div>

                <p className="text-slate-300 mt-2">{achievement.description}</p>

                <div className="flex items-center gap-4 mt-4 text-sm text-slate-400">
                  <span>Awarded: {new Date(achievement.awardedDate).toLocaleDateString()}</span>
                  <span>{achievement.academicYear}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}