import OpenAI from 'openai';

/**
 * StarPath Summary Generator
 * 
 * Converts raw athlete data (ARI, GAR, NCAA status) into
 * parent-friendly reports with actionable insights
 */

interface AthleteData {
  name: string;
  sport: string;
  gradYear: number;
  ari: number;
  coreGpa: number;
  ncaaStatus: string;
  garScore: number;
  starRating: number;
  behaviorScore: number;
  starpathProgress: number;
}

interface AuditData {
  coreCoursesCompleted: number;
  coreCoursesRequired: number;
  ncaaRiskLevel: string;
  subjectGaps?: string; // JSON string
}

interface StarPathSummaryResult {
  title: string;
  executiveSummary: string;
  academicAnalysis: string;
  athleticAnalysis: string;
  behavioralAnalysis: string;
  nextSteps: string[];
  ctaMessage: string;
}

export async function generateStarPathSummary(
  athlete: AthleteData,
  audit?: AuditData
): Promise<StarPathSummaryResult> {
  // Check if OpenAI API key is configured
  if (!process.env.OPENAI_API_KEY) {
    return generateFallbackSummary(athlete, audit);
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = buildSummaryPrompt(athlete, audit);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are the Go4it StarPath AI assistant. Your job is to analyze student-athlete data and create clear, encouraging, actionable reports for parents. 

Key guidelines:
- Be positive and encouraging while honest about areas needing improvement
- Use simple language (avoid jargon)
- Provide specific, actionable next steps
- Always end with a call-to-action to book next services
- Focus on the holistic athlete: academics, athletics, and character`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    if (!response) {
      return generateFallbackSummary(athlete, audit);
    }

    // Parse GPT response into structured format
    return parseGPTResponse(response, athlete);

  } catch (error) {
    console.error('GPT summary generation error:', error);
    return generateFallbackSummary(athlete, audit);
  }
}

function buildSummaryPrompt(athlete: AthleteData, audit?: AuditData): string {
  let prompt = `Generate a comprehensive StarPath summary report for:

**Athlete:** ${athlete.name}
**Sport:** ${athlete.sport}
**Graduation Year:** ${athlete.gradYear}

**Academic Metrics:**
- Academic Rigor Index (ARI): ${athlete.ari}/100
- Core GPA: ${athlete.coreGpa}
- NCAA Status: ${athlete.ncaaStatus}`;

  if (audit) {
    prompt += `
- Core Courses: ${audit.coreCoursesCompleted}/${audit.coreCoursesRequired} completed
- NCAA Risk Level: ${audit.ncaaRiskLevel}`;
  }

  prompt += `

**Athletic Metrics:**
- GAR Score: ${athlete.garScore} (Games Above Replacement)
- Star Rating: ${athlete.starRating}/5
- Overall StarPath Progress: ${athlete.starpathProgress}%

**Behavioral Score:** ${athlete.behaviorScore}/100 (Mind-Body-Soul assessment)

Please provide:
1. **Executive Summary** (2-3 sentences): Overall assessment
2. **Academic Analysis** (3-4 sentences): Strengths, gaps, NCAA readiness
3. **Athletic Analysis** (3-4 sentences): Performance level, recruiting potential
4. **Behavioral Analysis** (2-3 sentences): Character, coachability, work ethic
5. **Next Steps** (3-5 bullet points): Specific, time-bound action items
6. **Call-to-Action** (1 sentence): Encourage booking Transcript Audit or GAR verification

Format as JSON with keys: executiveSummary, academicAnalysis, athleticAnalysis, behavioralAnalysis, nextSteps (array), ctaMessage`;

  return prompt;
}

function parseGPTResponse(response: string, athlete: AthleteData): StarPathSummaryResult {
  try {
    // Try to parse as JSON
    const parsed = JSON.parse(response);
    return {
      title: `${athlete.name} - StarPath Summary Report`,
      ...parsed,
    };
  } catch {
    // If not JSON, parse as text sections
    return {
      title: `${athlete.name} - StarPath Summary Report`,
      executiveSummary: extractSection(response, 'Executive Summary', 'Academic Analysis'),
      academicAnalysis: extractSection(response, 'Academic Analysis', 'Athletic Analysis'),
      athleticAnalysis: extractSection(response, 'Athletic Analysis', 'Behavioral Analysis'),
      behavioralAnalysis: extractSection(response, 'Behavioral Analysis', 'Next Steps'),
      nextSteps: extractNextSteps(response),
      ctaMessage: extractSection(response, 'Call-to-Action', '$END$'),
    };
  }
}

function extractSection(text: string, start: string, end: string): string {
  const startIdx = text.indexOf(start);
  const endIdx = end === '$END$' ? text.length : text.indexOf(end);
  
  if (startIdx === -1) return '';
  
  return text
    .substring(startIdx + start.length, endIdx)
    .replace(/^\*\*.*?\*\*:?\s*/m, '')
    .trim();
}

function extractNextSteps(text: string): string[] {
  const section = extractSection(text, 'Next Steps', 'Call-to-Action');
  const lines = section.split('\n').filter(line => line.trim().startsWith('-') || line.trim().match(/^\d+\./));
  return lines.map(line => line.replace(/^[-\d.]\s*/, '').trim()).filter(Boolean);
}

function generateFallbackSummary(athlete: AthleteData, audit?: AuditData): StarPathSummaryResult {
  const ariLevel = athlete.ari >= 80 ? 'excellent' : athlete.ari >= 65 ? 'good' : 'needs improvement';
  const garLevel = athlete.garScore >= 12 ? 'elite' : athlete.garScore >= 8 ? 'strong' : 'developing';

  return {
    title: `${athlete.name} - StarPath Summary Report`,
    executiveSummary: `${athlete.name} is a ${athlete.starRating}-star ${athlete.sport} athlete in the class of ${athlete.gradYear}. With an ARI of ${athlete.ari}/100 and GAR score of ${athlete.garScore}, ${athlete.name} shows ${ariLevel} academic performance and ${garLevel} athletic ability. Currently ${athlete.starpathProgress}% complete with StarPath progression.`,
    academicAnalysis: `Academic Rigor Index of ${athlete.ari}/100 indicates ${ariLevel} academic standing. With a ${athlete.coreGpa} core GPA${audit ? ` and ${audit.coreCoursesCompleted}/${audit.coreCoursesRequired} core courses completed` : ''}, ${athlete.name} is ${athlete.ncaaStatus.replace('-', ' ')} for NCAA eligibility. ${audit?.ncaaRiskLevel === 'low' ? 'No immediate concerns.' : 'Some attention needed to stay on track.'}`,
    athleticAnalysis: `GAR score of ${athlete.garScore} places ${athlete.name} as a ${athlete.starRating}-star recruit. This ${garLevel} performance level indicates ${athlete.starRating >= 4 ? 'strong D1 potential' : athlete.starRating === 3 ? 'D2/D3 recruitment opportunities' : 'developing talent with growth potential'}. Current athletic metrics suggest continued training focus will yield significant improvements.`,
    behavioralAnalysis: `Behavior score of ${athlete.behaviorScore}/100 reflects ${athlete.behaviorScore >= 85 ? 'exceptional' : athlete.behaviorScore >= 70 ? 'solid' : 'developing'} character and coachability. ${athlete.name} demonstrates ${athlete.behaviorScore >= 85 ? 'outstanding leadership qualities and work ethic' : athlete.behaviorScore >= 70 ? 'good attitude and receptiveness to coaching' : 'areas for growth in consistency and discipline'}.`,
    nextSteps: [
      audit ? `Complete remaining ${audit.coreCoursesRequired - audit.coreCoursesCompleted} core courses by graduation` : 'Schedule transcript audit to assess academic readiness',
      athlete.garScore < 10 ? 'Book GAR verification test to establish baseline performance' : 'Schedule GAR re-verification to track improvement',
      athlete.behaviorScore < 85 ? 'Enroll in Mind-Body-Soul daily routine program' : 'Continue daily Mind-Body-Soul practices',
      `Maintain core GPA above ${Math.max(3.0, athlete.coreGpa)}`,
      'Connect with college coaches in target division',
    ],
    ctaMessage: `Ready to take ${athlete.name}'s recruiting to the next level? Book your Transcript Audit ($199) → View complete analysis in your StarPath Dashboard.`,
  };
}
