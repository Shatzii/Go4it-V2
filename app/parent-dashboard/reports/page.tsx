'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart,
  FileText,
  Filter,
  Share,
  Printer,
  Mail,
  Eye,
  ChevronDown,
  Award,
  Clock,
  Target,
  BookOpen,
  Users,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

interface ReportData {
  period: string;
  overallGrade: number;
  subjects: {
    name: string;
    grade: number;
    assignments: number;
    participation: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  attendance: {
    present: number;
    total: number;
    tardies: number;
    excused: number;
  };
  behaviorNotes: string[];
  achievements: string[];
  recommendations: string[];
}

export default function ParentReports() {
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [selectedStudent, setSelectedStudent] = useState('emma');
  const [reportType, setReportType] = useState<'detailed' | 'summary' | 'progress'>('detailed');

  const students = [
    { id: 'emma', name: 'Emma Rodriguez', grade: 'K' },
    { id: 'marcus', name: 'Marcus Johnson', grade: '3' },
  ];

  const reportData: ReportData = {
    period: 'Quarter 1, 2024-25',
    overallGrade: 92,
    subjects: [
      {
        name: 'Mathematics',
        grade: 95,
        assignments: 18,
        participation: 98,
        trend: 'up',
      },
      {
        name: 'English Language Arts',
        grade: 89,
        assignments: 15,
        participation: 92,
        trend: 'stable',
      },
      {
        name: 'Science',
        grade: 92,
        assignments: 12,
        participation: 95,
        trend: 'up',
      },
      {
        name: 'Social Studies',
        grade: 86,
        assignments: 10,
        participation: 88,
        trend: 'down',
      },
      {
        name: 'Fine Arts',
        grade: 94,
        assignments: 8,
        participation: 96,
        trend: 'up',
      },
      {
        name: 'Physical Education',
        grade: 97,
        assignments: 6,
        participation: 99,
        trend: 'stable',
      },
    ],
    attendance: {
      present: 42,
      total: 45,
      tardies: 1,
      excused: 2,
    },
    behaviorNotes: [
      'Excellent collaboration during group activities',
      'Shows leadership qualities in classroom discussions',
      'Consistently follows classroom rules and procedures',
    ],
    achievements: [
      'Math Master Award - Completed 10 consecutive assignments with A grades',
      'Helpful Hero Recognition - Consistently assists classmates',
      'Perfect Attendance Star - Only 1 absence this quarter',
    ],
    recommendations: [
      'Continue practicing reading at home to strengthen comprehension skills',
      'Encourage creative writing activities to improve English Language Arts performance',
      'Consider advanced math enrichment activities to challenge mathematical thinking',
    ],
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeLetter = (grade: number) => {
    if (grade >= 97) return 'A+';
    if (grade >= 93) return 'A';
    if (grade >= 90) return 'A-';
    if (grade >= 87) return 'B+';
    if (grade >= 83) return 'B';
    if (grade >= 80) return 'B-';
    if (grade >= 77) return 'C+';
    if (grade >= 73) return 'C';
    if (grade >= 70) return 'C-';
    return 'F';
  };

  const selectedStudentData = students.find((s) => s.id === selectedStudent);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 shadow-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/parent-dashboard" className="text-blue-600 hover:text-blue-700">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-semibold text-white">Academic Reports</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-white hover:bg-gray-100 rounded-lg">
                <Share className="w-4 h-4" />
                Share
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-white hover:bg-gray-100 rounded-lg">
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-6 mb-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} (Grade {student.grade})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="current">Current Quarter</option>
                <option value="q1">Quarter 1</option>
                <option value="q2">Quarter 2</option>
                <option value="semester1">Semester 1</option>
                <option value="year">Full Year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="detailed">Detailed Report</option>
                <option value="summary">Summary Report</option>
                <option value="progress">Progress Report</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg">
                <Filter className="w-4 h-4" />
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Report Header */}
        <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">{selectedStudentData?.name}</h2>
              <p className="text-gray-600">
                Grade {selectedStudentData?.grade} • SuperHero Elementary
              </p>
              <p className="text-gray-600">{reportData.period}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">
                {getGradeLetter(reportData.overallGrade)}
              </div>
              <div className="text-lg text-gray-600">{reportData.overallGrade}%</div>
              <div className="text-sm text-gray-500">Overall Grade</div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {reportData.attendance.present}/{reportData.attendance.total}
              </div>
              <div className="text-sm text-gray-600">Days Present</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {reportData.subjects.reduce((sum, s) => sum + s.assignments, 0)}
              </div>
              <div className="text-sm text-gray-600">Assignments Completed</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {reportData.achievements.length}
              </div>
              <div className="text-sm text-gray-600">Achievements Earned</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {Math.round(
                  reportData.subjects.reduce((sum, s) => sum + s.participation, 0) /
                    reportData.subjects.length,
                )}
                %
              </div>
              <div className="text-sm text-gray-600">Avg Participation</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Subject Performance */}
            <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Subject Performance</h3>
              <div className="space-y-4">
                {reportData.subjects.map((subject) => (
                  <div key={subject.name} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-white">{subject.name}</h4>
                        {getTrendIcon(subject.trend)}
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getGradeColor(subject.grade)}`}>
                          {getGradeLetter(subject.grade)}
                        </div>
                        <div className="text-sm text-gray-500">{subject.grade}%</div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Assignments</span>
                          <span className="text-sm font-semibold">
                            {subject.assignments} completed
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${Math.min(100, (subject.assignments / 20) * 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Participation</span>
                          <span className="text-sm font-semibold">{subject.participation}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${subject.participation}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance Details */}
            <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Attendance Summary</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-center p-6 border-2 border-green-200 rounded-lg bg-green-50">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {Math.round(
                        (reportData.attendance.present / reportData.attendance.total) * 100,
                      )}
                      %
                    </div>
                    <div className="text-sm text-gray-600">Attendance Rate</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {reportData.attendance.present} of {reportData.attendance.total} days
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                    <span className="text-sm text-gray-600">Days Present</span>
                    <span className="font-semibold text-green-600">
                      {reportData.attendance.present}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                    <span className="text-sm text-gray-600">Excused Absences</span>
                    <span className="font-semibold text-blue-600">
                      {reportData.attendance.excused}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                    <span className="text-sm text-gray-600">Tardies</span>
                    <span className="font-semibold text-yellow-600">
                      {reportData.attendance.tardies}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Achievements */}
            <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Achievements</h3>
              <div className="space-y-3">
                {reportData.achievements.map((achievement, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Award className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-white">{achievement}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Behavior Notes */}
            <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Behavior & Social Skills</h3>
              <div className="space-y-3">
                {reportData.behaviorNotes.map((note, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-700">{note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Teacher Recommendations</h3>
              <div className="space-y-3">
                {reportData.recommendations.map((recommendation, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-700">{recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Next Steps</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-slate-900">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium">Schedule Parent Conference</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-slate-900">
                  <Mail className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">Email Teacher</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-slate-900">
                  <FileText className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium">View Detailed Assignments</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
