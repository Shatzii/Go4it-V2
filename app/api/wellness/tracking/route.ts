import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { wellnessTracking, users } from '@/shared/schema';
import { eq, desc, and, gte } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user';
    const days = parseInt(searchParams.get('days') || '7');

    // Get wellness data for the specified number of days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let wellnessData = await db
      .select()
      .from(wellnessTracking)
      .where(and(eq(wellnessTracking.userId, userId), gte(wellnessTracking.date, startDate)))
      .orderBy(desc(wellnessTracking.date))
      .limit(days);

    // If no data exists, create sample data for demo
    if (wellnessData.length === 0) {
      const sampleData = Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));
        return {
          userId,
          date,
          sleep: Math.random() * 3 + 7, // 7-10 hours
          hydration: Math.random() * 40 + 60, // 60-100%
          stress: Math.random() * 6 + 2, // 2-8 scale
          energy: Math.random() * 4 + 6, // 6-10 scale
          mood: Math.random() * 4 + 6, // 6-10 scale
          recovery: Math.random() * 30 + 70, // 70-100%
          weight: 175 + Math.random() * 10 - 5, // 170-180 lbs
          heartRate: 60 + Math.random() * 20, // 60-80 bpm
          notes: '',
        };
      });

      await db.insert(wellnessTracking).values(sampleData);

      wellnessData = await db
        .select()
        .from(wellnessTracking)
        .where(and(eq(wellnessTracking.userId, userId), gte(wellnessTracking.date, startDate)))
        .orderBy(desc(wellnessTracking.date))
        .limit(days);
    }

    // Calculate averages and trends
    const averages = {
      sleep: wellnessData.reduce((sum, d) => sum + (d.sleep || 0), 0) / wellnessData.length,
      hydration: wellnessData.reduce((sum, d) => sum + (d.hydration || 0), 0) / wellnessData.length,
      stress: wellnessData.reduce((sum, d) => sum + (d.stress || 0), 0) / wellnessData.length,
      energy: wellnessData.reduce((sum, d) => sum + (d.energy || 0), 0) / wellnessData.length,
      mood: wellnessData.reduce((sum, d) => sum + (d.mood || 0), 0) / wellnessData.length,
      recovery: wellnessData.reduce((sum, d) => sum + (d.recovery || 0), 0) / wellnessData.length,
    };

    // Generate recommendations based on data
    const recommendations = [];
    if (averages.sleep < 8) {
      recommendations.push('Consider increasing sleep duration for better recovery');
    }
    if (averages.hydration < 80) {
      recommendations.push('Increase daily water intake for optimal hydration');
    }
    if (averages.stress > 6) {
      recommendations.push('Try stress management techniques like meditation');
    }
    if (averages.energy < 7) {
      recommendations.push('Focus on nutrition and recovery to boost energy levels');
    }

    return NextResponse.json({
      success: true,
      data: wellnessData,
      averages,
      recommendations,
      metadata: {
        totalEntries: wellnessData.length,
        period: `${days} days`,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching wellness data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wellness data' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId = 'demo-user', ...wellnessMetrics } = body;

    const newEntry = await db
      .insert(wellnessTracking)
      .values({
        userId,
        ...wellnessMetrics,
        date: new Date(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newEntry[0],
      message: 'Wellness data recorded successfully',
    });
  } catch (error) {
    console.error('Error saving wellness data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save wellness data' },
      { status: 500 },
    );
  }
}
