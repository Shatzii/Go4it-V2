import { db } from '../db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import OpenAI from 'openai';

// Define interfaces for academic data
interface SubjectScore {
  name: string;
  score: number;
  grade: string;
  comments: string;
  strengths: string[];
  improvements: string[];
}

interface AcademicCategory {
  category: string;
  subjects: SubjectScore[];
  overallGPA: number;
}

interface AcademicTimeframe {
  label: string;
  gpa: number;
  subjects: Record<string, number>;
}

interface ADHDInsights {
  learningStyle: string;
  focusScore: number;
  focusStrategies: string[];
  organizationTips: string[];
  studyEnvironmentSuggestions: string[];
  recommendedTools: string[];
}

interface NcaaEligibilityStatus {
  eligible: boolean;
  coreCoursesCompleted: number;
  coreCoursesRequired: number;
  minimumGPAMet: boolean;
  notes: string;
}

interface AcademicProgressData {
  categories: AcademicCategory[];
  overallGPA: number;
  historicalData: AcademicTimeframe[];
  strengths: string[];
  improvementAreas: string[];
  adhd: ADHDInsights;
  ncaaEligibilityStatus: NcaaEligibilityStatus;
}

/**
 * Get academic progress data for a student
 */
export async function getAcademicProgress(studentId: number): Promise<AcademicProgressData | null> {
  try {
    // For now, return mock data until the database schema is updated
    // This would normally fetch from the database based on studentId
    
    // Get user information for context
    const [user] = await db.select().from(users).where(eq(users.id, studentId));
    
    if (!user) {
      console.error(`User not found with ID: ${studentId}`);
      return null;
    }
    
    // In a real implementation, we would fetch academic data from the database
    // For now, generate a realistic academic profile
    return generateAcademicProfile(user);
    
  } catch (error) {
    console.error("Error getting academic progress:", error);
    return null;
  }
}

/**
 * Generate a new academic report for a student using OpenAI
 */
export async function generateAcademicReport(studentId: number): Promise<AcademicProgressData | null> {
  try {
    // Get user information for context
    const [user] = await db.select().from(users).where(eq(users.id, studentId));
    
    if (!user) {
      console.error(`User not found with ID: ${studentId}`);
      return null;
    }
    
    // In a real implementation, we would:
    // 1. Pull current grades from an academic system
    // 2. Use OpenAI to analyze the grades and provide insights
    // 3. Save the analysis to the database
    
    // For now, generate an academic profile
    return generateAcademicProfile(user);
    
  } catch (error) {
    console.error("Error generating academic report:", error);
    return null;
  }
}

/**
 * Helper function to generate a realistic academic profile
 * In a real implementation, this would use real data and OpenAI for insights
 */
function generateAcademicProfile(user: any): AcademicProgressData {
  // Basic subject lists
  const coreSubjects = ["Mathematics", "English", "Science", "History"];
  const electiveSubjects = ["Physical Education", "Art", "Music", "Computer Science"];
  const apHonorsSubjects = ["AP History", "AP Biology", "Honors English"];
  
  // Helper to generate a random GPA (biased towards better grades for athletes)
  const randomGPA = (min = 2.0, max = 4.0) => {
    return Math.round((Math.random() * (max - min) + min) * 10) / 10;
  };
  
  // Get letter grade from GPA
  const getLetterGrade = (gpa: number): string => {
    if (gpa >= 4.0) return 'A+';
    if (gpa >= 3.7) return 'A';
    if (gpa >= 3.3) return 'A-';
    if (gpa >= 3.0) return 'B+';
    if (gpa >= 2.7) return 'B';
    if (gpa >= 2.3) return 'B-';
    if (gpa >= 2.0) return 'C+';
    if (gpa >= 1.7) return 'C';
    if (gpa >= 1.3) return 'C-';
    if (gpa >= 1.0) return 'D+';
    if (gpa >= 0.7) return 'D';
    return 'F';
  };
  
  // Generate a subject with random but realistic data
  const generateSubject = (name: string): SubjectScore => {
    const score = randomGPA();
    
    return {
      name,
      score,
      grade: getLetterGrade(score),
      comments: getSubjectComment(name, score),
      strengths: getSubjectStrengths(name, score),
      improvements: getSubjectImprovements(name, score)
    };
  };
  
  // Generate subject comments based on subject and score
  const getSubjectComment = (subject: string, score: number): string => {
    if (score >= 3.7) {
      return `Excellent performance in ${subject}. Shows deep understanding and consistent effort.`;
    } else if (score >= 3.0) {
      return `Good progress in ${subject}. Participates actively and completes assignments on time.`;
    } else if (score >= 2.0) {
      return `Satisfactory work in ${subject}, but could benefit from more consistent study habits.`;
    } else {
      return `Struggling with core concepts in ${subject}. Would benefit from additional support.`;
    }
  };
  
  // Generate subject strengths
  const getSubjectStrengths = (subject: string, score: number): string[] => {
    const allStrengths: Record<string, string[]> = {
      "Mathematics": ["Problem-solving skills", "Attention to detail", "Computational accuracy", "Understanding of concepts"],
      "English": ["Writing clarity", "Reading comprehension", "Discussion participation", "Critical analysis"],
      "Science": ["Experimental technique", "Data analysis", "Conceptual understanding", "Scientific reasoning"],
      "History": ["Historical context", "Document analysis", "Making connections", "Presenting arguments"],
      "Physical Education": ["Athletic ability", "Team leadership", "Consistent effort", "Skill development"],
      "Art": ["Creativity", "Technical skill", "Visual communication", "Project dedication"],
      "Music": ["Technical proficiency", "Musical interpretation", "Performance quality", "Practice discipline"],
      "Computer Science": ["Logical thinking", "Problem-solving", "Coding clarity", "Project completion"],
      "AP History": ["Advanced analysis", "Research skills", "Essay structure", "Historical reasoning"],
      "AP Biology": ["Advanced concepts", "Lab techniques", "Scientific writing", "Exam preparation"],
      "Honors English": ["Advanced writing", "Literary analysis", "Critical thinking", "Discussion leadership"]
    };
    
    // Default strengths for any subject not listed
    const defaultStrengths = ["Consistent attendance", "Assignment completion", "Class participation"];
    
    // Get subject-specific strengths or default if not found
    const subjectStrengths = allStrengths[subject] || defaultStrengths;
    
    // Return 2-3 strengths based on score
    const numStrengths = score >= 3.0 ? 3 : 2;
    return subjectStrengths.slice(0, numStrengths);
  };
  
  // Generate subject improvements
  const getSubjectImprovements = (subject: string, score: number): string[] => {
    const allImprovements: Record<string, string[]> = {
      "Mathematics": ["Show all work clearly", "Practice regular problem sets", "Review errors on tests", "Seek help early for challenging concepts"],
      "English": ["Improve grammar and mechanics", "Read more widely", "Develop stronger thesis statements", "Participate more in discussions"],
      "Science": ["Take more detailed notes", "Review terminology regularly", "Improve lab techniques", "Connect concepts to applications"],
      "History": ["Improve citation format", "Develop more nuanced arguments", "Make broader historical connections", "Review key dates and events"],
      "Physical Education": ["Develop specific skills", "Increase participation in team activities", "Work on endurance", "Focus on technique"],
      "Art": ["Refine technical skills", "Experiment with new media", "Complete projects on time", "Incorporate feedback"],
      "Music": ["Practice more consistently", "Work on technical challenges", "Listen to varied performances", "Prepare for performances earlier"],
      "Computer Science": ["Comment code more thoroughly", "Test programs more rigorously", "Improve algorithm efficiency", "Work on user interface design"],
      "AP History": ["Prepare earlier for AP exam", "Practice DBQ format", "Develop stronger thesis statements", "Review content more regularly"],
      "AP Biology": ["Memorize key terminology", "Practice free response questions", "Improve lab write-ups", "Make concept connections"],
      "Honors English": ["Deepen literary analysis", "Improve citation format", "Incorporate varied sources", "Edit work more carefully"]
    };
    
    // Default improvements for any subject not listed
    const defaultImprovements = ["Turn in assignments on time", "Participate more in class", "Take better notes", "Ask questions when confused"];
    
    // Get subject-specific improvements or default if not found
    const subjectImprovements = allImprovements[subject] || defaultImprovements;
    
    // Return 2-3 improvements based on score (lower scores get more improvement suggestions)
    const numImprovements = score < 3.0 ? 3 : 2;
    return subjectImprovements.slice(0, numImprovements);
  };
  
  // Generate categories with subjects
  const coreCategory = {
    category: "Core",
    subjects: coreSubjects.map(subject => generateSubject(subject)),
    overallGPA: 0 // Will calculate after generating subjects
  };
  
  const electivesCategory = {
    category: "Electives",
    subjects: electiveSubjects.slice(0, 2).map(subject => generateSubject(subject)),
    overallGPA: 0
  };
  
  const apHonorsCategory = {
    category: "AP/Honors",
    subjects: [generateSubject(apHonorsSubjects[0])],
    overallGPA: 0
  };
  
  // Calculate category GPAs
  coreCategory.overallGPA = parseFloat(
    (coreCategory.subjects.reduce((sum, subject) => sum + subject.score, 0) / coreCategory.subjects.length).toFixed(1)
  );
  
  electivesCategory.overallGPA = parseFloat(
    (electivesCategory.subjects.reduce((sum, subject) => sum + subject.score, 0) / electivesCategory.subjects.length).toFixed(1)
  );
  
  apHonorsCategory.overallGPA = parseFloat(
    (apHonorsCategory.subjects.reduce((sum, subject) => sum + subject.score, 0) / apHonorsCategory.subjects.length).toFixed(1)
  );
  
  // Calculate overall GPA
  const allSubjects = [
    ...coreCategory.subjects,
    ...electivesCategory.subjects,
    ...apHonorsCategory.subjects
  ];
  
  const overallGPA = parseFloat(
    (allSubjects.reduce((sum, subject) => sum + subject.score, 0) / allSubjects.length).toFixed(1)
  );
  
  // Generate historical data (3 quarters)
  const historicalData: AcademicTimeframe[] = [];
  
  // Quarter 1: Slightly lower GPA
  const q1GPA = Math.max(2.0, overallGPA - 0.4);
  const q1Data: AcademicTimeframe = {
    label: "Q1",
    gpa: parseFloat(q1GPA.toFixed(1)),
    subjects: {}
  };
  
  // Quarter 2: Getting better
  const q2GPA = Math.max(2.0, overallGPA - 0.2);
  const q2Data: AcademicTimeframe = {
    label: "Q2",
    gpa: parseFloat(q2GPA.toFixed(1)),
    subjects: {}
  };
  
  // Quarter 3: Current GPA
  const q3Data: AcademicTimeframe = {
    label: "Q3",
    gpa: overallGPA,
    subjects: {}
  };
  
  // Add subject data for each quarter
  allSubjects.forEach(subject => {
    // Q1: Subject might be worse
    q1Data.subjects[subject.name] = parseFloat((Math.max(1.0, subject.score - 0.3 - Math.random() * 0.5)).toFixed(1));
    
    // Q2: Subject improving
    q2Data.subjects[subject.name] = parseFloat((Math.max(1.5, subject.score - 0.2 - Math.random() * 0.3)).toFixed(1));
    
    // Q3: Current scores
    q3Data.subjects[subject.name] = subject.score;
  });
  
  historicalData.push(q1Data, q2Data, q3Data);
  
  // Generate NCAA eligibility status
  const ncaaEligibilityStatus: NcaaEligibilityStatus = {
    eligible: overallGPA >= 2.3,
    coreCoursesCompleted: 10,
    coreCoursesRequired: 16,
    minimumGPAMet: overallGPA >= 2.3,
    notes: overallGPA >= 2.3 
      ? "On track for eligibility. Maintain core GPA above 2.3 and complete remaining core courses."
      : "Core GPA needs improvement to meet NCAA eligibility requirements. Focus on core courses and maintain regular study habits."
  };
  
  // Generate ADHD-specific insights
  const adhdInsights: ADHDInsights = {
    learningStyle: "Visual-Kinesthetic learner with strengths in hands-on and interactive learning environments",
    focusScore: parseFloat((Math.min(4.0, Math.max(1.0, overallGPA))).toFixed(1)),
    focusStrategies: [
      "Use the Pomodoro Technique: 25 minutes of focused work followed by 5-minute breaks",
      "Incorporate movement breaks between study sessions",
      "Create visual mind maps for complex topics",
      "Use color-coding systems for notes and assignments",
      "Study in a quiet environment with minimal distractions"
    ],
    organizationTips: [
      "Maintain a digital calendar with assignment due dates and color-coded subjects",
      "Break large assignments into smaller, manageable tasks",
      "Use checklists for daily and weekly academic goals",
      "Set up a consistent study space with all necessary materials",
      "Implement a weekly backpack and folder organization system"
    ],
    studyEnvironmentSuggestions: [
      "Find a consistent study location with minimal visual distractions",
      "Use noise-cancelling headphones or background white noise",
      "Ensure proper lighting to reduce eye strain"
    ],
    recommendedTools: [
      "Digital calendar", 
      "Task timer", 
      "Mind mapping software", 
      "Text-to-speech tools", 
      "Speech-to-text tools", 
      "Note organization app"
    ]
  };
  
  // Generate overall strengths and improvement areas
  let strengths: string[] = [];
  let improvementAreas: string[] = [];
  
  // Add general strengths
  if (coreCategory.overallGPA >= 3.0) {
    strengths.push("Strong academic performance in core subjects");
  }
  if (electivesCategory.overallGPA >= 3.5) {
    strengths.push("Excellent performance in elective courses");
  }
  if (apHonorsCategory.overallGPA >= 3.0) {
    strengths.push("Handling advanced coursework effectively");
  }
  
  // Add trend-based strength if improving
  if (q3Data.gpa > q1Data.gpa + 0.3) {
    strengths.push("Demonstrated significant academic improvement over the quarter");
  }
  
  // Add subject-specific strengths
  const highestSubject = allSubjects.reduce((highest, current) => 
    current.score > highest.score ? current : highest
  );
  
  if (highestSubject.score >= 3.5) {
    strengths.push(`Exceptional performance in ${highestSubject.name} (${highestSubject.grade})`);
  }
  
  // Add general areas for improvement
  if (coreCategory.overallGPA < 3.0) {
    improvementAreas.push("Focus on improving core academic subjects");
  }
  if (overallGPA < 2.3) {
    improvementAreas.push("Work on meeting NCAA eligibility requirements (minimum 2.3 GPA)");
  }
  
  // Add subject-specific improvements
  const lowestSubject = allSubjects.reduce((lowest, current) => 
    current.score < lowest.score ? current : lowest
  );
  
  if (lowestSubject.score < 2.7) {
    improvementAreas.push(`Prioritize improvement in ${lowestSubject.name} (currently ${lowestSubject.grade})`);
  }
  
  // Add study habit improvements
  improvementAreas.push("Develop more consistent study habits across all subjects");
  improvementAreas.push("Improve time management for assignments and projects");
  
  // General strengths for all students
  strengths.push("Active participation in class discussions");
  strengths.push("Good attendance record and punctuality");
  
  return {
    categories: [coreCategory, electivesCategory, apHonorsCategory],
    overallGPA,
    historicalData,
    strengths,
    improvementAreas,
    adhd: adhdInsights,
    ncaaEligibilityStatus
  };
}