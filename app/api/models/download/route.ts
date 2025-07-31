import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { localModelManager } from '@/lib/local-models';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { modelName, downloadAll } = await request.json();

    if (downloadAll) {
      // Download all models
      const success = await localModelManager.downloadAllModels((modelName, progress) => {
        console.log(`Downloading ${modelName}: ${progress}%`);
      });

      return NextResponse.json({
        success,
        message: success ? 'All models downloaded successfully' : 'Some models failed to download'
      });
    } else if (modelName) {
      // Download specific model
      const success = await localModelManager.downloadModel(modelName);
      
      return NextResponse.json({
        success,
        message: success ? `${modelName} downloaded successfully` : `Failed to download ${modelName}`
      });
    } else {
      return NextResponse.json({ error: 'Model name or downloadAll flag required' }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Model download error:', error);
    return NextResponse.json(
      { error: `Download failed: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const status = await localModelManager.getModelsStatus();
    
    return NextResponse.json(status);

  } catch (error: any) {
    console.error('Models status error:', error);
    return NextResponse.json(
      { error: 'Failed to get models status' },
      { status: 500 }
    );
  }
}