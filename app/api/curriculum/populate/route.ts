import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../server/db';
import { curriculum, courseContent } from '../../../../shared/schema';
import { CK12_CURRICULUM_MAP, OER_COMMONS_CURRICULUM_MAP, getAllAvailableCourses } from '../../../../lib/curriculum-integration';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    console.log('Starting curriculum population...');
    
    // Get all available courses from our curriculum maps
    const allCourses = getAllAvailableCourses();
    
    // Insert curriculum records
    for (const course of allCourses) {
      console.log(`Processing course: ${course.title}`);
      
      // Get course details from curriculum maps
      let courseDetails: any = null;
      let source = '';
      
      if (course.subject === 'mathematics' || course.subject === 'science') {
        const subjectMap = CK12_CURRICULUM_MAP[course.subject as keyof typeof CK12_CURRICULUM_MAP];
        courseDetails = Object.values(subjectMap as any).find((c: any) => c.courseId === course.courseId);
        source = 'CK-12 Foundation';
      } else if (course.subject === 'english' || course.subject === 'history') {
        const subjectMap = OER_COMMONS_CURRICULUM_MAP[course.subject as keyof typeof OER_COMMONS_CURRICULUM_MAP];
        courseDetails = Object.values(subjectMap as any).find((c: any) => c.courseId === course.courseId);
        source = 'OER Commons';
      }
      
      if (!courseDetails) continue;
      
      // Insert curriculum record
      const existingCourse = await db.select().from(curriculum).where(eq(curriculum.courseId, course.courseId)).limit(1);
      
      if (existingCourse.length === 0) {
        await db.insert(curriculum).values({
          courseId: course.courseId,
          title: course.title,
          description: `Comprehensive ${course.subject} curriculum for grade ${course.gradeLevel} sourced from ${source}`,
          subject: course.subject,
          gradeLevel: course.gradeLevel,
          creditHours: course.subject === 'mathematics' || course.subject === 'science' ? '1.0' : '1.0',
          prerequisites: [],
          learningObjectives: [
            `Master ${course.subject} concepts appropriate for grade ${course.gradeLevel}`,
            'Develop critical thinking and problem-solving skills',
            'Prepare for advanced coursework and standardized assessments',
            'Build foundation for college-level study'
          ],
          assessmentMethods: ['formative_assessment', 'summative_assessment', 'project_based', 'peer_assessment'],
          standardsAlignment: {
            source: source,
            standards: course.subject === 'mathematics' ? 'Common Core Mathematics' : 
                     course.subject === 'science' ? 'Next Generation Science Standards' :
                     course.subject === 'english' ? 'Common Core English Language Arts' : 'National Council for Social Studies Standards',
            gradeLevel: course.gradeLevel
          },
          isNcaaApproved: true,
          difficulty: course.gradeLevel >= '11' ? 'honors' : 'standard',
          estimatedHours: courseDetails.units?.reduce((total: number, unit: any) => total + (unit.lessons * 2), 0) || 120
        });
        
        console.log(`Inserted curriculum: ${course.courseId}`);
      }
      
      // Insert course content for each unit and lesson
      if (courseDetails.units) {
        for (const unit of courseDetails.units) {
          for (let lessonNum = 1; lessonNum <= unit.lessons; lessonNum++) {
            const contentTitle = `${unit.title} - Lesson ${lessonNum}`;
            
            // Check if content already exists
            const existingContent = await db.select().from(courseContent)
              .where(and(
                eq(courseContent.courseId, course.courseId), 
                eq(courseContent.unit, unit.id), 
                eq(courseContent.lesson, lessonNum)
              ))
              .limit(1);
            
            if (existingContent.length === 0) {
              await db.insert(courseContent).values({
                courseId: course.courseId,
                unit: unit.id,
                lesson: lessonNum,
                title: contentTitle,
                contentType: lessonNum % 5 === 0 ? 'quiz' : lessonNum % 3 === 0 ? 'video' : 'text',
                content: generateLessonContent(course.subject, unit.title, lessonNum, source),
                resources: {
                  source: source,
                  externalLinks: [
                    source === 'CK-12 Foundation' ? 
                      `https://www.ck12.org/book/ck-12-${course.subject.replace('_', '-')}-${course.gradeLevel}/` :
                      `https://oercommons.org/courses/${course.subject}-grade-${course.gradeLevel}/`,
                  ],
                  additionalMaterials: [
                    'Interactive simulations',
                    'Practice worksheets',
                    'Supplementary videos',
                    'Real-world applications'
                  ]
                },
                estimatedTime: lessonNum % 5 === 0 ? 75 : 50, // Quizzes take longer
                isRequired: true,
                prerequisites: lessonNum === 1 ? [] : [`${course.courseId}-${unit.id}-${lessonNum - 1}`],
                learningObjectives: generateLearningObjectives(course.subject, unit.title, lessonNum),
                assessmentCriteria: {
                  masteryThreshold: 0.8,
                  assessmentType: lessonNum % 5 === 0 ? 'quiz' : 'completion',
                  maxAttempts: 3,
                  rubric: {
                    understanding: 'Demonstrates clear understanding of concepts',
                    application: 'Can apply knowledge to solve problems',
                    analysis: 'Shows analytical thinking and reasoning'
                  }
                },
                order: lessonNum
              });
            }
          }
        }
        console.log(`Inserted content for course: ${course.courseId}`);
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Curriculum populated successfully',
      coursesProcessed: allCourses.length
    });
    
  } catch (error) {
    console.error('Error populating curriculum:', error);
    return NextResponse.json(
      { error: 'Failed to populate curriculum' },
      { status: 500 }
    );
  }
}

function generateLessonContent(subject: string, unitTitle: string, lessonNum: number, source: string): string {
  const baseContent = `
    <div class="lesson-content">
      <h2>${unitTitle} - Lesson ${lessonNum}</h2>
      
      <div class="learning-objectives">
        <h3>Learning Objectives</h3>
        <ul>
          <li>Understand key concepts in ${unitTitle.toLowerCase()}</li>
          <li>Apply knowledge through practical examples</li>
          <li>Develop problem-solving skills relevant to ${subject}</li>
        </ul>
      </div>
      
      <div class="content-body">
        <h3>Introduction</h3>
        <p>This lesson covers essential concepts in ${unitTitle.toLowerCase()} as part of our comprehensive ${subject} curriculum. 
        The content is sourced from ${source}, ensuring high-quality, standards-aligned educational materials.</p>
        
        <h3>Key Concepts</h3>
        <p>Students will explore fundamental principles and learn to apply them in various contexts. 
        This lesson builds upon previous knowledge while preparing students for more advanced topics.</p>
        
        <h3>Practice Activities</h3>
        <p>Interactive exercises and real-world applications help reinforce learning and build confidence in ${subject} skills.</p>
        
        <div class="external-link">
          <p><strong>For complete lesson content, visit:</strong> 
          <a href="${source === 'CK-12 Foundation' ? 
            'https://www.ck12.org/' : 
            'https://oercommons.org/'}" target="_blank">${source}</a></p>
        </div>
      </div>
    </div>
  `;
  
  return baseContent;
}

function generateLearningObjectives(subject: string, unitTitle: string, lessonNum: number): string[] {
  const baseObjectives = [
    `Understand core concepts in ${unitTitle.toLowerCase()}`,
    `Apply ${subject} knowledge to solve problems`,
    'Develop critical thinking and analytical skills',
    'Connect learning to real-world applications'
  ];
  
  // Add subject-specific objectives
  if (subject === 'mathematics') {
    baseObjectives.push('Demonstrate mathematical reasoning and proof');
    baseObjectives.push('Use appropriate mathematical tools and techniques');
  } else if (subject === 'science') {
    baseObjectives.push('Apply scientific method and inquiry');
    baseObjectives.push('Analyze data and draw evidence-based conclusions');
  } else if (subject === 'english') {
    baseObjectives.push('Demonstrate reading comprehension and analysis');
    baseObjectives.push('Develop effective writing and communication skills');
  } else if (subject === 'history') {
    baseObjectives.push('Analyze historical events and their significance');
    baseObjectives.push('Understand cause and effect relationships in history');
  }
  
  return baseObjectives;
}