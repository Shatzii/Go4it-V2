import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, GraduationCap, LineChart, ClipboardCheck, AlertCircle, CheckCircle } from "lucide-react";

interface Course {
  id: number;
  name: string;
  grade: string;
  credits: number;
  completed: boolean;
  isCore: boolean;
  category: 'English' | 'Math' | 'Science' | 'Social' | 'Other';
  year: number;
}

interface AcademicData {
  id: number;
  gpa: number;
  coreGpa: number;
  satScore: number | null;
  actScore: number | null;
  coreCoursesCompleted: number;
  coreCoursesRequired: number;
  eligibilityStatus: 'On Track' | 'At Risk' | 'Not Eligible';
  courses: Course[];
}

// Sample academic data for demonstration
const sampleAcademicData: AcademicData = {
  id: 1,
  gpa: 3.2,
  coreGpa: 3.0,
  satScore: 1120,
  actScore: 24,
  coreCoursesCompleted: 10,
  coreCoursesRequired: 16,
  eligibilityStatus: 'On Track',
  courses: [
    { id: 1, name: "English 1", grade: "B+", credits: 1.0, completed: true, isCore: true, category: 'English', year: 9 },
    { id: 2, name: "Algebra I", grade: "B", credits: 1.0, completed: true, isCore: true, category: 'Math', year: 9 },
    { id: 3, name: "Biology", grade: "A-", credits: 1.0, completed: true, isCore: true, category: 'Science', year: 9 },
    { id: 4, name: "World History", grade: "B+", credits: 1.0, completed: true, isCore: true, category: 'Social', year: 9 },
    { id: 5, name: "Physical Education", grade: "A", credits: 0.5, completed: true, isCore: false, category: 'Other', year: 9 },
    { id: 6, name: "English 2", grade: "B", credits: 1.0, completed: true, isCore: true, category: 'English', year: 10 },
    { id: 7, name: "Geometry", grade: "B-", credits: 1.0, completed: true, isCore: true, category: 'Math', year: 10 },
    { id: 8, name: "Chemistry", grade: "B", credits: 1.0, completed: true, isCore: true, category: 'Science', year: 10 },
    { id: 9, name: "U.S. History", grade: "B+", credits: 1.0, completed: true, isCore: true, category: 'Social', year: 10 },
    { id: 10, name: "Spanish I", grade: "B", credits: 1.0, completed: true, isCore: true, category: 'Other', year: 10 },
    { id: 11, name: "English 3", grade: "B+", credits: 1.0, completed: false, isCore: true, category: 'English', year: 11 },
    { id: 12, name: "Algebra II", grade: "B-", credits: 1.0, completed: false, isCore: true, category: 'Math', year: 11 },
    { id: 13, name: "Physics", grade: "C+", credits: 1.0, completed: false, isCore: true, category: 'Science', year: 11 },
    { id: 14, name: "Government", grade: "B", credits: 0.5, completed: false, isCore: true, category: 'Social', year: 11 },
    { id: 15, name: "Economics", grade: "B", credits: 0.5, completed: false, isCore: true, category: 'Social', year: 11 },
    { id: 16, name: "Spanish II", grade: "B-", credits: 1.0, completed: false, isCore: true, category: 'Other', year: 11 }
  ]
};

// NCAA Division requirements
const ncaaRequirements = {
  divisionI: {
    minGpa: 2.3,
    minSat: 980,
    minAct: 75,
    coreCourses: 16,
    coreCoursesBeforeYear12: 10
  },
  divisionII: {
    minGpa: 2.2,
    minSat: 920,
    minAct: 70,
    coreCourses: 16,
    coreCoursesBeforeYear12: 0 // Not a requirement for Division II
  }
};

interface TrackerProps {
  userId?: number;
  division?: 'I' | 'II';
}

const AcademicTracker: React.FC<TrackerProps> = ({ userId, division = 'I' }) => {
  const { toast } = useToast();
  const [academicData, setAcademicData] = useState<AcademicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'timeline' | 'requirements'>('overview');
  
  // In a real app, fetch data from API
  useEffect(() => {
    const fetchAcademicData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In real app: const response = await fetch(`/api/academics/${userId}`);
        // const data = await response.json();
        
        setAcademicData(sampleAcademicData);
      } catch (error) {
        console.error("Error fetching academic data:", error);
        toast({
          title: "Error",
          description: "Could not load academic data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAcademicData();
  }, [userId, toast]);
  
  // Calculate NCAA eligibility status
  const calculateEligibilityStatus = (data: AcademicData, divisionType: 'I' | 'II') => {
    const requirements = divisionType === 'I' ? ncaaRequirements.divisionI : ncaaRequirements.divisionII;
    
    const isGpaMet = data.coreGpa >= requirements.minGpa;
    const isSatMet = !data.satScore || data.satScore >= requirements.minSat;
    const isActMet = !data.actScore || data.actScore >= requirements.minAct;
    const isCoursesOnTrack = data.coreCoursesCompleted >= (data.coreCoursesRequired / 2);
    
    if (isGpaMet && (isSatMet || isActMet) && isCoursesOnTrack) {
      return 'On Track';
    } else if (
      (data.coreGpa >= requirements.minGpa - 0.2) &&
      ((data.satScore && data.satScore >= requirements.minSat - 50) || 
       (data.actScore && data.actScore >= requirements.minAct - 5)) &&
      data.coreCoursesCompleted >= (data.coreCoursesRequired / 2) - 2
    ) {
      return 'At Risk';
    } else {
      return 'Not Eligible';
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-opacity-50 border-t-blue-500 rounded-full"></div>
      </div>
    );
  }
  
  if (!academicData) {
    return (
      <div className="bg-slate-900 p-6 rounded-xl">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Academic Data Not Available</h2>
          <p className="text-slate-400">
            We couldn't load your academic information. Please try again later or contact support.
          </p>
        </div>
      </div>
    );
  }
  
  const eligibilityStatus = calculateEligibilityStatus(academicData, division);
  const divisionReqs = division === 'I' ? ncaaRequirements.divisionI : ncaaRequirements.divisionII;
  
  // Group courses by year
  const coursesByYear = academicData.courses.reduce((acc, course) => {
    if (!acc[course.year]) {
      acc[course.year] = [];
    }
    acc[course.year].push(course);
    return acc;
  }, {} as Record<number, Course[]>);
  
  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden">
      <div className="border-b border-slate-800">
        <div className="flex overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-4 text-sm font-medium flex items-center whitespace-nowrap ${
              activeTab === 'overview'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <LineChart className="h-4 w-4 mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-5 py-4 text-sm font-medium flex items-center whitespace-nowrap ${
              activeTab === 'courses'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Courses
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-5 py-4 text-sm font-medium flex items-center whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <ClipboardCheck className="h-4 w-4 mr-2" />
            Timeline
          </button>
          <button
            onClick={() => setActiveTab('requirements')}
            className={`px-5 py-4 text-sm font-medium flex items-center whitespace-nowrap ${
              activeTab === 'requirements'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <GraduationCap className="h-4 w-4 mr-2" />
            NCAA Requirements
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {activeTab === 'overview' && (
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-white">NCAA Eligibility Status</h2>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  eligibilityStatus === 'On Track' 
                    ? 'bg-green-900/30 text-green-400' 
                    : eligibilityStatus === 'At Risk'
                    ? 'bg-yellow-900/30 text-yellow-400'
                    : 'bg-red-900/30 text-red-400'
                }`}>
                  {eligibilityStatus}
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                {eligibilityStatus === 'On Track' 
                  ? 'You are on track to meet NCAA Division ' + division + ' eligibility requirements.'
                  : eligibilityStatus === 'At Risk'
                  ? 'You are at risk of not meeting NCAA Division ' + division + ' eligibility requirements. Review the areas below that need attention.'
                  : 'You are currently not meeting NCAA Division ' + division + ' eligibility requirements. Please consult with your academic advisor.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-800 p-4 rounded-lg">
                <h3 className="text-slate-300 text-sm mb-2">Core GPA</h3>
                <p className="text-2xl font-bold">{academicData.coreGpa.toFixed(1)}</p>
                <div className="flex items-center mt-2">
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        academicData.coreGpa >= divisionReqs.minGpa 
                          ? 'bg-green-500' 
                          : academicData.coreGpa >= divisionReqs.minGpa - 0.2
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(academicData.coreGpa / 4 * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-xs text-slate-400">{divisionReqs.minGpa}+</span>
                </div>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg">
                <h3 className="text-slate-300 text-sm mb-2">Core Courses</h3>
                <p className="text-2xl font-bold">{academicData.coreCoursesCompleted}/{academicData.coreCoursesRequired}</p>
                <div className="flex items-center mt-2">
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(academicData.coreCoursesCompleted / academicData.coreCoursesRequired) * 100}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-xs text-slate-400">{academicData.coreCoursesRequired}</span>
                </div>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg">
                <h3 className="text-slate-300 text-sm mb-2">Test Scores</h3>
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs text-slate-400">SAT</p>
                    <p className="text-xl font-bold">{academicData.satScore || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">ACT</p>
                    <p className="text-xl font-bold">{academicData.actScore || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        (academicData.satScore && academicData.satScore >= divisionReqs.minSat) ||
                        (academicData.actScore && academicData.actScore >= divisionReqs.minAct)
                          ? 'bg-green-500' 
                          : (academicData.satScore && academicData.satScore >= divisionReqs.minSat - 50) ||
                            (academicData.actScore && academicData.actScore >= divisionReqs.minAct - 5)
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ 
                        width: academicData.satScore 
                          ? `${Math.min((academicData.satScore / 1600) * 100, 100)}%` 
                          : academicData.actScore
                          ? `${Math.min((academicData.actScore / 36) * 100, 100)}%`
                          : '0%'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800 p-4 rounded-lg">
              <h3 className="text-white font-medium mb-3">Key Requirements for Division {division}</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  {academicData.coreGpa >= divisionReqs.minGpa ? (
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-slate-200">Minimum Core GPA: {divisionReqs.minGpa}</p>
                    <p className="text-xs text-slate-400">Your core GPA is calculated using only NCAA-approved core courses</p>
                  </div>
                </li>
                <li className="flex items-start">
                  {academicData.coreCoursesCompleted >= divisionReqs.coreCourses ? (
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-slate-200">Complete 16 Core Courses</p>
                    <p className="text-xs text-slate-400">
                      {division === 'I' ? '10 of the 16 core courses must be completed before your 7th semester' : ''}
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  {(academicData.satScore && academicData.satScore >= divisionReqs.minSat) ||
                   (academicData.actScore && academicData.actScore >= divisionReqs.minAct) ? (
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  ) : !(academicData.satScore || academicData.actScore) ? (
                    <AlertCircle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-slate-200">
                      Minimum Test Scores: SAT {divisionReqs.minSat} or ACT {divisionReqs.minAct}
                    </p>
                    <p className="text-xs text-slate-400">
                      Scores must be sent directly to NCAA from testing agency (code: 9999)
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}
        
        {activeTab === 'courses' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Core Courses</h2>
              <div className="text-sm text-slate-400">
                {academicData.coreCoursesCompleted}/{academicData.coreCoursesRequired} completed
              </div>
            </div>
            
            <div className="bg-slate-800 rounded-lg overflow-hidden mb-4">
              <div className="p-3 bg-slate-700">
                <div className="grid grid-cols-12 gap-2 text-xs font-medium text-slate-300">
                  <div className="col-span-5">Course</div>
                  <div className="col-span-2 text-center">Grade</div>
                  <div className="col-span-2 text-center">Credits</div>
                  <div className="col-span-2 text-center">NCAA Core</div>
                  <div className="col-span-1 text-center">Status</div>
                </div>
              </div>
              
              {Object.keys(coursesByYear).sort((a, b) => Number(a) - Number(b)).map(year => (
                <div key={year} className="border-t border-slate-700">
                  <div className="px-3 py-2 bg-slate-800/50">
                    <h3 className="text-sm font-medium text-white">
                      Year {year} {getSchoolYearName(Number(year))}
                    </h3>
                  </div>
                  
                  {coursesByYear[Number(year)].map(course => (
                    <div 
                      key={course.id} 
                      className="grid grid-cols-12 gap-2 px-3 py-2 border-t border-slate-700/30 text-sm hover:bg-slate-800"
                    >
                      <div className="col-span-5 flex items-center">
                        <span className={`${course.isCore ? 'text-white' : 'text-slate-400'}`}>
                          {course.name}
                        </span>
                      </div>
                      
                      <div className="col-span-2 text-center flex items-center justify-center">
                        <span 
                          className={`px-2 py-0.5 rounded ${
                            course.grade.startsWith('A') 
                              ? 'bg-green-900/30 text-green-400' 
                              : course.grade.startsWith('B')
                              ? 'bg-blue-900/30 text-blue-400'
                              : course.grade.startsWith('C')
                              ? 'bg-yellow-900/30 text-yellow-400'
                              : 'bg-red-900/30 text-red-400'
                          }`}
                        >
                          {course.grade}
                        </span>
                      </div>
                      
                      <div className="col-span-2 text-center text-slate-300 flex items-center justify-center">
                        {course.credits.toFixed(1)}
                      </div>
                      
                      <div className="col-span-2 text-center flex items-center justify-center">
                        {course.isCore ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </div>
                      
                      <div className="col-span-1 text-center flex items-center justify-center">
                        <span 
                          className={`px-1.5 py-0.5 rounded-full text-xs ${
                            course.completed
                              ? 'bg-green-900/20 text-green-400'
                              : 'bg-blue-900/20 text-blue-400'
                          }`}
                        >
                          {course.completed ? 'Complete' : 'In Progress'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            <div className="bg-blue-900/20 rounded-lg p-4 text-sm text-slate-300">
              <h3 className="text-blue-400 flex items-center mb-2">
                <GraduationCap className="h-4 w-4 mr-2" />
                NCAA Core Course Requirements
              </h3>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                <li>4 years of English</li>
                <li>3 years of math (Algebra I or higher)</li>
                <li>2 years of natural or physical science</li>
                <li>1 year of additional English, math, or science</li>
                <li>2 years of social science</li>
                <li>4 years of additional core courses from any category above, or foreign language</li>
              </ul>
            </div>
          </div>
        )}
        
        {activeTab === 'timeline' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">NCAA Eligibility Timeline</h2>
            </div>
            
            <div className="relative">
              <div className="absolute top-0 bottom-0 left-5 w-0.5 bg-slate-700"></div>
              
              <div className="space-y-6">
                <TimelineItem
                  title="Grade 9: Start of High School"
                  status="completed"
                  items={[
                    { text: "Meet with guidance counselor to plan NCAA core courses", completed: true },
                    { text: "Begin taking NCAA-approved core courses", completed: true },
                    { text: "Create NCAA Eligibility Center account", completed: true }
                  ]}
                />
                
                <TimelineItem
                  title="Grade 10: Sophomore Year"
                  status="completed"
                  items={[
                    { text: "Continue NCAA core courses with good grades", completed: true },
                    { text: "Take PSAT/PreACT for practice", completed: true },
                    { text: "Update NCAA Eligibility Center profile", completed: true }
                  ]}
                />
                
                <TimelineItem
                  title="Grade 11: Junior Year"
                  status="current"
                  items={[
                    { text: "Register for SAT/ACT with NCAA code 9999", completed: false },
                    { text: "Ensure you'll have 10 core courses done before senior year", completed: true },
                    { text: "Request preliminary certification from NCAA", completed: false }
                  ]}
                />
                
                <TimelineItem
                  title="Grade 12: Senior Year"
                  status="upcoming"
                  items={[
                    { text: "Complete final NCAA core courses", completed: false },
                    { text: "Submit final transcripts to NCAA", completed: false },
                    { text: "Check NCAA academic certification status", completed: false }
                  ]}
                />
                
                <TimelineItem
                  title="After Graduation"
                  status="upcoming"
                  items={[
                    { text: "Ensure amateurism certification with NCAA", completed: false },
                    { text: "Confirm final academic certification", completed: false },
                    { text: "Prepare for college enrollment", completed: false }
                  ]}
                />
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'requirements' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">NCAA Division {division} Requirements</h2>
              <div>
                <button
                  onClick={() => division === 'I' ? { division: 'II' } : { division: 'I' }}
                  className="text-sm text-blue-400 flex items-center"
                >
                  View Division {division === 'I' ? 'II' : 'I'} <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-800 rounded-lg p-5">
                <h3 className="text-lg font-medium text-white mb-4">Academic Requirements</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-slate-400">Core GPA</span>
                      <span className="text-sm font-medium text-white">{divisionReqs.minGpa}+</span>
                    </div>
                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${(divisionReqs.minGpa / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-slate-400">SAT Score (EBRW + Math)</span>
                      <span className="text-sm font-medium text-white">{divisionReqs.minSat}+</span>
                    </div>
                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(divisionReqs.minSat / 1600) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-slate-400">ACT Sum Score</span>
                      <span className="text-sm font-medium text-white">{divisionReqs.minAct}+</span>
                    </div>
                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(divisionReqs.minAct / 36) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-white mb-2">Academic Sliding Scale</h4>
                  <p className="text-xs text-slate-400 mb-2">
                    Higher core GPA allows for lower test scores, and vice versa.
                    See the full sliding scale on the NCAA website.
                  </p>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-slate-400 text-left">
                        <th className="pb-2">Core GPA</th>
                        <th className="pb-2">SAT</th>
                        <th className="pb-2">ACT</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-300">
                      <tr>
                        <td className="py-1">3.55+</td>
                        <td className="py-1">400</td>
                        <td className="py-1">37</td>
                      </tr>
                      <tr>
                        <td className="py-1">3.25</td>
                        <td className="py-1">520</td>
                        <td className="py-1">46</td>
                      </tr>
                      <tr>
                        <td className="py-1">3.00</td>
                        <td className="py-1">620</td>
                        <td className="py-1">52</td>
                      </tr>
                      <tr>
                        <td className="py-1">2.75</td>
                        <td className="py-1">720</td>
                        <td className="py-1">59</td>
                      </tr>
                      <tr>
                        <td className="py-1">2.50</td>
                        <td className="py-1">820</td>
                        <td className="py-1">68</td>
                      </tr>
                      <tr>
                        <td className="py-1">2.30</td>
                        <td className="py-1">980</td>
                        <td className="py-1">75</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <div className="bg-slate-800 rounded-lg p-5 mb-4">
                  <h3 className="text-lg font-medium text-white mb-4">Core Courses Requirements</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">English</span>
                      <span className="text-sm font-medium text-white">4 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Math (Algebra I or higher)</span>
                      <span className="text-sm font-medium text-white">3 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Natural/Physical Science</span>
                      <span className="text-sm font-medium text-white">2 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Additional English/Math/Science</span>
                      <span className="text-sm font-medium text-white">1 year</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Social Science</span>
                      <span className="text-sm font-medium text-white">2 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Additional Courses*</span>
                      <span className="text-sm font-medium text-white">4 years</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      * Additional courses can be from any category above or foreign language
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-5">
                  <h3 className="text-lg font-medium text-white mb-4">Special Requirements</h3>
                  
                  {division === 'I' ? (
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-blue-900/40 p-1.5 rounded-full mt-0.5 mr-3">
                          <ClipboardCheck className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">10/7 Rule</h4>
                          <p className="text-xs text-slate-400 mt-1">
                            10 of your 16 core courses must be completed before your senior year (7th semester)
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-blue-900/40 p-1.5 rounded-full mt-0.5 mr-3">
                          <BookOpen className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">Grade Recovery Limitation</h4>
                          <p className="text-xs text-slate-400 mt-1">
                            You cannot replace grades in the 10 core courses after your junior year to improve your GPA
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-blue-900/40 p-1.5 rounded-full mt-0.5 mr-3">
                          <LineChart className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">GPA Flexibility</h4>
                          <p className="text-xs text-slate-400 mt-1">
                            No timing requirement for core course completion, allowing more flexibility for grade improvement
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-blue-900/40 p-1.5 rounded-full mt-0.5 mr-3">
                          <GraduationCap className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">Partial Qualifier Option</h4>
                          <p className="text-xs text-slate-400 mt-1">
                            Division II offers a "partial qualifier" status that allows practice and scholarships even if full requirements aren't met
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-blue-900/20 rounded-lg p-4 text-sm text-slate-300">
              <h3 className="text-blue-400 flex items-center mb-2">
                <AlertCircle className="h-4 w-4 mr-2" />
                Important Notes
              </h3>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                <li>NCAA calculates GPA using only core courses (your GPA may differ from school GPA)</li>
                <li>NCAA uses a different scale for core GPA: A=4.0, B=3.0, C=2.0, D=1.0</li>
                <li>The NCAA Eligibility Center must receive official test scores directly from the testing agency</li>
                <li>Courses taken in 9th grade count for core course requirements if they appear on high school transcript</li>
                <li>For the most current requirements, always check the NCAA Eligibility Center website</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper components
interface TimelineItemProps {
  title: string;
  status: 'completed' | 'current' | 'upcoming';
  items: { text: string; completed: boolean }[];
}

const TimelineItem: React.FC<TimelineItemProps> = ({ title, status, items }) => {
  return (
    <div className="ml-11 relative pb-2">
      <div className="absolute -left-11 flex items-center justify-center">
        <div 
          className={`h-10 w-10 rounded-full flex items-center justify-center ${
            status === 'completed' 
              ? 'bg-green-900/30' 
              : status === 'current'
              ? 'bg-blue-900/30'
              : 'bg-slate-800/80'
          }`}
        >
          {status === 'completed' ? (
            <CheckCircle className="h-5 w-5 text-green-400" />
          ) : status === 'current' ? (
            <div className="h-3 w-3 rounded-full bg-blue-400 animate-pulse"></div>
          ) : (
            <div className="h-3 w-3 rounded-full bg-slate-600"></div>
          )}
        </div>
      </div>
      
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-medium">{title}</h3>
          <span 
            className={`text-xs px-2 py-0.5 rounded-full ${
              status === 'completed' 
                ? 'bg-green-900/30 text-green-400' 
                : status === 'current'
                ? 'bg-blue-900/30 text-blue-400'
                : 'bg-slate-700 text-slate-400'
            }`}
          >
            {status === 'completed' ? 'Completed' : status === 'current' ? 'In Progress' : 'Upcoming'}
          </span>
        </div>
        
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-start">
              {item.completed ? (
                <CheckCircle className="h-4 w-4 text-green-400 mr-2 mt-0.5" />
              ) : (
                <div className="h-4 w-4 rounded-full border border-slate-600 mr-2 mt-0.5"></div>
              )}
              <span className={`text-sm ${item.completed ? 'text-slate-300' : 'text-slate-400'}`}>
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Helper functions
function getSchoolYearName(year: number): string {
  switch(year) {
    case 9: return '(Freshman)';
    case 10: return '(Sophomore)';
    case 11: return '(Junior)';
    case 12: return '(Senior)';
    default: return '';
  }
}

export default AcademicTracker;