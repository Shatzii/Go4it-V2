import { NextRequest, NextResponse } from 'next/server';


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

export async function GET(
  request: NextRequest,
  { params }: { params: { certificateId: string } }
) {
// Build-time safety: skip during static generation
if (process.env.NEXT_PHASE === 'phase-production-build') {
  return NextResponse.json({ error: 'Service temporarily unavailable during build' }, { status: 503 });
}

    try {
    const certificate = db.prepare(`
      SELECT
        c.*,
        s.name as student_name,
        co.title as course_name,
        t.name as teacher_name,
        ct.title as template_title,
        ct.subtitle as template_subtitle,
        ct.description as template_description,
        ct.signature_title
      FROM certificates c
      JOIN academy_students s ON c.student_id = s.id
      LEFT JOIN academy_courses co ON c.course_id = co.id
      JOIN academy_teachers t ON c.issued_by = t.id
      JOIN certificate_templates ct ON c.template_id = ct.id
      WHERE c.id = ?
    `).get(params.certificateId);
    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    // Generate HTML certificate
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Certificate - ${certificate.certificate_number}</title>
        <style>
          body {
            font-family: 'Times New Roman', serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .certificate {
            background: white;
            padding: 60px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 800px;
            width: 100%;
            position: relative;
          }
          .certificate::before {
            content: '';
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            bottom: 20px;
            border: 3px solid #ffd700;
            border-radius: 15px;
            pointer-events: none;
          }
          .header {
            color: #2c3e50;
            margin-bottom: 40px;
          }
          .title {
            font-size: 48px;
            font-weight: bold;
            margin: 20px 0;
            color: #2c3e50;
          }
          .subtitle {
            font-size: 24px;
            color: #7f8c8d;
            margin: 20px 0;
          }
          .recipient {
            font-size: 36px;
            font-weight: bold;
            color: #2c3e50;
            margin: 30px 0;
            text-transform: uppercase;
          }
          .description {
            font-size: 18px;
            color: #34495e;
            line-height: 1.6;
            margin: 30px 0;
          }
          .details {
            display: flex;
            justify-content: space-between;
            margin: 40px 0;
            font-size: 14px;
            color: #7f8c8d;
          }
          .signature {
            margin-top: 60px;
            border-top: 2px solid #bdc3c7;
            padding-top: 20px;
          }
          .signature-line {
            width: 200px;
            border-bottom: 1px solid #2c3e50;
            margin: 0 auto 10px;
          }
          .certificate-number {
            position: absolute;
            bottom: 20px;
            right: 30px;
            font-size: 12px;
            color: #95a5a6;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="header">
            <h1>Go4it Academy</h1>
          </div>

          <div class="title">${certificate.template_title}</div>

          <div class="subtitle">${certificate.template_subtitle}</div>

          <div class="recipient">${certificate.student_name}</div>

          <div class="description">
            ${certificate.description || certificate.template_description}
          </div>

          ${certificate.course_name ? `
            <div class="description">
              For successfully completing the course: <strong>${certificate.course_name}</strong>
            </div>
          ` : ''}

          <div class="details">
            <div>
              <strong>Date Issued:</strong><br>
              ${new Date(certificate.issued_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div>
              <strong>Issued By:</strong><br>
              ${certificate.teacher_name}
            </div>
          </div>

          <div class="signature">
            <div class="signature-line"></div>
            <div>${certificate.signature_title || 'Instructor'}</div>
          </div>

          <div class="certificate-number">
            Certificate #: ${certificate.certificate_number}
          </div>
        </div>
      </body>
      </html>
    `;

    // Return HTML content that can be printed as PDF
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="certificate-${certificate.certificate_number}.html"`,
      },
    });
  } catch (error) {
    console.error('Error generating certificate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
 */
