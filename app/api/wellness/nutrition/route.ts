import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { nutritionPlans } from '@/shared/schema';
import { eq, and } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user';
    const sport = searchParams.get('sport') || 'football';
    const phase = searchParams.get('phase') || 'training';

    // Try to find existing nutrition plan
    let nutritionPlan = await db
      .select()
      .from(nutritionPlans)
      .where(
        and(
          eq(nutritionPlans.userId, userId),
          eq(nutritionPlans.sport, sport),
          eq(nutritionPlans.phase, phase),
          eq(nutritionPlans.isActive, true),
        ),
      )
      .limit(1);

    // If no plan exists, create a default one
    if (nutritionPlan.length === 0) {
      const defaultPlans = {
        football: {
          training: {
            calories: 3500,
            protein: 180,
            carbs: 420,
            fats: 120,
            meals: [
              {
                name: 'Pre-Training Fuel',
                time: '6:00 AM',
                calories: 600,
                description: 'Oatmeal with banana, berries, and protein powder',
                benefits: 'Sustained energy for morning training',
              },
              {
                name: 'Post-Training Recovery',
                time: '9:00 AM',
                calories: 450,
                description: 'Greek yogurt with granola and chocolate milk',
                benefits: 'Muscle recovery and glycogen replenishment',
              },
              {
                name: 'Power Lunch',
                time: '12:30 PM',
                calories: 800,
                description: 'Grilled chicken, quinoa, roasted vegetables',
                benefits: 'Complete protein and complex carbohydrates',
              },
              {
                name: 'Pre-Workout Snack',
                time: '3:30 PM',
                calories: 300,
                description: 'Apple with almond butter and honey',
                benefits: 'Quick energy for afternoon training',
              },
              {
                name: 'Recovery Dinner',
                time: '7:00 PM',
                calories: 900,
                description: 'Salmon, sweet potato, steamed broccoli',
                benefits: 'Anti-inflammatory and muscle repair',
              },
              {
                name: 'Evening Restoration',
                time: '9:30 PM',
                calories: 250,
                description: 'Cottage cheese with berries',
                benefits: 'Overnight muscle recovery',
              },
            ],
          },
          competition: {
            calories: 3800,
            protein: 200,
            carbs: 480,
            fats: 130,
            meals: [
              {
                name: 'Game Day Breakfast',
                time: '6:00 AM',
                calories: 700,
                description: 'Pancakes with banana and honey, turkey bacon',
                benefits: 'High energy for game performance',
              },
              {
                name: 'Pre-Game Meal',
                time: '10:00 AM',
                calories: 600,
                description: 'Pasta with lean meat sauce and vegetables',
                benefits: 'Carb loading for sustained energy',
              },
              {
                name: 'Pre-Game Snack',
                time: '1:00 PM',
                calories: 400,
                description: 'Energy bar and sports drink',
                benefits: 'Final energy boost before game',
              },
              {
                name: 'Half-Time Fuel',
                time: '3:00 PM',
                calories: 200,
                description: 'Orange slices and electrolyte drink',
                benefits: 'Quick energy and hydration',
              },
              {
                name: 'Post-Game Recovery',
                time: '6:00 PM',
                calories: 800,
                description: 'Protein shake and recovery meal',
                benefits: 'Immediate muscle recovery',
              },
              {
                name: 'Evening Meal',
                time: '8:00 PM',
                calories: 600,
                description: 'Lean protein with complex carbs',
                benefits: 'Continued recovery and restoration',
              },
            ],
          },
          recovery: {
            calories: 3200,
            protein: 160,
            carbs: 360,
            fats: 110,
            meals: [
              {
                name: 'Recovery Breakfast',
                time: '7:00 AM',
                calories: 550,
                description: 'Smoothie bowl with anti-inflammatory ingredients',
                benefits: 'Reduce inflammation and promote healing',
              },
              {
                name: 'Mid-Morning Snack',
                time: '10:00 AM',
                calories: 300,
                description: 'Tart cherry juice and nuts',
                benefits: 'Natural anti-inflammatory compounds',
              },
              {
                name: 'Healing Lunch',
                time: '12:30 PM',
                calories: 650,
                description: 'Turmeric chicken with vegetables',
                benefits: 'Anti-inflammatory spices for recovery',
              },
              {
                name: 'Afternoon Recovery',
                time: '3:30 PM',
                calories: 350,
                description: 'Green tea and recovery bar',
                benefits: 'Antioxidants for muscle repair',
              },
              {
                name: 'Restorative Dinner',
                time: '7:00 PM',
                calories: 700,
                description: 'Wild salmon with sweet potato',
                benefits: 'Omega-3s for inflammation reduction',
              },
              {
                name: 'Bedtime Snack',
                time: '9:30 PM',
                calories: 250,
                description: 'Herbal tea and light protein',
                benefits: 'Promote restful sleep and recovery',
              },
            ],
          },
        },
        basketball: {
          training: {
            calories: 3200,
            protein: 160,
            carbs: 380,
            fats: 110,
            meals: [
              {
                name: 'Quick Court Breakfast',
                time: '6:30 AM',
                calories: 550,
                description: 'Whole grain toast with avocado and eggs',
                benefits: 'Sustained energy for practice',
              },
              {
                name: 'Post-Practice Recovery',
                time: '9:30 AM',
                calories: 400,
                description: 'Protein smoothie with berries',
                benefits: 'Quick muscle recovery',
              },
              {
                name: 'Power Lunch',
                time: '1:00 PM',
                calories: 700,
                description: 'Quinoa bowl with chicken and vegetables',
                benefits: 'Complete nutrition for afternoon energy',
              },
              {
                name: 'Pre-Training Fuel',
                time: '4:00 PM',
                calories: 300,
                description: 'Banana with peanut butter',
                benefits: 'Quick energy for evening practice',
              },
              {
                name: 'Recovery Dinner',
                time: '7:30 PM',
                calories: 800,
                description: 'Lean beef with brown rice and vegetables',
                benefits: 'Muscle repair and glycogen replenishment',
              },
              {
                name: 'Evening Recovery',
                time: '9:30 PM',
                calories: 250,
                description: 'Greek yogurt with honey',
                benefits: 'Overnight muscle recovery',
              },
            ],
          },
        },
      };

      const planData =
        defaultPlans[sport as keyof typeof defaultPlans]?.[
          phase as keyof typeof defaultPlans.football
        ] || defaultPlans.football.training;

      const newPlan = await db
        .insert(nutritionPlans)
        .values({
          userId,
          sport,
          phase,
          ...planData,
        })
        .returning();

      nutritionPlan = newPlan;
    }

    return NextResponse.json({
      success: true,
      nutritionPlan: nutritionPlan[0],
      metadata: {
        sport,
        phase,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching nutrition plan:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch nutrition plan' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId = 'demo-user', sport, phase, ...planData } = body;

    // Deactivate existing plans for this user/sport/phase
    await db
      .update(nutritionPlans)
      .set({ isActive: false })
      .where(
        and(
          eq(nutritionPlans.userId, userId),
          eq(nutritionPlans.sport, sport),
          eq(nutritionPlans.phase, phase),
        ),
      );

    // Create new active plan
    const newPlan = await db
      .insert(nutritionPlans)
      .values({
        userId,
        sport,
        phase,
        ...planData,
        isActive: true,
      })
      .returning();

    return NextResponse.json({
      success: true,
      nutritionPlan: newPlan[0],
      message: 'Nutrition plan created successfully',
    });
  } catch (error) {
    console.error('Error creating nutrition plan:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create nutrition plan' },
      { status: 500 },
    );
  }
}
