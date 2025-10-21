import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Fetch projects led by the user
    const userProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.leadId, userId))
      .orderBy(projects.createdAt);

    return NextResponse.json(userProjects);
  } catch (error) {
    console.error('[PROJECTS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { title, description, goalId, status } = body;

    const newProject = await db.insert(projects).values({
      title,
      description,
      goalId,
      leadId: userId,
      status: status || 'active',
    }).returning();

    return NextResponse.json(newProject[0]);
  } catch (error) {
    console.error('[PROJECTS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
