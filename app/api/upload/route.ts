import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/server/routes';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const sport = formData.get('sport') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    if (!sport) {
      return NextResponse.json({ error: 'Sport is required' }, { status: 400 });
    }
    
    // Mock file upload success - in production, this would save to storage
    const uploadResult = {
      success: true,
      fileId: `file_${Date.now()}`,
      fileName: file.name,
      fileSize: file.size,
      filePath: `/uploads/${user.id}/${file.name}`,
      sport,
      uploadedAt: new Date().toISOString(),
      processingStatus: 'queued'
    };
    
    return NextResponse.json(uploadResult);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}