import OpenAI from 'openai';

/**
 * StarPath Followup Generator
 * 
 * Generates personalized outreach messages for:
 * - Post-audit communications
 * - GAR score updates
 * - NCAA status changes
 * - Milestone celebrations
 */

interface AthleteData {
  name: string;
  sport: string;
  gradYear: number;
  ari?: number;
  garScore?: number;
  ncaaStatus?: string;
  email?: string;
  phone?: string;
}

interface AuditData {
  ari: number;
  coreGpa: number;
  ncaaRiskLevel: string;
  coreCoursesCompleted: number;
  coreCoursesRequired: number;
}

interface FollowupOptions {
  athlete: AthleteData;
  audit?: AuditData;
  triggerType: 'audit-complete' | 'gar-update' | 'ncaa-change' | 'milestone';
  recipientType: 'parent' | 'athlete' | 'both';
}

interface FollowupResult {
  emailSubject: string;
  emailBody: string;
  smsBody: string;
  recipientType: string;
}

export async function generateStarPathFollowup(
  options: FollowupOptions
): Promise<FollowupResult> {
  // Check if OpenAI API key is configured
  if (!process.env.OPENAI_API_KEY) {
    return generateFallbackFollowup(options);
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = buildFollowupPrompt(options);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are the Go4it StarPath communication specialist. Create personalized, action-oriented messages for student-athletes and their families.

Guidelines:
- Be warm, encouraging, and professional
- Celebrate wins genuinely
- Address concerns with solutions
- Always include specific next steps
- End with clear call-to-action
- Keep email under 200 words
- Keep SMS under 160 characters
- Use emojis sparingly but effectively (1-2 max in SMS)`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 800,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      return generateFallbackFollowup(options);
    }

    // Parse GPT response
    return parseFollowupResponse(response, options);

  } catch (error) {
    console.error('GPT followup generation error:', error);
    return generateFallbackFollowup(options);
  }
}

function buildFollowupPrompt(options: FollowupOptions): string {
  const { athlete, audit, triggerType, recipientType } = options;

  let context = `Generate ${recipientType === 'both' ? 'parent and athlete' : recipientType} communication for:

**Athlete:** ${athlete.name}
**Sport:** ${athlete.sport}
**Grad Year:** ${athlete.gradYear}
**Trigger:** ${triggerType}`;

  if (triggerType === 'audit-complete' && audit) {
    context += `

**Audit Results:**
- ARI: ${audit.ari}/100
- Core GPA: ${audit.coreGpa}
- Risk Level: ${audit.ncaaRiskLevel}
- Progress: ${audit.coreCoursesCompleted}/${audit.coreCoursesRequired} courses`;
  } else if (triggerType === 'gar-update' && athlete.garScore) {
    context += `

**New GAR Score:** ${athlete.garScore}`;
  } else if (triggerType === 'ncaa-change' && athlete.ncaaStatus) {
    context += `

**New NCAA Status:** ${athlete.ncaaStatus}`;
  }

  context += `

Please provide:
1. **Email Subject Line:** Catchy, under 60 characters
2. **Email Body:** 150-200 words, HTML formatted with <p> and <strong> tags
3. **SMS Message:** Under 160 characters, include 1 emoji

Format as JSON: { "emailSubject": "...", "emailBody": "...", "smsBody": "..." }`;

  return context;
}

function parseFollowupResponse(response: string, options: FollowupOptions): FollowupResult {
  try {
    const parsed = JSON.parse(response);
    return {
      ...parsed,
      recipientType: options.recipientType,
    };
  } catch {
    // Fallback parsing
    const emailSubject = extractLine(response, 'Email Subject', 'Email Body');
    const emailBody = extractLine(response, 'Email Body', 'SMS Message');
    const smsBody = extractLine(response, 'SMS Message', '$END$');

    return {
      emailSubject: emailSubject || 'StarPath Update',
      emailBody: emailBody || '<p>Your StarPath update is ready to view.</p>',
      smsBody: smsBody || 'StarPath update available',
      recipientType: options.recipientType,
    };
  }
}

function extractLine(text: string, start: string, end: string): string {
  const startIdx = text.indexOf(start);
  const endIdx = end === '$END$' ? text.length : text.indexOf(end);
  
  if (startIdx === -1) return '';
  
  return text
    .substring(startIdx + start.length, endIdx)
    .replace(/^\*\*.*?\*\*:?\s*/m, '')
    .replace(/^["'`]|["'`]$/g, '')
    .trim();
}

function generateFallbackFollowup(options: FollowupOptions): FollowupResult {
  const { athlete, audit, triggerType } = options;

  const templates = {
    'audit-complete': {
      emailSubject: `🎓 ${athlete.name}'s Transcript Audit is Complete!`,
      emailBody: `
<p>Great news! We've completed ${athlete.name}'s comprehensive transcript audit.</p>

<p><strong>Key Results:</strong></p>
<ul>
  <li>Academic Rigor Index (ARI): <strong>${audit?.ari || 'N/A'}/100</strong></li>
  <li>Core GPA: <strong>${audit?.coreGpa || 'N/A'}</strong></li>
  <li>NCAA Risk Level: <strong>${audit?.ncaaRiskLevel || 'N/A'}</strong></li>
  <li>Progress: <strong>${audit?.coreCoursesCompleted || 0}/${audit?.coreCoursesRequired || 16} core courses</strong></li>
</ul>

<p><strong>Next Steps:</strong> Complete the remaining ${(audit?.coreCoursesRequired || 16) - (audit?.coreCoursesCompleted || 0)} core courses to stay on track for NCAA eligibility.</p>

<p><a href="/starpath">View Full Report → StarPath Dashboard</a></p>

<p>Questions? Reply to this email or call us at (555) 123-4567.</p>`,
      smsBody: `🎓 ${athlete.name}'s audit done! ARI: ${audit?.ari || 'N/A'}/100. View report: [link]`,
    },
    'gar-update': {
      emailSubject: `⭐ ${athlete.name} - New GAR Score Available`,
      emailBody: `
<p>Exciting news! ${athlete.name}'s athletic performance has been verified.</p>

<p><strong>New GAR Score: ${athlete.garScore || 'N/A'}</strong></p>

<p>This score places ${athlete.name} in the ${getPerformanceTier(athlete.garScore || 0)} performance tier for ${athlete.sport}.</p>

<p><strong>What this means:</strong> ${getGARMeaning(athlete.garScore || 0)}</p>

<p><a href="/starpath">See Complete Athletic Profile → StarPath Dashboard</a></p>

<p>Ready to schedule your next GAR verification? Book now to track improvement!</p>`,
      smsBody: `⭐ GAR score updated: ${athlete.garScore || 'N/A'}! Check your profile: [link]`,
    },
    'ncaa-change': {
      emailSubject: `🏆 NCAA Eligibility Update for ${athlete.name}`,
      emailBody: `
<p>${athlete.name}'s NCAA eligibility status has been updated.</p>

<p><strong>New Status: ${athlete.ncaaStatus || 'N/A'}</strong></p>

<p>${getNCAStatusMessage(athlete.ncaaStatus || 'unknown')}</p>

<p><strong>Current Progress:</strong> ${audit?.coreCoursesCompleted || 'N/A'}/${audit?.coreCoursesRequired || 16} core courses completed</p>

<p><a href="/starpath">Track Your Progress → StarPath Dashboard</a></p>

<p>Need help staying on track? Book a consultation with our academic advisors.</p>`,
      smsBody: `🏆 NCAA Status: ${athlete.ncaaStatus || 'N/A'}. Details: [link]`,
    },
    'milestone': {
      emailSubject: `🎉 ${athlete.name} Reached a StarPath Milestone!`,
      emailBody: `
<p>Congratulations! ${athlete.name} has reached an important StarPath milestone!</p>

<p><strong>Achievement Unlocked:</strong> 75% StarPath Progress Complete</p>

<p><strong>What you've accomplished:</strong></p>
<ul>
  <li>Completed transcript audit</li>
  <li>GAR score verified</li>
  <li>1,250+ StarPath points earned</li>
  <li>Multiple badges unlocked</li>
</ul>

<p><strong>What's next:</strong> You're on the home stretch! Complete your remaining courses and connect with college coaches to maximize recruiting opportunities.</p>

<p><a href="/starpath">Continue Your Journey → StarPath Dashboard</a></p>`,
      smsBody: `🎉 Milestone! 75% done. Keep going: [link]`,
    },
  };

  return {
    ...templates[triggerType],
    recipientType: options.recipientType,
  };
}

function getPerformanceTier(garScore: number): string {
  if (garScore >= 15) return 'elite (top 5%)';
  if (garScore >= 12) return 'high-level (top 25%)';
  if (garScore >= 8) return 'strong (top 50%)';
  return 'developing';
}

function getGARMeaning(garScore: number): string {
  if (garScore >= 15) return 'You\'re performing at an elite level with strong D1 potential.';
  if (garScore >= 12) return 'You\'re in the top quarter of athletes in your position and grad year.';
  if (garScore >= 8) return 'You\'re showing solid performance with room to grow.';
  return 'Continue training to improve your competitive standing.';
}

function getNCAStatusMessage(status: string): string {
  const messages: Record<string, string> = {
    'on-track': 'Excellent! You\'re on schedule to meet all NCAA eligibility requirements.',
    'at-risk': 'Action needed. You\'re behind pace and need to complete courses to stay eligible.',
    'needs-review': 'Important: Schedule an academic consultation to get back on track.',
    'eligible': 'Congratulations! You\'ve met all NCAA eligibility requirements.',
  };
  return messages[status] || 'Your eligibility status has been updated.';
}
