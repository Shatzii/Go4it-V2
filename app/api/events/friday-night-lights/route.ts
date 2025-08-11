import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { fridayNightLightsRegistrations, users } from '@/shared/schema';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { go4itAI } from '@/lib/openai-integration';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    let userId = null;
    let accountCreated = false;

    // Check if user is creating a new account
    if (data.createAccount && data.username && data.password) {
      try {
        // Check if username/email already exists
        const existingUser = await db.select().from(users)
          .where(eq(users.email, data.email))
          .limit(1);

        if (existingUser.length > 0) {
          return NextResponse.json(
            { error: 'An account with this email already exists. Please log in first.' },
            { status: 400 }
          );
        }

        // Hash password
        const hashedPassword = await hash(data.password, 12);

        // Create new user account
        const [newUser] = await db.insert(users).values({
          username: data.username,
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: new Date(data.dateOfBirth),
          position: data.primarySport === 'flag-football' ? data.position : null,
          sport: data.primarySport,
          role: 'athlete'
        }).returning();

        userId = newUser.id;
        accountCreated = true;
      } catch (error) {
        console.error('Account creation error:', error);
        return NextResponse.json(
          { error: 'Failed to create account. Please try again.' },
          { status: 500 }
        );
      }
    }

    // Create Friday Night Lights registration
    const registrationData = {
      userId,
      eventType: data.eventType, // 'open-house', 'tryout', 'both'
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      dateOfBirth: new Date(data.dateOfBirth),
      parentName: data.parentName,
      parentEmail: data.parentEmail,
      emergencyContact: data.emergencyContact,
      emergencyPhone: data.emergencyPhone,
      
      // Universal One Open House specific
      universalOneInterest: data.universalOneInterest || false,
      academicPrograms: data.academicPrograms ? JSON.stringify(data.academicPrograms) : null,
      needsAcademicSupport: data.needsAcademicSupport || false,
      
      // Team tryout specific
      primarySport: data.primarySport,
      secondarySports: data.secondarySports ? JSON.stringify(data.secondarySports) : null,
      position: data.position,
      experience: data.experience,
      previousTeams: data.previousTeams,
      
      // Sports-specific details
      flagFootballTryout: data.flagFootballTryout || false,
      basketballTryout: data.basketballTryout || false,
      soccerTryout: data.soccerTryout || false,
      
      // Additional preferences
      garAnalysisOptIn: data.garAnalysisOptIn || true,
      aiCoachingOptIn: data.aiCoachingOptIn || true,
      recruitmentOptIn: data.recruitmentOptIn || true,
      
      // Event logistics
      transportationNeeds: data.transportationNeeds || false,
      dietaryRestrictions: data.dietaryRestrictions,
      specialAccommodations: data.specialAccommodations,
      
      status: 'confirmed',
      registrationDate: new Date().toISOString()
    };

    const [registration] = await db.insert(fridayNightLightsRegistrations)
      .values(registrationData)
      .returning();

    // Generate AI-powered event preparation recommendations
    let aiRecommendations = null;
    try {
      const analysisRequest = {
        sport: data.primarySport,
        analysisType: 'coaching' as const,
        context: {
          eventType: data.eventType,
          sports: [data.primarySport, ...(data.secondarySports || [])],
          experience: data.experience,
          universalOneInterest: data.universalOneInterest,
          age: new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear()
        }
      };
      
      aiRecommendations = await go4itAI.generateCoachingAdvice(analysisRequest);
    } catch (error) {
      console.error('AI recommendations error:', error);
    }

    // Send SMS notification if phone provided
    if (data.phone) {
      try {
        const smsResponse = await fetch('/api/sms/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: data.phone,
            message: `🏈 Welcome to Friday Night Lights! Your registration is confirmed. Event Date: TBD. Get ready to showcase your skills in ${data.primarySport}! More details coming soon. - Go4It Sports`
          })
        });
      } catch (smsError) {
        console.error('SMS notification error:', smsError);
      }
    }

    return NextResponse.json({
      success: true,
      registrationId: registration.id,
      accountCreated,
      aiRecommendations,
      message: 'Friday Night Lights registration confirmed! Check your email for event details.',
      eventDetails: {
        title: 'Friday Night Lights - Universal One Open House & Team Tryouts',
        sports: ['flag-football', 'basketball', 'soccer'],
        includes: [
          'Universal One Academy presentation',
          'Multi-sport team tryouts',
          'GAR performance analysis',
          'AI coaching sessions',
          'Recruitment opportunities',
          'Parent information sessions'
        ]
      }
    });

  } catch (error) {
    console.error('Friday Night Lights registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get all Friday Night Lights registrations (admin only)
    const registrations = await db.select().from(fridayNightLightsRegistrations);
    
    const summary = {
      totalRegistrations: registrations.length,
      openHouseOnly: registrations.filter(r => r.eventType === 'open-house').length,
      tryoutsOnly: registrations.filter(r => r.eventType === 'tryout').length,
      both: registrations.filter(r => r.eventType === 'both').length,
      sportBreakdown: {
        flagFootball: registrations.filter(r => r.flagFootballTryout).length,
        basketball: registrations.filter(r => r.basketballTryout).length,
        soccer: registrations.filter(r => r.soccerTryout).length
      },
      universalOneInterest: registrations.filter(r => r.universalOneInterest).length
    };

    return NextResponse.json({
      success: true,
      registrations,
      summary
    });

  } catch (error) {
    console.error('Get registrations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}