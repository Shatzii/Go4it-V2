import { NextRequest, NextResponse } from 'next/server';
import { smsService } from '@/lib/twilio-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipients, template, templateData, type } = body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Recipients array is required'
      }, { status: 400 });
    }

    if (recipients.length > 100) {
      return NextResponse.json({
        success: false,
        error: 'Maximum 100 recipients per bulk request'
      }, { status: 400 });
    }

    // Validate all phone numbers
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const invalidNumbers = recipients.filter(r => 
      !phoneRegex.test(r.phone?.replace(/\s/g, '') || '')
    );

    if (invalidNumbers.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Invalid phone numbers detected: ${invalidNumbers.length} invalid`,
        invalidNumbers: invalidNumbers.map(r => r.phone)
      }, { status: 400 });
    }

    const result = await smsService.sendBulkSMS(recipients);

    // Log bulk SMS activity
    console.log(`Bulk SMS completed: ${result.totalSent} sent, ${result.totalFailed} failed`);

    return NextResponse.json({
      success: true,
      totalSent: result.totalSent,
      totalFailed: result.totalFailed,
      results: result.results,
      message: `Bulk SMS completed: ${result.totalSent} sent successfully`
    });

  } catch (error: any) {
    console.error('Bulk SMS API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to send bulk SMS'
    }, { status: 500 });
  }
}