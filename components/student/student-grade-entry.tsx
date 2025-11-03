'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Save, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

interface Grade {
  id: string;
  courseName: string;
  courseCode?: string;
  school?: string;
  semester: string;
  academicYear: string;
  gradeLevel?: string;
  letterGrade: string;
  numericGrade?: number;
  credits: number;
  isNcaaCore: boolean;
  courseType: string;
  verified: boolean;
  notes?: string;
}

interface StudentGradeEntryProps {
  studentId: string;
}

export default function StudentGradeEntry({ studentId }: StudentGradeEntryProps) {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    courseName: '',
    courseCode: '',
    school: '',
    semester: 'Fall',
    academicYear: '2025-2026',
    gradeLevel: '',
    letterGrade: '',
    numericGrade: '',
    credits: '1.00',
    isNcaaCore: false,
    courseType: 'regular',
    notes: ''
  });

  const currentYear = new Date().getFullYear();
  const academicYears = [
    `${currentYear}-${currentYear + 1}`,
    `${currentYear - 1}-${currentYear}`,
    `${currentYear - 2}-${currentYear - 1}`,
    `${currentYear - 3}-${currentYear - 2}`
  ];

  useEffect(() => {
    const loadGrades = async () => {
      try {
        const response = await fetch(`/api/students/grades?studentId=${studentId}`);
        const data = await response.json();
        if (data.success) {
          setGrades(data.grades);
        }
      } catch (error) {
        // Error fetching grades
      } finally {
        setLoading(false);
      }
    };
    
    loadGrades();
  }, [studentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/students/grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          ...formData,
          numericGrade: formData.numericGrade ? parseFloat(formData.numericGrade) : null
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setGrades([data.grade, ...grades]);
        setShowForm(false);
        resetForm();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Failed to add grade');
    }
  };

  const handleDelete = async (gradeId: string) => {
    if (!confirm('Are you sure you want to delete this grade?')) return;

    try {
      const response = await fetch(`/api/students/grades?id=${gradeId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        setGrades(grades.filter(g => g.id !== gradeId));
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Failed to delete grade');
    }
  };

  const resetForm = () => {
    setFormData({
      courseName: '',
      courseCode: '',
      school: '',
      semester: 'Fall',
      academicYear: `${currentYear}-${currentYear + 1}`,
      gradeLevel: '',
      letterGrade: '',
      numericGrade: '',
      credits: '1.00',
      isNcaaCore: false,
      courseType: 'regular',
      notes: ''
    });
  };

  const calculateGPA = () => {
    const gradePoints: Record<string, number> = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'D-': 0.7,
      'F': 0.0
    };

    let totalPoints = 0;
    let totalCredits = 0;

    grades.forEach(grade => {
      const points = gradePoints[grade.letterGrade] || 0;
      const credits = grade.credits || 1;
      totalPoints += points * credits;
      totalCredits += credits;
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  if (loading) {
    return <div className="p-4">Loading grades...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Academic Record</CardTitle>
          <CardDescription>
            Input your grades from external courses, previous schools, or self-study
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="text-lg">
              <span className="font-semibold">Cumulative GPA:</span>{' '}
              <span className="text-2xl text-blue-600">{calculateGPA()}</span>
              <span className="text-sm text-gray-500 ml-2">({grades.length} courses)</span>
            </div>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Grade
            </Button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-gray-50 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="courseName">Course Name *</Label>
                  <Input
                    id="courseName"
                    value={formData.courseName}
                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                    required
                    placeholder="e.g., Algebra II"
                  />
                </div>
                <div>
                  <Label htmlFor="courseCode">Course Code</Label>
                  <Input
                    id="courseCode"
                    value={formData.courseCode}
                    onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                    placeholder="e.g., MATH-201"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="school">School/Institution</Label>
                  <Input
                    id="school"
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                    placeholder="e.g., Central High School"
                  />
                </div>
                <div>
                  <Label htmlFor="gradeLevel">Grade Level</Label>
                  <Select value={formData.gradeLevel} onValueChange={(v) => setFormData({ ...formData, gradeLevel: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9th">9th Grade</SelectItem>
                      <SelectItem value="10th">10th Grade</SelectItem>
                      <SelectItem value="11th">11th Grade</SelectItem>
                      <SelectItem value="12th">12th Grade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="semester">Semester *</Label>
                  <Select value={formData.semester} onValueChange={(v) => setFormData({ ...formData, semester: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fall">Fall</SelectItem>
                      <SelectItem value="Spring">Spring</SelectItem>
                      <SelectItem value="Summer">Summer</SelectItem>
                      <SelectItem value="Full Year">Full Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="academicYear">Academic Year *</Label>
                  <Select value={formData.academicYear} onValueChange={(v) => setFormData({ ...formData, academicYear: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYears.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="credits">Credits</Label>
                  <Input
                    id="credits"
                    type="number"
                    step="0.5"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                    placeholder="1.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="letterGrade">Letter Grade *</Label>
                  <Select value={formData.letterGrade} onValueChange={(v) => setFormData({ ...formData, letterGrade: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="C+">C+</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="C-">C-</SelectItem>
                      <SelectItem value="D+">D+</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                      <SelectItem value="D-">D-</SelectItem>
                      <SelectItem value="F">F</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="numericGrade">Numeric Grade (optional)</Label>
                  <Input
                    id="numericGrade"
                    type="number"
                    step="0.01"
                    value={formData.numericGrade}
                    onChange={(e) => setFormData({ ...formData, numericGrade: e.target.value })}
                    placeholder="95.5"
                  />
                </div>
                <div>
                  <Label htmlFor="courseType">Course Type</Label>
                  <Select value={formData.courseType} onValueChange={(v) => setFormData({ ...formData, courseType: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="honors">Honors</SelectItem>
                      <SelectItem value="ap">AP</SelectItem>
                      <SelectItem value="ib">IB</SelectItem>
                      <SelectItem value="dual-enrollment">Dual Enrollment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isNcaaCore"
                  checked={formData.isNcaaCore}
                  onCheckedChange={(checked) => setFormData({ ...formData, isNcaaCore: !!checked })}
                />
                <Label htmlFor="isNcaaCore" className="text-sm font-normal">
                  NCAA Core Course
                </Label>
              </div>

              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional information about this course..."
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Save Grade
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {grades.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No grades recorded yet. Click &quot;Add Grade&quot; to get started.
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 font-semibold text-sm text-gray-600 pb-2 border-b">
                <div className="col-span-3">Course</div>
                <div className="col-span-2">Semester</div>
                <div className="col-span-1">Grade</div>
                <div className="col-span-1">Credits</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1">Actions</div>
              </div>
              {grades.map((grade) => (
                <div key={grade.id} className="grid grid-cols-12 gap-2 items-center py-2 border-b hover:bg-gray-50">
                  <div className="col-span-3">
                    <div className="font-medium">{grade.courseName}</div>
                    {grade.school && <div className="text-xs text-gray-500">{grade.school}</div>}
                  </div>
                  <div className="col-span-2 text-sm">
                    {grade.semester} {grade.academicYear}
                  </div>
                  <div className="col-span-1">
                    <span className="font-semibold text-lg">{grade.letterGrade}</span>
                  </div>
                  <div className="col-span-1 text-sm">{grade.credits}</div>
                  <div className="col-span-2 text-sm">
                    <span className="capitalize">{grade.courseType}</span>
                    {grade.isNcaaCore && <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1 rounded">NCAA</span>}
                  </div>
                  <div className="col-span-2">
                    {grade.verified ? (
                      <span className="flex items-center text-xs text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </span>
                    ) : (
                      <span className="flex items-center text-xs text-yellow-600">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Pending
                      </span>
                    )}
                  </div>
                  <div className="col-span-1">
                    {!grade.verified && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(grade.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
