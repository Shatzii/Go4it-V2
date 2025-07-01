import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Plus,
  X,
  AlertTriangle,
  CheckCircle,
  Calculator,
  BookOpen,
  TrendingUp,
  Calendar,
  Target,
  Award,
  FileText,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
  isCore: boolean;
  subject: 'english' | 'math' | 'science' | 'social_studies' | 'additional' | 'elective';
  gpaPoints: number;
}

interface NCAARequirements {
  division: 'D1' | 'D2' | 'D3';
  minGPA: number;
  minCoreCourses: number;
  coreSubjects: {
    english: number;
    math: number;
    science: number;
    social_studies: number;
    additional: number;
  };
  testScoreRequirements: {
    sat: { min: number; sliding?: boolean };
    act: { min: number; sliding?: boolean };
  };
}

interface EligibilityResult {
  isEligible: boolean;
  gpa: number;
  coreGPA: number;
  coreCourseCount: number;
  subjectBreakdown: Record<string, number>;
  missingRequirements: string[];
  recommendations: string[];
  eligibilityStatus: 'eligible' | 'partial' | 'not_eligible' | 'needs_improvement';
}

export default function EligibilityCalculator() {
  const [selectedDivision, setSelectedDivision] = useState<'D1' | 'D2' | 'D3'>('D1');
  const [courses, setCourses] = useState<Course[]>([]);
  const [satScore, setSatScore] = useState<number | null>(null);
  const [actScore, setActScore] = useState<number | null>(null);
  const [graduationYear, setGraduationYear] = useState<number>(2026);
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null);
  const [showAddCourse, setShowAddCourse] = useState(false);

  const ncaaRequirements: Record<string, NCAARequirements> = {
    D1: {
      division: 'D1',
      minGPA: 2.3,
      minCoreCourses: 16,
      coreSubjects: {
        english: 4,
        math: 3,
        science: 2,
        social_studies: 2,
        additional: 5
      },
      testScoreRequirements: {
        sat: { min: 400, sliding: true },
        act: { min: 37, sliding: true }
      }
    },
    D2: {
      division: 'D2',
      minGPA: 2.2,
      minCoreCourses: 16,
      coreSubjects: {
        english: 3,
        math: 2,
        science: 2,
        social_studies: 2,
        additional: 7
      },
      testScoreRequirements: {
        sat: { min: 400 },
        act: { min: 37 }
      }
    },
    D3: {
      division: 'D3',
      minGPA: 0,
      minCoreCourses: 0,
      coreSubjects: {
        english: 0,
        math: 0,
        science: 0,
        social_studies: 0,
        additional: 0
      },
      testScoreRequirements: {
        sat: { min: 0 },
        act: { min: 0 }
      }
    }
  };

  const gradePoints: Record<string, number> = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0
  };

  const subjectOptions = [
    { value: 'english', label: 'English' },
    { value: 'math', label: 'Mathematics' },
    { value: 'science', label: 'Natural Science' },
    { value: 'social_studies', label: 'Social Studies' },
    { value: 'additional', label: 'Additional Core' },
    { value: 'elective', label: 'Elective' }
  ];

  const addCourse = (courseData: Omit<Course, 'id' | 'gpaPoints'>) => {
    const newCourse: Course = {
      ...courseData,
      id: Date.now().toString(),
      gpaPoints: gradePoints[courseData.grade] || 0
    };
    setCourses(prev => [...prev, newCourse]);
    setShowAddCourse(false);
  };

  const removeCourse = (courseId: string) => {
    setCourses(prev => prev.filter(course => course.id !== courseId));
  };

  const calculateEligibility = (): EligibilityResult => {
    const requirements = ncaaRequirements[selectedDivision];
    const coreCourses = courses.filter(course => course.isCore);
    
    // Calculate overall GPA
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const totalGradePoints = courses.reduce((sum, course) => sum + (course.gpaPoints * course.credits), 0);
    const gpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

    // Calculate core GPA
    const coreCredits = coreCourses.reduce((sum, course) => sum + course.credits, 0);
    const coreGradePoints = coreCourses.reduce((sum, course) => sum + (course.gpaPoints * course.credits), 0);
    const coreGPA = coreCredits > 0 ? coreGradePoints / coreCredits : 0;

    // Count courses by subject
    const subjectBreakdown = coreCourses.reduce((acc, course) => {
      acc[course.subject] = (acc[course.subject] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const missingRequirements: string[] = [];
    const recommendations: string[] = [];

    // Check GPA requirement
    if (coreGPA < requirements.minGPA) {
      missingRequirements.push(`Core GPA must be at least ${requirements.minGPA} (currently ${coreGPA.toFixed(2)})`);
      recommendations.push('Focus on improving grades in core academic courses');
    }

    // Check core course requirements
    Object.entries(requirements.coreSubjects).forEach(([subject, required]) => {
      const completed = subjectBreakdown[subject] || 0;
      if (completed < required) {
        const subjectName = subjectOptions.find(s => s.value === subject)?.label || subject;
        missingRequirements.push(`Need ${required - completed} more ${subjectName} course(s)`);
      }
    });

    // Check total core courses
    if (coreCourses.length < requirements.minCoreCourses) {
      missingRequirements.push(`Need ${requirements.minCoreCourses - coreCourses.length} more core courses`);
    }

    // Check test scores (if provided)
    if (selectedDivision !== 'D3') {
      if (satScore && satScore < requirements.testScoreRequirements.sat.min) {
        missingRequirements.push(`SAT score too low (minimum ${requirements.testScoreRequirements.sat.min})`);
      }
      if (actScore && actScore < requirements.testScoreRequirements.act.min) {
        missingRequirements.push(`ACT score too low (minimum ${requirements.testScoreRequirements.act.min})`);
      }
    }

    let eligibilityStatus: EligibilityResult['eligibilityStatus'] = 'eligible';
    if (missingRequirements.length > 0) {
      eligibilityStatus = missingRequirements.length > 3 ? 'not_eligible' : 'needs_improvement';
    } else if (coreGPA < requirements.minGPA + 0.2) {
      eligibilityStatus = 'partial';
    }

    return {
      isEligible: missingRequirements.length === 0,
      gpa,
      coreGPA,
      coreCourseCount: coreCourses.length,
      subjectBreakdown,
      missingRequirements,
      recommendations,
      eligibilityStatus
    };
  };

  useEffect(() => {
    if (courses.length > 0) {
      setEligibilityResult(calculateEligibility());
    }
  }, [courses, selectedDivision, satScore, actScore]);

  const AddCourseForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      grade: 'A',
      credits: 1,
      subject: 'english' as Course['subject'],
      isCore: true
    });

    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">Add Course</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Course Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Algebra II"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Subject</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value as Course['subject'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {subjectOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Grade</label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {Object.keys(gradePoints).map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Credits</label>
              <Input
                type="number"
                value={formData.credits}
                onChange={(e) => setFormData(prev => ({ ...prev, credits: Number(e.target.value) }))}
                min="0.5"
                max="2"
                step="0.5"
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isCore}
                  onChange={(e) => setFormData(prev => ({ ...prev, isCore: e.target.checked }))}
                />
                <span className="text-sm font-medium">NCAA Core Course</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => addCourse(formData)}
              disabled={!formData.name.trim()}
            >
              Add Course
            </Button>
            <Button variant="outline" onClick={() => setShowAddCourse(false)}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="go4it-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6" />
            NCAA Eligibility Calculator
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-slate-700">
          <TabsTrigger value="calculator" className="flex items-center gap-2 data-[state=active]:bg-blue-600">
            <Calculator className="w-4 h-4" />
            Calculator
          </TabsTrigger>
          <TabsTrigger value="requirements" className="flex items-center gap-2 data-[state=active]:bg-blue-600">
            <BookOpen className="w-4 h-4" />
            Requirements
          </TabsTrigger>
          <TabsTrigger value="planning" className="flex items-center gap-2 data-[state=active]:bg-blue-600">
            <Target className="w-4 h-4" />
            Academic Planning
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="mt-6">
          <div className="bg-white rounded-lg p-6 space-y-6">
            {/* Division Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">NCAA Division</label>
              <div className="flex gap-2">
                {(['D1', 'D2', 'D3'] as const).map((division) => (
                  <Button
                    key={division}
                    variant={selectedDivision === division ? 'default' : 'outline'}
                    onClick={() => setSelectedDivision(division)}
                  >
                    Division {division}
                  </Button>
                ))}
              </div>
            </div>

            {/* Test Scores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">SAT Score (optional)</label>
                <Input
                  type="number"
                  value={satScore || ''}
                  onChange={(e) => setSatScore(e.target.value ? Number(e.target.value) : null)}
                  placeholder="400-1600"
                />
              </div>
              <div>
                <label className="text-sm font-medium">ACT Score (optional)</label>
                <Input
                  type="number"
                  value={actScore || ''}
                  onChange={(e) => setActScore(e.target.value ? Number(e.target.value) : null)}
                  placeholder="1-36"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Graduation Year</label>
                <Input
                  type="number"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(Number(e.target.value))}
                  min="2024"
                  max="2030"
                />
              </div>
            </div>

            {/* Add Course Button */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Academic Courses</h3>
              <Button onClick={() => setShowAddCourse(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Course
              </Button>
            </div>

            {/* Add Course Form */}
            {showAddCourse && <AddCourseForm />}

            {/* Course List */}
            <div className="space-y-2">
              {courses.map((course) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{course.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {subjectOptions.find(s => s.value === course.subject)?.label}
                      </Badge>
                      {course.isCore && (
                        <Badge className="bg-blue-100 text-blue-700 text-xs">Core</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      Grade: {course.grade} | Credits: {course.credits} | GPA Points: {course.gpaPoints.toFixed(1)}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCourse(course.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
              
              {courses.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-4" />
                  <p>No courses added yet</p>
                  <p className="text-sm">Add your high school courses to calculate NCAA eligibility</p>
                </div>
              )}
            </div>

            {/* Eligibility Results */}
            {eligibilityResult && (
              <Card className={cn(
                "border-2",
                eligibilityResult.eligibilityStatus === 'eligible' && "border-green-500 bg-green-50",
                eligibilityResult.eligibilityStatus === 'partial' && "border-yellow-500 bg-yellow-50",
                eligibilityResult.eligibilityStatus === 'needs_improvement' && "border-orange-500 bg-orange-50",
                eligibilityResult.eligibilityStatus === 'not_eligible' && "border-red-500 bg-red-50"
              )}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {eligibilityResult.isEligible ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                    )}
                    NCAA {selectedDivision} Eligibility Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <div className="text-2xl font-bold">{eligibilityResult.coreGPA.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">Core GPA</div>
                      <div className="text-xs text-gray-500">
                        (Min: {ncaaRequirements[selectedDivision].minGPA})
                      </div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <div className="text-2xl font-bold">{eligibilityResult.coreCourseCount}</div>
                      <div className="text-sm text-gray-600">Core Courses</div>
                      <div className="text-xs text-gray-500">
                        (Min: {ncaaRequirements[selectedDivision].minCoreCourses})
                      </div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <div className="text-2xl font-bold">{eligibilityResult.gpa.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">Overall GPA</div>
                    </div>
                  </div>

                  {/* Subject Breakdown */}
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Core Subject Requirements</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {Object.entries(ncaaRequirements[selectedDivision].coreSubjects).map(([subject, required]) => {
                        const completed = eligibilityResult.subjectBreakdown[subject] || 0;
                        const isComplete = completed >= required;
                        return (
                          <div key={subject} className="text-center p-2 border rounded">
                            <div className={cn(
                              "font-medium",
                              isComplete ? "text-green-600" : "text-red-600"
                            )}>
                              {completed}/{required}
                            </div>
                            <div className="text-xs capitalize">
                              {subjectOptions.find(s => s.value === subject)?.label}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Missing Requirements */}
                  {eligibilityResult.missingRequirements.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2 text-red-600">Missing Requirements</h4>
                      <ul className="space-y-1">
                        {eligibilityResult.missingRequirements.map((requirement, index) => (
                          <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                            {requirement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  {eligibilityResult.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 text-blue-600">Recommendations</h4>
                      <ul className="space-y-1">
                        {eligibilityResult.recommendations.map((recommendation, index) => (
                          <li key={index} className="text-sm text-blue-600 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            {recommendation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Button>
                      <Download className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                    <Button variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Save Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="requirements" className="mt-6">
          <div className="bg-white rounded-lg p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {(['D1', 'D2', 'D3'] as const).map((division) => {
                const req = ncaaRequirements[division];
                return (
                  <Card key={division} className={cn(
                    "border-2",
                    selectedDivision === division && "border-blue-500 bg-blue-50"
                  )}>
                    <CardHeader>
                      <CardTitle>Division {division}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="font-medium">Minimum Core GPA</div>
                          <div className="text-2xl font-bold text-blue-600">
                            {req.minGPA > 0 ? req.minGPA : 'No minimum'}
                          </div>
                        </div>
                        
                        <div>
                          <div className="font-medium mb-2">Core Courses Required</div>
                          <div className="text-lg font-bold">{req.minCoreCourses || 'No requirement'}</div>
                          {req.minCoreCourses > 0 && (
                            <div className="mt-2 space-y-1 text-sm">
                              <div>English: {req.coreSubjects.english}</div>
                              <div>Math: {req.coreSubjects.math}</div>
                              <div>Science: {req.coreSubjects.science}</div>
                              <div>Social Studies: {req.coreSubjects.social_studies}</div>
                              <div>Additional: {req.coreSubjects.additional}</div>
                            </div>
                          )}
                        </div>

                        {division !== 'D3' && (
                          <div>
                            <div className="font-medium">Test Scores</div>
                            <div className="text-sm">
                              <div>SAT: {req.testScoreRequirements.sat.min}+</div>
                              <div>ACT: {req.testScoreRequirements.act.min}+</div>
                              {req.testScoreRequirements.sat.sliding && (
                                <div className="text-xs text-gray-600 mt-1">
                                  *Sliding scale with GPA
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="planning" className="mt-6">
          <div className="bg-white rounded-lg p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Academic Planning Guide</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">9th & 10th Grade</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• Focus on core academic courses</li>
                        <li>• Maintain strong GPA (3.0+)</li>
                        <li>• Take challenging courses when ready</li>
                        <li>• Begin SAT/ACT preparation</li>
                        <li>• Track athletic and academic progress</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">11th & 12th Grade</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• Complete all core course requirements</li>
                        <li>• Take SAT/ACT (multiple times if needed)</li>
                        <li>• Register with NCAA Eligibility Center</li>
                        <li>• Request final transcript certification</li>
                        <li>• Apply to colleges and for athletic aid</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Course Selection Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Recommended Core Courses</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>English:</strong> 4 years including literature, composition</div>
                      <div><strong>Math:</strong> Algebra I, Geometry, Algebra II, plus one additional</div>
                      <div><strong>Science:</strong> Biology, Chemistry, Physics preferred</div>
                      <div><strong>Social Studies:</strong> History, Government, Geography</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Additional Courses</h4>
                    <div className="space-y-2 text-sm">
                      <div>• Foreign Language (2+ years recommended)</div>
                      <div>• Additional Math/Science courses</div>
                      <div>• AP or Honors courses when available</div>
                      <div>• Computer Science or Technology</div>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800">Important Reminders</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li>• Register with NCAA Eligibility Center during junior year</li>
                    <li>• Only courses approved by NCAA count toward core requirements</li>
                    <li>• Grade improvement in repeated courses only counts for D3</li>
                    <li>• Test scores and GPA work on a sliding scale for D1 and D2</li>
                    <li>• International students have additional requirements</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}