import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
const dbPath = path.join(process.cwd(), 'go4it-academy.db');
const db = new Database(dbPath);

export async function GET(request: NextRequest) {
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