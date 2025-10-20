'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Users,
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  ArrowLeft,
  Filter,
  Download,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  Calendar,
  BookOpen,
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface Student {
  id: string;
  name: string;
  email: string;
  grade: string;
  gpa: number;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'pending';
  coursesEnrolled: number;
  ncaaCompliant: boolean;
  lastActivity: string;
}

export default function AdminStudents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock student data
  const students: Student[] = [
    {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex.johnson@email.com',
      grade: '11th',
      gpa: 3.8,
      enrollmentDate: '2024-08-15',
      status: 'active',
      coursesEnrolled: 6,
      ncaaCompliant: true,
      lastActivity: '2024-12-15',
    },
    {
      id: '2',
      name: 'Sarah Martinez',
      email: 'sarah.martinez@email.com',
      grade: '10th',
      gpa: 3.95,
      enrollmentDate: '2024-08-20',
      status: 'active',
      coursesEnrolled: 5,
      ncaaCompliant: true,
      lastActivity: '2024-12-16',
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      grade: '12th',
      gpa: 3.6,
      enrollmentDate: '2024-07-10',
      status: 'active',
      coursesEnrolled: 7,
      ncaaCompliant: true,
      lastActivity: '2024-12-14',
    },
    {
      id: '4',
      name: 'Emma Thompson',
      email: 'emma.thompson@email.com',
      grade: '9th',
      gpa: 4.0,
      enrollmentDate: '2024-09-01',
      status: 'active',
      coursesEnrolled: 4,
      ncaaCompliant: true,
      lastActivity: '2024-12-16',
    },
    {
      id: '5',
      name: 'Jordan Williams',
      email: 'jordan.williams@email.com',
      grade: '11th',
      gpa: 3.4,
      enrollmentDate: '2024-08-25',
      status: 'pending',
      coursesEnrolled: 0,
      ncaaCompliant: false,
      lastActivity: '2024-12-10',
    },
  ];

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || student.grade === filterGrade;
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;

    return matchesSearch && matchesGrade && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600/20 text-green-400">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-red-600/20 text-red-400">Inactive</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600/20 text-yellow-400">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Student Management</h1>
              <p className="text-slate-400">Manage all student records and enrollments</p>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Plus className="w-4 h-4" />
            Add Student
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600"
                />
              </div>

              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              >
                <option value="all">All Grades</option>
                <option value="9th">9th Grade</option>
                <option value="10th">10th Grade</option>
                <option value="11th">11th Grade</option>
                <option value="12th">12th Grade</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>

              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Students ({filteredStudents.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="p-4 bg-slate-700/30 rounded-lg border border-slate-600"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    {/* Student Info */}
                    <div className="lg:col-span-3">
                      <h3 className="text-white font-semibold">{student.name}</h3>
                      <p className="text-slate-400 text-sm">{student.email}</p>
                    </div>

                    {/* Grade & GPA */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-2 mb-1">
                        <GraduationCap className="w-4 h-4 text-blue-400" />
                        <span className="text-white font-medium">{student.grade}</span>
                      </div>
                      <p className="text-slate-300 text-sm">GPA: {student.gpa}</p>
                    </div>

                    {/* Status */}
                    <div className="lg:col-span-2">
                      {getStatusBadge(student.status)}
                      <div className="flex items-center gap-1 mt-1">
                        {student.ncaaCompliant ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-green-400" />
                            <span className="text-green-400 text-xs">NCAA Compliant</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 text-red-400" />
                            <span className="text-red-400 text-xs">Not Compliant</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Enrollment Info */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="w-4 h-4 text-purple-400" />
                        <span className="text-white text-sm">
                          {student.coursesEnrolled} courses
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs">
                        Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Last Activity */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-orange-400" />
                        <span className="text-white text-sm">Last Active</span>
                      </div>
                      <p className="text-slate-400 text-xs">
                        {new Date(student.lastActivity).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="lg:col-span-1">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="p-2">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="p-2">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="p-2 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No students found matching the current filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
