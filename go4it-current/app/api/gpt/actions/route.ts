import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Read the action map JSON file
    const filePath = path.join(process.cwd(), 'gpt', 'go4it_actions_pro.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const actionMap = JSON.parse(fileContents);

    // Add CORS headers for cross-origin requests
    const response = NextResponse.json(actionMap, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=900, s-maxage=900', // Cache for 15 minutes
      },
    });

    return response;
  } catch (error) {
    console.error('Error serving GPT action map:', error);
    return NextResponse.json(
      { error: 'Failed to load GPT action map' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}