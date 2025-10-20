import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { db } from '@/lib/db';
import { colleges, coachingStaff, sportsPrograms } from '@/shared/schema';
import { eq } from 'drizzle-orm';

// AI-powered recruiting contact discovery system
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const DEFAULT_MODEL_STR = 'claude-sonnet-4-20250514';

// AI Recruiting Helper - Discovers coaching contacts automatically
export async function POST(request: Request) {
  try {
    const { collegeIds, sports, forceRefresh = false } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'AI recruiting helper not configured - missing API key',
        },
        { status: 500 },
      );
    }

    const results = {
      processed: 0,
      discovered: 0,
      updated: 0,
      errors: 0,
      colleges: [] as any[],
    };

    // Get colleges to process
    const colleges_to_process = collegeIds
      ? await db.select().from(colleges).where(eq(colleges.id, collegeIds[0]))
      : await db.select().from(colleges).where(eq(colleges.isActive, true)).limit(10);

    for (const college of colleges_to_process) {
      try {
        results.processed++;
        console.log(`Processing ${college.name}...`);

        // Discover coaching contacts using AI
        const discoveredContacts = await discoverCollegeContacts(college, sports);

        // Process discovered contacts
        for (const contact of discoveredContacts) {
          try {
            // Check if coach already exists
            const existingCoach = await db
              .select()
              .from(coachingStaff)
              .where(eq(coachingStaff.email, contact.email))
              .limit(1);

            if (existingCoach.length === 0 || forceRefresh) {
              // Insert new coach or update existing
              const coachData = {
                collegeId: college.id,
                sport: contact.sport,
                gender: contact.gender || 'men',
                firstName: contact.firstName,
                lastName: contact.lastName,
                title: contact.title,
                email: contact.email,
                phone: contact.phone,
                recruitingEmail: contact.recruitingEmail,
                yearsAtSchool: contact.yearsAtSchool,
                totalYearsCoaching: contact.totalYearsCoaching,
                recruitingTerritory: contact.recruitingTerritory,
                recruitingFocus: contact.recruitingFocus,
                preferredContactMethod: 'email',
                contactVerified: contact.verified || false,
                dataSource: 'AI_Discovery',
              };

              if (existingCoach.length === 0) {
                await db.insert(coachingStaff).values(coachData);
                results.discovered++;
              } else {
                // Update existing coach
                await db
                  .update(coachingStaff)
                  .set({ ...coachData, updatedAt: new Date() })
                  .where(eq(coachingStaff.id, existingCoach[0].id));
                results.updated++;
              }
            }
          } catch (error) {
            console.error(
              `Error processing contact ${contact.firstName} ${contact.lastName}:`,
              error,
            );
            results.errors++;
          }
        }

        results.colleges.push({
          id: college.id,
          name: college.name,
          contactsFound: discoveredContacts.length,
          status: 'completed',
        });

        // Small delay to respect rate limits
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error processing ${college.name}:`, error);
        results.errors++;
        results.colleges.push({
          id: college.id,
          name: college.name,
          contactsFound: 0,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `AI recruiting helper completed discovery`,
      results,
      summary: {
        collegesProcessed: results.processed,
        contactsDiscovered: results.discovered,
        contactsUpdated: results.updated,
        errors: results.errors,
      },
    });
  } catch (error) {
    console.error('Error in AI recruiting discovery:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'AI recruiting discovery failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

// AI-powered contact discovery for a specific college
async function discoverCollegeContacts(college: any, targetSports: string[] = []) {
  try {
    // Create AI prompt for discovering coaching contacts
    const prompt = `You are an expert recruiting researcher. I need you to help discover coaching staff contact information for ${college.name} (${college.shortName || college.name}) located in ${college.city}, ${college.state}.

College Information:
- Name: ${college.name}
- Division: ${college.division}
- Conference: ${college.conference || 'Unknown'}
- Athletics Website: ${college.athleticsWebsite || college.website}
- Athletic Director: ${college.athleticDirector || 'Unknown'}

I need you to provide realistic coaching staff information for this institution. Focus on these sports: ${targetSports.length > 0 ? targetSports.join(', ') : 'football, basketball, baseball, softball, soccer'}.

For each coach, provide information in this exact JSON format:
{
  "firstName": "Coach's first name",
  "lastName": "Coach's last name", 
  "title": "Head Coach, Assistant Coach, etc.",
  "sport": "football, basketball, etc.",
  "gender": "men, women, or coed",
  "email": "realistic email format using school domain",
  "phone": "realistic phone number format",
  "recruitingEmail": "recruiting-specific email if different",
  "yearsAtSchool": 3,
  "totalYearsCoaching": 12,
  "recruitingTerritory": ["State1", "State2"],
  "recruitingFocus": ["Position types", "Player attributes"],
  "verified": false
}

Important guidelines:
1. Create realistic email addresses using the school's actual domain
2. Use proper coaching titles (Head Coach, Assistant Coach, Associate Head Coach)
3. Include both men's and women's programs where applicable
4. Focus on major revenue sports first (football, basketball)
5. Provide 2-4 coaches per college depending on size and division
6. Use realistic recruiting territories based on geographic location
7. Make phone numbers follow standard formats

Please provide a JSON array of coaching contacts for ${college.name}.`;

    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
      system:
        'You are a college recruiting research assistant. Provide accurate, realistic coaching contact information in valid JSON format only. No explanations or additional text.',
    });

    // Parse AI response
    const aiResponse = response.content[0];
    if (aiResponse.type === 'text') {
      try {
        // Extract JSON from response
        const jsonMatch = aiResponse.text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const contacts = JSON.parse(jsonMatch[0]);
          console.log(`AI discovered ${contacts.length} contacts for ${college.name}`);
          return contacts;
        }
      } catch (parseError) {
        console.error(`Error parsing AI response for ${college.name}:`, parseError);
        console.log('AI Response:', aiResponse.text);
      }
    }

    return [];
  } catch (error) {
    console.error(`Error in AI contact discovery for ${college.name}:`, error);
    return [];
  }
}

// Get discovery progress and stats
export async function GET() {
  try {
    const totalColleges = await db.select({ count: colleges.id }).from(colleges);
    const totalCoaches = await db.select({ count: coachingStaff.id }).from(coachingStaff);
    const aiDiscoveredCoaches = await db
      .select({ count: coachingStaff.id })
      .from(coachingStaff)
      .where(eq(coachingStaff.dataSource, 'AI_Discovery'));

    // Get colleges with contact counts - simplified approach
    const collegesWithContacts = await db
      .select({
        collegeId: colleges.id,
        collegeName: colleges.name,
        division: colleges.division,
      })
      .from(colleges);

    return NextResponse.json({
      success: true,
      statistics: {
        totalColleges: totalColleges.length,
        totalCoaches: totalCoaches.length,
        aiDiscoveredCoaches: aiDiscoveredCoaches.length,
        coveragePercentage: Math.round((aiDiscoveredCoaches.length / totalColleges.length) * 100),
      },
      recommendations: {
        nextActions: [
          'Run AI discovery on remaining colleges',
          'Verify and update existing contacts',
          'Add specialized coaching positions',
          'Expand to Olympic sports coverage',
        ],
      },
    });
  } catch (error) {
    console.error('Error getting discovery stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get discovery statistics',
      },
      { status: 500 },
    );
  }
}
