import OpenAI from 'openai';

/**
 * StarPath Content Generator
 * 
 * Creates weekly social media post ideas anchored to:
 * - Transcript Audit success stories
 * - GAR score improvements
 * - NCAA eligibility milestones
 * - StarPath program highlights
 */

interface ContentRequest {
  contentType: 'instagram' | 'facebook' | 'twitter' | 'tiktok' | 'linkedin';
  theme: 'audit-success' | 'gar-improvement' | 'ncaa-milestone' | 'program-highlight' | 'testimonial';
  athleteStory?: {
    sport: string;
    improvement: string; // e.g., "ARI increased from 65 to 85"
    result: string; // e.g., "Received 3 D1 offers"
  };
  postsPerWeek?: number;
}

interface ContentResult {
  platform: string;
  posts: Array<{
    caption: string;
    hashtags: string[];
    callToAction: string;
    imagePrompt?: string; // Description for visual content
    postTime?: string; // Suggested posting time
  }>;
}

export async function generateStarPathContent(
  request: ContentRequest
): Promise<ContentResult> {
  // Check if OpenAI API key is configured
  if (!process.env.OPENAI_API_KEY) {
    return generateFallbackContent(request);
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = buildContentPrompt(request);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are Go4it's social media content specialist. Create engaging, authentic posts that:

- Celebrate athlete success stories
- Educate parents about recruiting
- Build trust through transparency
- Drive traffic to StarPath services
- Use platform-appropriate tone and format
- Include relevant hashtags (5-10 per post)
- Always end with clear CTA

Platform Guidelines:
- Instagram: Visual-first, inspirational, 150-200 characters
- Facebook: Conversational, informative, 200-300 characters
- Twitter: Concise, timely, 200-280 characters
- TikTok: Trend-aware, energetic, hook-focused
- LinkedIn: Professional, data-driven, 200-400 characters`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 1200,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      return generateFallbackContent(request);
    }

    return parseContentResponse(response, request);

  } catch (error) {
    console.error('GPT content generation error:', error);
    return generateFallbackContent(request);
  }
}

function buildContentPrompt(request: ContentRequest): string {
  const { contentType, theme, athleteStory, postsPerWeek } = request;

  let prompt = `Generate ${postsPerWeek || 3} ${contentType} posts for this week.

**Theme:** ${theme}
**Platform:** ${contentType}`;

  if (athleteStory) {
    prompt += `

**Success Story:**
- Sport: ${athleteStory.sport}
- Improvement: ${athleteStory.improvement}
- Result: ${athleteStory.result}`;
  }

  prompt += `

For each post, provide:
1. **Caption:** Platform-appropriate length and tone
2. **Hashtags:** 5-10 relevant tags
3. **CTA:** Clear call-to-action
4. **Image Prompt:** Description for visual content
5. **Best Time:** Suggested posting time (e.g., "Tuesday 7PM")

Format as JSON array: [{ "caption": "...", "hashtags": [...], "callToAction": "...", "imagePrompt": "...", "postTime": "..." }]`;

  return prompt;
}

function parseContentResponse(response: string, request: ContentRequest): ContentResult {
  try {
    const parsed = JSON.parse(response);
    return {
      platform: request.contentType,
      posts: Array.isArray(parsed) ? parsed : [parsed],
    };
  } catch {
    // Fallback to manual parsing
    return generateFallbackContent(request);
  }
}

function generateFallbackContent(request: ContentRequest): ContentResult {
  const { contentType, theme, athleteStory } = request;

  const contentTemplates: Record<string, any> = {
    'audit-success': [
      {
        caption: `🎓 From good grades to VERIFIED academic readiness! ${athleteStory ? `${athleteStory.sport} athlete` : 'Our athlete'} went from uncertainty to confidence with a comprehensive Transcript Audit. ARI score? ${athleteStory ? athleteStory.improvement : '85/100'}! 📈\n\nNCAA eligibility = ✅ College coaches = 👀 Future = 🌟\n\nYour journey starts with one audit. Book yours today!`,
        hashtags: ['#TranscriptAudit', '#NCAAEligibility', '#StudentAthlete', '#CollegeRecruiting', '#Go4itAcademy', '#ARIScore', '#AcademicSuccess', '#AthleteDevelopment'],
        callToAction: 'Book your Transcript Audit → Link in bio',
        imagePrompt: 'Split screen: Left side shows stressed student with paperwork, right side shows confident athlete holding transcript with verified checkmark. Color scheme: blue and gold.',
        postTime: 'Tuesday 7:00 PM',
      },
      {
        caption: `📚 The secret weapon college coaches DON'T tell you about...\n\nIt's not just about your 40-yard dash or free throw percentage. It's your ARI (Academic Rigor Index).\n\n85% of D1 offers go to athletes with ARI scores above 75. Why? Coaches want athletes who can STAY ELIGIBLE.\n\nGet your ARI verified with Go4it's Transcript Audit. Know where you stand BEFORE you start contacting coaches.`,
        hashtags: ['#CollegeRecruiting', '#ARIScore', '#D1Athlete', '#NCAAEligibility', '#RecruitingTips', '#StudentAthleteLife', '#Go4itAcademy', '#TranscriptAudit'],
        callToAction: 'Start your audit today → Go4it.academy/transcript-audit',
        imagePrompt: 'Infographic showing ARI score meter from 0-100, with "75+" highlighted in green. Include stat: "85% of D1 offers go to athletes with 75+ ARI"',
        postTime: 'Thursday 6:30 PM',
      },
      {
        caption: `💡 Parent question of the week: "How do I know if my athlete is NCAA eligible?"\n\nThe answer: Transcript Audit.\n\nIn 2-3 business days, you'll know:\n✅ Your ARI score (Academic Rigor Index)\n✅ Core course completion status\n✅ NCAA risk level\n✅ Exact courses needed\n✅ Action plan for eligibility\n\nNo guessing. No surprises. Just facts.`,
        hashtags: ['#ParentTips', '#NCAAEligibility', '#TranscriptAudit', '#StudentAthlete', '#CollegeRecruiting', '#Go4itAcademy', '#AthleteDevelopment', '#ARIScore'],
        callToAction: 'Get answers in 72 hours → Book now',
        imagePrompt: 'Parent and student athlete looking at laptop together, smiling at screen showing "NCAA Eligible ✓" message. Warm, reassuring atmosphere.',
        postTime: 'Sunday 4:00 PM',
      },
    ],
    'gar-improvement': [
      {
        caption: `⭐ From 3-star to 4-star in 6 months!\n\n${athleteStory?.sport || 'Basketball'} athlete ${athleteStory ? athleteStory.improvement : 'improved GAR from 8.5 to 12.5'}. What changed?\n\n1️⃣ Verified baseline (GAR test)\n2️⃣ Targeted training plan\n3️⃣ Monthly progress tracking\n4️⃣ Re-verification\n\nResult: ${athleteStory?.result || '3 D1 scholarship offers'} 🎉\n\nYour number tells your story. Get verified.`,
        hashtags: ['#GARScore', '#AthleteVerification', '#CollegeRecruiting', '#D1Recruiting', '#Go4itAcademy', '#StarRating', '#AthletePerformance', '#RecruitingProcess'],
        callToAction: 'Book your GAR test → Link in bio',
        imagePrompt: 'Before/after comparison: Left shows "3⭐ GAR 8.5", right shows "4⭐⭐⭐⭐ GAR 12.5". Athlete in uniform celebrating. Bold, dynamic design.',
        postTime: 'Monday 8:00 PM',
      },
    ],
    'ncaa-milestone': [
      {
        caption: `🏆 MILESTONE ALERT!\n\nThis week, 23 of our athletes officially crossed into "NCAA Eligible" status! 🎓⚽🏀🏈\n\nThat's 23 families who now have:\n✅ Peace of mind\n✅ Verified transcripts\n✅ College coach-ready profiles\n✅ Clear path to D1/D2/D3\n\nYour athlete could be next. Start with a Transcript Audit and NCAA Tracker.`,
        hashtags: ['#NCAAEligible', '#StudentAthlete', '#Go4itAcademy', '#CollegeRecruiting', '#Milestone', '#AthleteDevelopment', '#TranscriptAudit', '#NCAASports'],
        callToAction: 'Join 23+ athletes this month → Book audit',
        imagePrompt: 'Celebration graphic with "23 ATHLETES NCAA ELIGIBLE!" in large text. Include checkmarks, confetti, and diverse sports equipment (basketball, soccer ball, football).',
        postTime: 'Friday 5:00 PM',
      },
    ],
    'program-highlight': [
      {
        caption: `🌟 What is StarPath?\n\nIt's your athlete's command center for college recruiting:\n\n📊 Academic readiness (ARI score)\n⚡ Athletic performance (GAR score)\n🧠 Behavioral assessment (Mind-Body-Soul)\n📈 Real-time NCAA tracker\n🎯 Personalized action plans\n\nAll in one dashboard. All verified. All designed to get your athlete recruited.\n\nThis is the future of athlete development.`,
        hashtags: ['#StarPath', '#Go4itAcademy', '#AthleteOS', '#CollegeRecruiting', '#StudentAthlete', '#AthleteDevelopment', '#RecruitingTech', '#ARIScore', '#GARScore'],
        callToAction: 'Explore StarPath → Go4it.academy/starpath',
        imagePrompt: 'Clean, modern dashboard UI mockup showing three circular meters: Academic (ARI), Athletic (GAR), and Behavioral scores. Futuristic but accessible design.',
        postTime: 'Wednesday 7:30 PM',
      },
    ],
    'testimonial': [
      {
        caption: `"We thought our son was on track for D1... until the Transcript Audit."\n\n"Turns out, he was missing 2 core courses and didn't even know it. Go4it caught it, fixed the plan, and now he's committed to a D1 program."\n\n- Maria R., Parent of D1 Football Commit\n\nKnowing is half the battle. Book your audit today.`,
        hashtags: ['#ParentTestimonial', '#TranscriptAudit', '#Go4itAcademy', '#D1Commit', '#NCAAEligibility', '#CollegeRecruiting', '#StudentAthlete', '#AthleteDevelopment'],
        callToAction: 'Read more success stories → Link in bio',
        imagePrompt: 'Quote graphic with parent testimonial text overlaid on image of proud parent hugging athlete in college uniform. Professional, emotional, authentic.',
        postTime: 'Saturday 12:00 PM',
      },
    ],
  };

  const posts = contentTemplates[theme] || contentTemplates['program-highlight'];

  return {
    platform: contentType,
    posts: posts.slice(0, request.postsPerWeek || 3),
  };
}

/**
 * Generate a week's worth of content calendar
 */
export async function generateWeeklyContentCalendar(): Promise<Record<string, ContentResult>> {
  const themes: Array<ContentRequest['theme']> = [
    'audit-success',
    'gar-improvement',
    'ncaa-milestone',
    'program-highlight',
    'testimonial',
  ];

  const platforms: Array<ContentRequest['contentType']> = [
    'instagram',
    'facebook',
    'twitter',
  ];

  const calendar: Record<string, ContentResult> = {};

  for (const platform of platforms) {
    const theme = themes[Math.floor(Math.random() * themes.length)];
    calendar[platform] = await generateStarPathContent({
      contentType: platform,
      theme,
      postsPerWeek: 3,
    });
  }

  return calendar;
}
