import OpenAI from 'openai';

/**
 * StarPath Plan Generator
 * 
 * Turns audit + GAR data into actionable 30-day improvement plans
 * with specific drills, courses, and milestones
 */

interface AthleteProfile {
  name: string;
  sport: string;
  gradYear: number;
  position?: string;
  ari: number;
  garScore: number;
  behaviorScore: number;
  starpathProgress: number;
}

interface AuditData {
  coreGpa: number;
  coreCoursesCompleted: number;
  coreCoursesRequired: number;
  ncaaRiskLevel: string;
  subjectGaps?: Record<string, string[]>;
}

interface ImprovementPlan {
  summary: string;
  goals: {
    academic: string[];
    athletic: string[];
    behavioral: string[];
  };
  weekByWeek: Array<{
    week: number;
    focus: string;
    tasks: Array<{
      category: 'academic' | 'athletic' | 'behavioral';
      task: string;
      timeCommitment: string;
      priority: 'high' | 'medium' | 'low';
    }>;
    milestones: string[];
  }>;
  resources: Array<{
    title: string;
    type: 'course' | 'drill' | 'video' | 'article';
    url: string;
  }>;
  expectedOutcomes: {
    ariImprovement: string;
    garImprovement: string;
    behaviorImprovement: string;
    timeline: string;
  };
}

export async function generateStarPathPlan(
  athlete: AthleteProfile,
  audit: AuditData
): Promise<ImprovementPlan> {
  // Check if OpenAI API key is configured
  if (!process.env.OPENAI_API_KEY) {
    return generateFallbackPlan(athlete, audit);
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = buildPlanPrompt(athlete, audit);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are Go4it's performance planning specialist. Create personalized 30-day improvement plans that:

- Set realistic, measurable goals
- Break down complex objectives into weekly tasks
- Balance academic, athletic, and behavioral development
- Include specific time commitments (realistic for student-athletes)
- Prioritize high-impact activities
- Build progressive skill development
- Track weekly milestones

Plans should be:
- Actionable (specific tasks, not vague advice)
- Time-boxed (clear weekly structure)
- Balanced (don't overload any one area)
- Motivating (celebrate small wins)`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      return generateFallbackPlan(athlete, audit);
    }

    return parsePlanResponse(response, athlete);

  } catch (error) {
    console.error('GPT plan generation error:', error);
    return generateFallbackPlan(athlete, audit);
  }
}

function buildPlanPrompt(athlete: AthleteProfile, audit: AuditData): string {
  return `Create a personalized 30-day improvement plan for:

**Athlete:** ${athlete.name}
**Sport:** ${athlete.sport}${athlete.position ? ` (${athlete.position})` : ''}
**Graduation Year:** ${athlete.gradYear}

**Current Metrics:**
- ARI: ${athlete.ari}/100
- GAR Score: ${athlete.garScore}
- Behavior Score: ${athlete.behaviorScore}/100
- StarPath Progress: ${athlete.starpathProgress}%

**Academic Status:**
- Core GPA: ${audit.coreGpa}
- Courses Completed: ${audit.coreCoursesCompleted}/${audit.coreCoursesRequired}
- NCAA Risk Level: ${audit.ncaaRiskLevel}
${audit.subjectGaps ? `- Subject Gaps: ${JSON.stringify(audit.subjectGaps)}` : ''}

**Goal:** Improve all three pillars (Academic, Athletic, Behavioral) over 30 days.

Please provide a structured plan with:
1. **Summary:** 2-3 sentence overview
2. **Goals:** Specific targets for academic, athletic, and behavioral improvement
3. **Week-by-Week Breakdown:** 4 weeks with:
   - Focus area for the week
   - 3-5 specific tasks (with category, time commitment, priority)
   - Weekly milestones
4. **Resources:** Recommended courses, drills, videos, articles
5. **Expected Outcomes:** Projected improvements and timeline

Format as JSON matching the ImprovementPlan interface.`;
}

function parsePlanResponse(response: string, athlete: AthleteProfile): ImprovementPlan {
  try {
    return JSON.parse(response);
  } catch {
    return generateFallbackPlan(athlete, {} as AuditData);
  }
}

function generateFallbackPlan(athlete: AthleteProfile, audit: AuditData): ImprovementPlan {
  const coursesRemaining = (audit?.coreCoursesRequired || 16) - (audit?.coreCoursesCompleted || 12);
  const ariGap = Math.max(0, 80 - athlete.ari);
  const garGap = Math.max(0, 12 - athlete.garScore);

  return {
    summary: `This 30-day plan focuses on boosting ${athlete.name}'s ARI by ${ariGap > 0 ? `${Math.min(ariGap, 10)} points` : 'maintaining excellence'}, improving GAR through sport-specific training, and developing consistent daily routines for behavioral growth. By following this structured approach, ${athlete.name} will be positioned for stronger college recruiting opportunities.`,
    goals: {
      academic: [
        `Increase ARI from ${athlete.ari} to ${Math.min(athlete.ari + 10, 100)}`,
        `Complete ${Math.min(coursesRemaining, 2)} core course(s)`,
        `Maintain or improve ${audit?.coreGpa || 3.5}+ GPA`,
      ],
      athletic: [
        `Improve GAR score from ${athlete.garScore} to ${athlete.garScore + 2}`,
        `Complete 3 position-specific skill assessments`,
        `Record and analyze 5+ training sessions`,
      ],
      behavioral: [
        `Establish daily Mind-Body-Soul routine`,
        `Complete 90% of scheduled tasks`,
        `Increase behavior score from ${athlete.behaviorScore} to ${Math.min(athlete.behaviorScore + 15, 100)}`,
      ],
    },
    weekByWeek: [
      {
        week: 1,
        focus: 'Foundation & Assessment',
        tasks: [
          {
            category: 'academic',
            task: 'Complete current course assignments (focus on weak subjects)',
            timeCommitment: '1 hour/day',
            priority: 'high',
          },
          {
            category: 'academic',
            task: 'Meet with academic advisor to plan next core courses',
            timeCommitment: '30 minutes',
            priority: 'high',
          },
          {
            category: 'athletic',
            task: `${athlete.sport}-specific fundamentals drills (ball handling, footwork, etc.)`,
            timeCommitment: '45 minutes/day',
            priority: 'high',
          },
          {
            category: 'athletic',
            task: 'Record baseline training session for GAR improvement tracking',
            timeCommitment: '1 hour',
            priority: 'medium',
          },
          {
            category: 'behavioral',
            task: 'Establish morning routine (meditation, visualization, goal review)',
            timeCommitment: '15 minutes/day',
            priority: 'medium',
          },
        ],
        milestones: [
          'Baseline measurements recorded',
          'Academic plan confirmed',
          'Daily routine established',
        ],
      },
      {
        week: 2,
        focus: 'Skill Development',
        tasks: [
          {
            category: 'academic',
            task: 'Enroll in next core course (if not already enrolled)',
            timeCommitment: '2 hours (one-time)',
            priority: 'high',
          },
          {
            category: 'academic',
            task: 'Study sessions for current courses (focus on upcoming tests)',
            timeCommitment: '1.5 hours/day',
            priority: 'high',
          },
          {
            category: 'athletic',
            task: 'Advanced position drills with video recording',
            timeCommitment: '1 hour/day',
            priority: 'high',
          },
          {
            category: 'athletic',
            task: 'Watch film of top college athletes in your position',
            timeCommitment: '30 minutes, 3x/week',
            priority: 'medium',
          },
          {
            category: 'behavioral',
            task: 'Evening reflection journal (wins, areas for improvement)',
            timeCommitment: '10 minutes/day',
            priority: 'low',
          },
        ],
        milestones: [
          'Enrolled in new course',
          '7/7 training sessions completed',
          '7/7 morning routines completed',
        ],
      },
      {
        week: 3,
        focus: 'Consistency & Progress',
        tasks: [
          {
            category: 'academic',
            task: 'Complete all homework and assignments on time',
            timeCommitment: '1-2 hours/day',
            priority: 'high',
          },
          {
            category: 'academic',
            task: 'Request teacher feedback on academic progress',
            timeCommitment: '15 minutes',
            priority: 'medium',
          },
          {
            category: 'athletic',
            task: 'Scrimmage or game performance (focus on decision-making)',
            timeCommitment: '2 hours, 2x/week',
            priority: 'high',
          },
          {
            category: 'athletic',
            task: 'Strength & conditioning (build athletic foundation)',
            timeCommitment: '45 minutes, 3x/week',
            priority: 'medium',
          },
          {
            category: 'behavioral',
            task: 'Team leadership activity (organize team event or lead warmup)',
            timeCommitment: '1 hour (one-time)',
            priority: 'medium',
          },
          {
            category: 'behavioral',
            task: 'Continue daily routines (morning + evening)',
            timeCommitment: '25 minutes/day',
            priority: 'high',
          },
        ],
        milestones: [
          'All assignments submitted on time',
          'Visible improvement in training footage',
          'Leadership activity completed',
        ],
      },
      {
        week: 4,
        focus: 'Assessment & Next Steps',
        tasks: [
          {
            category: 'academic',
            task: 'Review progress with advisor (update ARI projection)',
            timeCommitment: '30 minutes',
            priority: 'high',
          },
          {
            category: 'academic',
            task: 'Plan summer/fall course schedule',
            timeCommitment: '1 hour',
            priority: 'medium',
          },
          {
            category: 'athletic',
            task: 'Record final training session (compare to Week 1 baseline)',
            timeCommitment: '1 hour',
            priority: 'high',
          },
          {
            category: 'athletic',
            task: 'Schedule GAR re-verification test',
            timeCommitment: '15 minutes',
            priority: 'high',
          },
          {
            category: 'behavioral',
            task: 'Reflect on 30-day progress (journal or video)',
            timeCommitment: '30 minutes',
            priority: 'medium',
          },
          {
            category: 'behavioral',
            task: 'Set goals for next 30-day cycle',
            timeCommitment: '30 minutes',
            priority: 'medium',
          },
        ],
        milestones: [
          'Visible GAR improvement documented',
          'Academic progress confirmed',
          'Next 30-day plan created',
        ],
      },
    ],
    resources: [
      {
        title: 'NCAA Core Course Planning Guide',
        type: 'article',
        url: '/academy/ncaa-core-courses',
      },
      {
        title: `${athlete.sport} Position-Specific Drills`,
        type: 'video',
        url: `/academy/courses/${athlete.sport.toLowerCase()}-fundamentals`,
      },
      {
        title: 'Mind-Body-Soul Daily Routine Template',
        type: 'article',
        url: '/starpath/behavioral-routines',
      },
      {
        title: 'GAR Training & Assessment Course',
        type: 'course',
        url: '/academy/gar-training',
      },
      {
        title: 'College Recruiting Timeline Checklist',
        type: 'article',
        url: '/recruiting/timeline',
      },
    ],
    expectedOutcomes: {
      ariImprovement: ariGap > 0 ? `+${Math.min(ariGap, 10)} points (${athlete.ari} → ${Math.min(athlete.ari + 10, 100)})` : 'Maintain current excellence',
      garImprovement: `+2-3 points (${athlete.garScore} → ${athlete.garScore + 2.5})`,
      behaviorImprovement: `+10-15 points (${athlete.behaviorScore} → ${Math.min(athlete.behaviorScore + 12, 100)})`,
      timeline: '30 days with re-assessment at end of cycle',
    },
  };
}
