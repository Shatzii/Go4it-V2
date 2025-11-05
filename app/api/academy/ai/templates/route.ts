import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// TODO: This route uses raw SQLite queries and needs migration to Drizzle ORM
// Temporarily disabled during PostgreSQL migration

const MIGRATION_MESSAGE = {
  error: 'Academy feature requires database migration',
  message: 'This endpoint uses legacy SQLite and is being migrated to PostgreSQL',
  status: 'under_maintenance'
};

export async function GET(request: NextRequest) {
  return NextResponse.json(MIGRATION_MESSAGE, { status: 503 });
}

export async function POST(request: NextRequest) {
  return NextResponse.json(MIGRATION_MESSAGE, { status: 503 });
}

export async function PUT(request: NextRequest) {
  return NextResponse.json(MIGRATION_MESSAGE, { status: 503 });
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json(MIGRATION_MESSAGE, { status: 503 });
}

export async function PATCH(request: NextRequest) {
  return NextResponse.json(MIGRATION_MESSAGE, { status: 503 });
}

/* 
 * ORIGINAL CODE BELOW - NEEDS MIGRATION TO DRIZZLE ORM
 * ====================================================
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export async function GET(request: NextRequest) {
// Build-time safety: skip during static generation
if (process.env.NEXT_PHASE === 'phase-production-build') {
  return NextResponse.json({ error: 'Service temporarily unavailable during build' }, { status: 503 });
}

    try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const gradeLevel = searchParams.get('gradeLevel');
    const templateType = searchParams.get('templateType');
    let query = `SELECT * FROM ai_content_templates WHERE 1=1`;
    const params: any[] = [];

    if (subject) {
      query += ` AND subject = ?`;
      params.push(subject);
    }

    if (gradeLevel) {
      query += ` AND grade_level = ?`;
      params.push(gradeLevel);
    }

    if (templateType) {
      query += ` AND template_type = ?`;
      params.push(templateType);
    }

    query += ` ORDER BY rating DESC, usage_count DESC LIMIT 50`;

    const templates = db.prepare(query).all(...params);

    // Parse JSON fields
    const processedTemplates = templates.map(template => ({
      ...template,
      templateData: JSON.parse(template.template_data),
      tags: template.tags ? JSON.parse(template.tags) : [],
    }));

    return NextResponse.json({ templates: processedTemplates });

  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
// Build-time safety: skip during static generation
if (process.env.NEXT_PHASE === 'phase-production-build') {
  return NextResponse.json({ error: 'Service temporarily unavailable during build' }, { status: 503 });
}

    try {
    const body = await request.json();
    const { name, description, subject, gradeLevel, templateType, templateData, createdBy, tags } = body;

    if (!name || !subject || !gradeLevel || !templateType || !templateData || !createdBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const insert = db.prepare(`
      INSERT INTO ai_content_templates (
        id, name, description, subject, grade_level, template_type,
        template_data, created_by, tags
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const templateId = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    insert.run(
      templateId,
      name,
      description || '',
      subject,
      gradeLevel,
      templateType,
      JSON.stringify(templateData),
      createdBy,
      tags ? JSON.stringify(tags) : null
    );

    return NextResponse.json({
      success: true,
      templateId,
      message: 'Template created successfully'
    });

  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}
 */
