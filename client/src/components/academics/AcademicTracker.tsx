import React, { useState } from 'react';
import { GraduationCap, Check, AlertTriangle, Info, ChevronRight, BarChart3 } from 'lucide-react';

// NCAA Core Course Requirements
const ncaaCoreRequirements = {
  division1: {
    english: 4,
    math: 3,
    science: 2,
    socialScience: 2,
    additionalCourses: 4,
    total: 16,
    minGPA: 2.3
  },
  division2: {
    english: 3,
    math: 2,
    science: 2,
    socialScience: 2,
    additionalCourses: 4,
    total: 16,
    minGPA: 2.2
  }
};

interface Course {
  id: string;
  name: string;
  category: 'english' | 'math' | 'science' | 'socialScience' | 'additional' | 'elective';
  grade: string;
  credits: number;
  completed: boolean;
  inProgress: boolean;
  ncaaApproved: boolean;
  term: string;
}

interface AcademicTrackerProps {
  studentId?: number;
  initialCourses?: Course[];
  division?: 'division1' | 'division2';
  showNcaaStatus?: boolean;
}

export function AcademicTracker({ 
  studentId,
  initialCourses,
  division = 'division1',
  showNcaaStatus = true
}: AcademicTrackerProps) {
  // Default sample courses if none are provided
  const defaultCourses: Course[] = [
    { 
      id: '1', 
      name: 'English Composition', 
      category: 'english', 
      grade: 'B+', 
      credits: 1, 
      completed: true, 
      inProgress: false, 
      ncaaApproved: true,
      term: 'Fall 2024'
    },
    { 
      id: '2', 
      name: 'World Literature', 
      category: 'english', 
      grade: 'A-', 
      credits: 1, 
      completed: true, 
      inProgress: false, 
      ncaaApproved: true,
      term: 'Spring 2025'
    },
    { 
      id: '3', 
      name: 'Algebra II', 
      category: 'math', 
      grade: 'B', 
      credits: 1, 
      completed: true, 
      inProgress: false, 
      ncaaApproved: true,
      term: 'Fall 2024'
    },
    { 
      id: '4', 
      name: 'Pre-Calculus', 
      category: 'math', 
      grade: 'C+', 
      credits: 1, 
      completed: false, 
      inProgress: true, 
      ncaaApproved: true,
      term: 'Spring 2025'
    },
    { 
      id: '5', 
      name: 'Biology', 
      category: 'science', 
      grade: 'A', 
      credits: 1, 
      completed: true, 
      inProgress: false, 
      ncaaApproved: true,
      term: 'Fall 2024'
    },
    { 
      id: '6', 
      name: 'U.S. History', 
      category: 'socialScience', 
      grade: 'B+', 
      credits: 1, 
      completed: true, 
      inProgress: false, 
      ncaaApproved: true,
      term: 'Fall 2024'
    },
    { 
      id: '7', 
      name: 'Spanish II', 
      category: 'additional', 
      grade: 'B', 
      credits: 1, 
      completed: true, 
      inProgress: false, 
      ncaaApproved: true,
      term: 'Spring 2025'
    },
    { 
      id: '8', 
      name: 'Computer Science', 
      category: 'elective', 
      grade: 'A', 
      credits: 1, 
      completed: false, 
      inProgress: true, 
      ncaaApproved: false,
      term: 'Spring 2025'
    }
  ];
  
  const [courses, setCourses] = useState<Course[]>(initialCourses || defaultCourses);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Calculate GPA
  const calculateGPA = (courseList: Course[]): number => {
    const completedCourses = courseList.filter(course => course.completed);
    if (completedCourses.length === 0) return 0;
    
    const gradePoints = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'D-': 0.7,
      'F': 0.0
    };
    
    let totalPoints = 0;
    let totalCredits = 0;
    
    completedCourses.forEach(course => {
      // @ts-ignore - Using type assertion for grade key
      totalPoints += gradePoints[course.grade] * course.credits;
      totalCredits += course.credits;
    });
    
    return totalCredits > 0 ? +(totalPoints / totalCredits).toFixed(2) : 0;
  };
  
  // Calculate NCAA eligibility
  const calculateNcaaEligibility = () => {
    const requirements = ncaaCoreRequirements[division];
    const approvedCourses = courses.filter(course => course.ncaaApproved && course.completed);
    
    // Count completed credits by category
    const completedCredits = {
      english: approvedCourses.filter(c => c.category === 'english').reduce((sum, c) => sum + c.credits, 0),
      math: approvedCourses.filter(c => c.category === 'math').reduce((sum, c) => sum + c.credits, 0),
      science: approvedCourses.filter(c => c.category === 'science').reduce((sum, c) => sum + c.credits, 0),
      socialScience: approvedCourses.filter(c => c.category === 'socialScience').reduce((sum, c) => sum + c.credits, 0),
      additional: approvedCourses.filter(c => c.category === 'additional').reduce((sum, c) => sum + c.credits, 0),
      total: approvedCourses.reduce((sum, c) => sum + c.credits, 0)
    };
    
    const currentGPA = calculateGPA(approvedCourses);
    
    return {
      completedCredits,
      currentGPA,
      meetsGpa: currentGPA >= requirements.minGPA,
      meetsCourseRequirements: 
        completedCredits.english >= requirements.english &&
        completedCredits.math >= requirements.math &&
        completedCredits.science >= requirements.science &&
        completedCredits.socialScience >= requirements.socialScience &&
        completedCredits.additional >= requirements.additionalCourses &&
        completedCredits.total >= requirements.total,
      onTrack: 
        currentGPA >= requirements.minGPA &&
        completedCredits.english >= (requirements.english / 2) &&
        completedCredits.math >= (requirements.math / 2) &&
        completedCredits.science >= (requirements.science / 2) &&
        completedCredits.socialScience >= (requirements.socialScience / 2)
    };
  };
  
  const eligibility = calculateNcaaEligibility();
  const currentGPA = calculateGPA(courses);
  
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Helper to get grade color
  const getGradeColor = (grade: string): string => {
    if (grade.startsWith('A')) return 'text-green-400';
    if (grade.startsWith('B')) return 'text-blue-400';
    if (grade.startsWith('C')) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
      <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-900">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">Academic Tracker</h3>
            <p className="text-blue-200 text-sm">NCAA Division {division === 'division1' ? 'I' : 'II'} Eligibility</p>
          </div>
          <div className="flex items-center">
            <GraduationCap className="text-blue-300 mr-2" size={20} />
            <div className="text-right">
              <p className="text-2xl font-bold">
                {currentGPA.toFixed(1)}
              </p>
              <p className="text-sm text-white/80">Current GPA</p>
            </div>
          </div>
        </div>
      </div>
      
      {showNcaaStatus && (
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            {eligibility.onTrack ? (
              <Check size={20} className="text-green-400 p-1 bg-green-400/20 rounded-full" />
            ) : (
              <AlertTriangle size={20} className="text-yellow-400 p-1 bg-yellow-400/20 rounded-full" />
            )}
            <div>
              <h4 className="font-medium">{eligibility.onTrack ? 'On Track for NCAA Eligibility' : 'Eligibility Needs Attention'}</h4>
              <p className="text-sm text-gray-400">
                {eligibility.meetsGpa ? 'GPA requirement met' : `GPA below ${ncaaCoreRequirements[division].minGPA} requirement`}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-800/50 p-3 rounded">
              <p className="text-gray-400 mb-1">Current Progress</p>
              <p className="text-2xl font-bold">{eligibility.completedCredits.total}/{ncaaCoreRequirements[division].total}</p>
              <p className="text-xs text-gray-500">Core courses completed</p>
            </div>
            <div className="bg-gray-800/50 p-3 rounded">
              <p className="text-gray-400 mb-1">GPA Status</p>
              <p className={`text-2xl font-bold ${currentGPA >= ncaaCoreRequirements[division].minGPA ? 'text-green-400' : 'text-yellow-400'}`}>
                {currentGPA.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">Minimum: {ncaaCoreRequirements[division].minGPA}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-4">
        {/* Course categories */}
        <div className="space-y-2">
          <div 
            className="flex justify-between items-center p-3 bg-gray-800 rounded cursor-pointer"
            onClick={() => toggleSection('english')}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">English</span>
              <span className="text-xs bg-blue-900 px-2 py-0.5 rounded-full">
                {eligibility.completedCredits.english}/{ncaaCoreRequirements[division].english}
              </span>
            </div>
            <ChevronRight 
              size={18} 
              className={`transition-transform ${expandedSection === 'english' ? 'rotate-90' : ''}`} 
            />
          </div>
          
          {expandedSection === 'english' && (
            <div className="pl-3 space-y-2 animate-fadeIn">
              {courses
                .filter(course => course.category === 'english')
                .map(course => (
                  <div key={course.id} className="flex justify-between items-center p-2 rounded bg-gray-800/50">
                    <div>
                      <p className="text-sm">{course.name}</p>
                      <p className="text-xs text-gray-400">{course.inProgress ? 'In Progress' : course.term}</p>
                    </div>
                    <div className={`text-sm font-medium ${course.inProgress ? 'text-blue-400' : getGradeColor(course.grade)}`}>
                      {course.inProgress ? 'Current' : course.grade}
                    </div>
                  </div>
                ))}
            </div>
          )}
          
          <div 
            className="flex justify-between items-center p-3 bg-gray-800 rounded cursor-pointer"
            onClick={() => toggleSection('math')}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Mathematics</span>
              <span className="text-xs bg-blue-900 px-2 py-0.5 rounded-full">
                {eligibility.completedCredits.math}/{ncaaCoreRequirements[division].math}
              </span>
            </div>
            <ChevronRight 
              size={18} 
              className={`transition-transform ${expandedSection === 'math' ? 'rotate-90' : ''}`} 
            />
          </div>
          
          {expandedSection === 'math' && (
            <div className="pl-3 space-y-2 animate-fadeIn">
              {courses
                .filter(course => course.category === 'math')
                .map(course => (
                  <div key={course.id} className="flex justify-between items-center p-2 rounded bg-gray-800/50">
                    <div>
                      <p className="text-sm">{course.name}</p>
                      <p className="text-xs text-gray-400">{course.inProgress ? 'In Progress' : course.term}</p>
                    </div>
                    <div className={`text-sm font-medium ${course.inProgress ? 'text-blue-400' : getGradeColor(course.grade)}`}>
                      {course.inProgress ? 'Current' : course.grade}
                    </div>
                  </div>
                ))}
            </div>
          )}
          
          {/* Other course categories would follow the same pattern */}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between">
          <div className="flex items-center gap-2 text-sm text-blue-400">
            <Info size={16} />
            <span>NCAA Eligibility Center Account</span>
          </div>
          <button className="text-xs bg-blue-600 hover:bg-blue-700 py-1 px-3 rounded">
            Connect
          </button>
        </div>
        
        <button className="w-full mt-4 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 py-2 rounded text-sm">
          <BarChart3 size={16} />
          <span>View Full Academic Report</span>
        </button>
      </div>
    </div>
  );
}