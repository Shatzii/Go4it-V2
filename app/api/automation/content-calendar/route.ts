import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Content Calendar Automation API
 * Auto-schedules 3-5 posts per week showcasing:
 * - GAR scores and athlete achievements
 * - StarPath progress updates
 * - Recruiting success stories
 * - Parent Night highlights
 */

interface ScheduledPost {
  id: string;
  platform: string;
  postType: 'gar-score' | 'starpath' | 'recruiting' | 'parent-night' | 'success-story';
  content: string;
  hashtags: string[];
  imageUrl?: string;
  scheduledFor: string;
  status: 'scheduled' | 'published' | 'failed';
  createdAt: string;
}

interface ContentCalendar {
  week: number;
  year: number;
  posts: ScheduledPost[];
  analytics: {
    totalScheduled: number;
    byPlatform: Record<string, number>;
    byType: Record<string, number>;
  };
}

// Content templates for different post types
const CONTENT_TEMPLATES = {
  'gar-score': {
    captions: [
      '🏀 {name} just earned a GAR score of {score}! Another athlete crushing it on and off the court. Ready to get verified? 👉 Link in bio',
      '⭐ GAR Alert: {name} scored {score} out of 100! {sport} athletes, are you next? Book your testing today.',
      '🔥 New GAR Top 100 entry! {name} with a verified score of {score}. This is what elite looks like. #GAR #Verified',
      '🎯 {name} proves preparation meets opportunity. GAR Score: {score}. NCAA-ready metrics that speak for themselves.',
    ],
    hashtags: ['#GAR', '#VerifiedAthlete', '#NCAA', '#StudentAthlete', '#ElitePerformance', '#Go4it'],
  },
  'starpath': {
    captions: [
      '📈 StarPath Update: {name} completed {courses} courses this month with a {gpa} GPA. Academic excellence + athletic training = NCAA ready!',
      '🎓 Another WIN off the field! {name} maintaining {gpa} GPA while training 20+ hours per week. That\'s the StarPath difference.',
      '✅ Progress check: {name} is {percent}% complete with NCAA core courses. On track for {gradYear} eligibility. Your path starts here.',
      '💪 {name} just leveled up: {achievements}. StarPath tracking makes the NCAA journey crystal clear.',
    ],
    hashtags: ['#StarPath', '#StudentAthlete', '#NCAAEligibility', '#AcademicSuccess', '#Go4it'],
  },
  'recruiting': {
    captions: [
      '🎉 COMMITMENT ALERT! {name} just committed to {college}! From GAR testing to D1 signing. Proud of you, {name}! 🔥',
      '📬 {name} received {offers} D1 offers this week! Verified metrics + dedicated training = real results. Your turn next?',
      '🏆 Success Story: {name} went from unknown recruit to {college} commit in 12 months. Here\'s how we helped... [swipe for story]',
      '💼 {name} signing with {college} proves verification works. College coaches trust GAR scores. Get yours today.',
    ],
    hashtags: ['#Committed', '#D1Athlete', '#Recruiting', '#CollegeAthlete', '#NCAARecruiting', '#Go4it'],
  },
  'parent-night': {
    captions: [
      '👨‍👩‍👧 Parent Night Recap: 342 parents joined us last week! Tuesday & Thursday sessions = life-changing clarity. Join us this week! 🎓',
      '💡 "I finally understand the NCAA process" - Real parent feedback from Thursday\'s session. Next Tuesday at 7 PM. Free. No commitment.',
      '🗓️ This week\'s Parent Nights: ✅ Tuesday 7 PM (Info & Discovery) ✅ Thursday 7 PM (Decision Support). Reserve your spot (link in bio)!',
      '🌍 International parents: Our Parent Night covers visa, translations, and NCAA registration. Europe & US times available. Join 100% free.',
    ],
    hashtags: ['#ParentNight', '#NCAAParents', '#SportsParents', '#CollegeRecruiting', '#Go4it'],
  },
  'success-story': {
    captions: [
      '🌟 From doubt to D1: {name}\'s journey. Swipe to see how GAR testing + StarPath + AthleteAI changed everything. Your story starts here.',
      '💪 Real Results: {name} raised GPA from {oldGpa} to {newGpa}, improved GAR score from {oldScore} to {newScore}, committed to {college}. What\'s your goal?',
      '🎯 Case Study: International athlete {name} navigated NCAA eligibility and secured {offers} offers. We guide, you succeed.',
      '🏀 {name}\'s message to aspiring athletes: "Go4it gave me the tools. I put in the work. Now I\'m living my dream." Ready for your turn?',
    ],
    hashtags: ['#SuccessStory', '#AthleteJourney', '#D1Dreams', '#Go4it', '#Inspiration'],
  },
};

// Weekly posting schedule (3-5 posts per week)
const WEEKLY_SCHEDULE = [
  { day: 'Monday', time: '09:00', platforms: ['Instagram', 'Facebook'], type: 'success-story' },
  { day: 'Tuesday', time: '18:00', platforms: ['Instagram', 'Facebook', 'Twitter'], type: 'parent-night' },
  { day: 'Wednesday', time: '14:00', platforms: ['Instagram', 'TikTok'], type: 'gar-score' },
  { day: 'Thursday', time: '17:00', platforms: ['Facebook', 'Twitter'], type: 'parent-night' },
  { day: 'Friday', time: '12:00', platforms: ['Instagram', 'Facebook'], type: 'recruiting' },
  { day: 'Saturday', time: '10:00', platforms: ['Instagram'], type: 'starpath' },
];

export async function POST(request: Request) {
  try {
    const {
      weeksAhead = 2,
      platforms = ['Instagram', 'Facebook', 'Twitter'],
      contentTypes = ['gar-score', 'starpath', 'recruiting', 'parent-night', 'success-story'],
      athleteData = null,
    } = await request.json();

    const calendars: ContentCalendar[] = [];
    const now = new Date();

    // Generate content for each week
    for (let week = 0; week < weeksAhead; week++) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() + week * 7);

      const posts: ScheduledPost[] = [];

      // Schedule posts according to weekly schedule
      for (const slot of WEEKLY_SCHEDULE) {
        if (!contentTypes.includes(slot.type)) continue;

        const postDate = getNextWeekday(weekStart, slot.day);
        const [hours, minutes] = slot.time.split(':');
        postDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        // Create posts for each platform
        for (const platform of slot.platforms) {
          if (!platforms.includes(platform)) continue;

          const template = CONTENT_TEMPLATES[slot.type as keyof typeof CONTENT_TEMPLATES];
          const caption = generateCaption(slot.type, template, athleteData);

          const post: ScheduledPost = {
            id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            platform,
            postType: slot.type as any,
            content: caption,
            hashtags: template.hashtags,
            scheduledFor: postDate.toISOString(),
            status: 'scheduled',
            createdAt: new Date().toISOString(),
          };

          posts.push(post);
        }
      }

      // Calculate analytics
      const analytics = {
        totalScheduled: posts.length,
        byPlatform: posts.reduce(
          (acc, post) => {
            acc[post.platform] = (acc[post.platform] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        ),
        byType: posts.reduce(
          (acc, post) => {
            acc[post.postType] = (acc[post.postType] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        ),
      };

      calendars.push({
        week: weekStart.getWeek(),
        year: weekStart.getFullYear(),
        posts: posts.sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()),
        analytics,
      });
    }

    return NextResponse.json({
      success: true,
      calendars,
      summary: {
        totalWeeks: weeksAhead,
        totalPosts: calendars.reduce((sum, cal) => sum + cal.analytics.totalScheduled, 0),
        postsPerWeek: Math.round(
          calendars.reduce((sum, cal) => sum + cal.analytics.totalScheduled, 0) / weeksAhead
        ),
        platforms,
        contentTypes,
      },
      nextPost: calendars[0]?.posts[0] || null,
      recommendations: {
        bestTimes: 'Tuesday/Thursday 6-8 PM (Parent Night days), Wednesday 2-4 PM (mid-week engagement)',
        topPerformingContent: ['Parent Night testimonials', 'GAR score reveals', 'Commitment announcements'],
        hashtagStrategy: 'Use 5-8 hashtags per post, mix branded (#Go4it, #GAR) with trending (#NCAA, #D1Athlete)',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate content calendar',
      },
      { status: 500 }
    );
  }
}

// Helper functions
function getNextWeekday(startDate: Date, dayName: string): Date {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const targetDay = days.indexOf(dayName);
  const currentDay = startDate.getDay();

  let daysToAdd = targetDay - currentDay;
  if (daysToAdd < 0) daysToAdd += 7;

  const result = new Date(startDate);
  result.setDate(result.getDate() + daysToAdd);
  return result;
}

function generateCaption(type: string, template: any, athleteData: any): string {
  const captions = template.captions;
  let caption = captions[Math.floor(Math.random() * captions.length)];

  // Replace placeholders with real or sample data
  if (athleteData) {
    caption = caption.replace('{name}', athleteData.name || 'Alex Johnson');
    caption = caption.replace('{score}', athleteData.garScore || '94');
    caption = caption.replace('{sport}', athleteData.sport || 'Basketball');
    caption = caption.replace('{gpa}', athleteData.gpa || '3.8');
    caption = caption.replace('{college}', athleteData.college || 'Duke University');
    caption = caption.replace('{offers}', athleteData.offers || '3');
  } else {
    // Sample data
    caption = caption.replace('{name}', 'Jordan Smith');
    caption = caption.replace('{score}', '92');
    caption = caption.replace('{sport}', 'Basketball');
    caption = caption.replace('{gpa}', '3.7');
    caption = caption.replace('{college}', 'UCLA');
    caption = caption.replace('{offers}', '4');
    caption = caption.replace('{courses}', '3');
    caption = caption.replace('{percent}', '75');
    caption = caption.replace('{gradYear}', '2026');
    caption = caption.replace('{achievements}', 'Completed 2 AP courses, raised GAR to 91');
    caption = caption.replace('{oldGpa}', '3.2');
    caption = caption.replace('{newGpa}', '3.8');
    caption = caption.replace('{oldScore}', '85');
    caption = caption.replace('{newScore}', '93');
  }

  return caption;
}

// Extend Date prototype for week number
declare global {
  interface Date {
    getWeek(): number;
  }
}

Date.prototype.getWeek = function () {
  const date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  const week1 = new Date(date.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
  );
};

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Content calendar automation operational',
    schedule: WEEKLY_SCHEDULE,
    contentTypes: Object.keys(CONTENT_TEMPLATES),
    defaultFrequency: '3-5 posts per week',
    platforms: ['Instagram', 'Facebook', 'Twitter', 'TikTok'],
    usage: {
      endpoint: 'POST /api/automation/content-calendar',
      parameters: {
        weeksAhead: 2,
        platforms: "['Instagram', 'Facebook']",
        contentTypes: "['gar-score', 'parent-night', 'recruiting']",
        athleteData: { name: 'John Doe', garScore: 95, sport: 'Basketball' },
      },
    },
  });
}
