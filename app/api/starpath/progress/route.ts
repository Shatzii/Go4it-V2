import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userSkillProgress, skills, skillTrees, xpTransactions } from '@/lib/schema';
import { getUser } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's skill progress with skill and tree data
    const progress = await db
      .select({
        id: userSkillProgress.id,
        skillId: userSkillProgress.skillId,
        xpEarned: userSkillProgress.xpEarned,
        level: userSkillProgress.level,
        unlocked: userSkillProgress.unlocked,
        completed: userSkillProgress.completed,
        skillName: skills.name,
        skillDescription: skills.description,
        xpRequired: skills.xpRequired,
        category: skills.category,
        treeName: skillTrees.name,
        sportType: skillTrees.sportType
      })
      .from(userSkillProgress)
      .leftJoin(skills, eq(userSkillProgress.skillId, skills.id))
      .leftJoin(skillTrees, eq(skills.treeId, skillTrees.id))
      .where(eq(userSkillProgress.userId, user.id));

    return NextResponse.json({ progress });
  } catch (error) {
    console.error('StarPath progress error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { skillId, xpGained, source, description } = await request.json();

    if (!skillId || !xpGained) {
      return NextResponse.json(
        { error: 'Skill ID and XP amount required' },
        { status: 400 }
      );
    }

    // Get current progress
    const [currentProgress] = await db
      .select()
      .from(userSkillProgress)
      .where(and(
        eq(userSkillProgress.userId, user.id),
        eq(userSkillProgress.skillId, skillId)
      ))
      .limit(1);

    const newXpTotal = (currentProgress?.xpEarned || 0) + xpGained;
    
    // Get skill info for level calculation
    const [skill] = await db
      .select()
      .from(skills)
      .where(eq(skills.id, skillId))
      .limit(1);

    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    const newLevel = Math.floor(newXpTotal / skill.xpRequired);
    const completed = newXpTotal >= skill.xpRequired;

    // Update or insert progress
    let updatedProgress;
    if (currentProgress) {
      [updatedProgress] = await db
        .update(userSkillProgress)
        .set({
          xpEarned: newXpTotal,
          level: newLevel,
          completed,
          lastActivityAt: new Date()
        })
        .where(eq(userSkillProgress.id, currentProgress.id))
        .returning();
    } else {
      [updatedProgress] = await db
        .insert(userSkillProgress)
        .values({
          userId: user.id,
          skillId,
          xpEarned: newXpTotal,
          level: newLevel,
          unlocked: true,
          completed,
          unlockedAt: new Date(),
          completedAt: completed ? new Date() : null
        })
        .returning();
    }

    // Record XP transaction
    await db.insert(xpTransactions).values({
      userId: user.id,
      skillId,
      amount: xpGained,
      source: source || 'manual',
      description: description || 'Skill progress update'
    });

    return NextResponse.json({ 
      success: true, 
      progress: updatedProgress,
      levelUp: newLevel > (currentProgress?.level || 0)
    });

  } catch (error) {
    console.error('StarPath update error:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}