// AI Model Status API - Check if models are running locally
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const modelStatuses = {
      ollama: await checkOllamaStatus(),
      huggingface: await checkHuggingFaceStatus(),
      localInference: await checkLocalInferenceStatus(),
    };

    return NextResponse.json({
      modelStatuses,
      preferredMode: process.env.USE_LOCAL_MODELS === 'true' ? 'local' : 'cloud',
      availableProviders: {
        openai: !!process.env.OPENAI_API_KEY,
        anthropic: !!process.env.ANTHROPIC_API_KEY,
        local: modelStatuses.ollama || modelStatuses.localInference,
      },
    });
  } catch (error) {
    console.error('Error checking model status:', error);
    return NextResponse.json({ error: 'Failed to check model status' }, { status: 500 });
  }
}

async function checkOllamaStatus(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:11434/api/tags', {
      method: 'GET',
      signal: AbortSignal.timeout(2000), // 2 second timeout
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function checkHuggingFaceStatus(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:8080/health', {
      method: 'GET',
      signal: AbortSignal.timeout(2000),
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function checkLocalInferenceStatus(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:3001/health', {
      method: 'GET',
      signal: AbortSignal.timeout(2000),
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}
