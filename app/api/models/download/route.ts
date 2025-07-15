// Model Download API for Go4It Sports Platform
// Handles downloading and setup of local AI models

import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { AVAILABLE_LOCAL_MODELS, LocalModelInfo } from '@/lib/ai-models';
import { writeFile, mkdir, access } from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Return available models for download
    return NextResponse.json({
      models: AVAILABLE_LOCAL_MODELS,
      localModelsPath: process.env.LOCAL_MODELS_PATH || './models',
      systemRequirements: {
        minimumRam: '4GB',
        recommendedRam: '8GB',
        minimumStorage: '5GB',
        recommendedGpu: 'RTX 3060 or better (optional)'
      }
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { modelName, installationType } = await request.json();
    
    if (!modelName) {
      return NextResponse.json({ error: 'Model name is required' }, { status: 400 });
    }

    const modelInfo = AVAILABLE_LOCAL_MODELS.find(m => m.name === modelName);
    if (!modelInfo) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }

    // Create models directory
    const modelsPath = path.join(process.cwd(), 'models');
    try {
      await mkdir(modelsPath, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    const modelPath = path.join(modelsPath, modelInfo.modelFile);

    // Check if model already exists
    try {
      await access(modelPath);
      return NextResponse.json({ 
        message: 'Model already installed',
        modelPath: modelPath,
        status: 'ready'
      });
    } catch (error) {
      // Model doesn't exist, proceed with installation
    }

    if (installationType === 'download') {
      // Download model file (in real implementation, this would download from a CDN)
      const downloadProgress = await downloadModelFile(modelInfo, modelPath);
      
      return NextResponse.json({
        message: 'Model download started',
        downloadProgress: downloadProgress,
        modelPath: modelPath,
        status: 'downloading'
      });
    } else if (installationType === 'ollama') {
      // Install via Ollama
      const ollamaResult = await installOllamaModel(modelInfo);
      
      return NextResponse.json({
        message: 'Model installed via Ollama',
        result: ollamaResult,
        status: 'ready'
      });
    }

    return NextResponse.json({ error: 'Invalid installation type' }, { status: 400 });

  } catch (error) {
    console.error('Error installing model:', error);
    return NextResponse.json({ error: 'Failed to install model' }, { status: 500 });
  }
}

async function downloadModelFile(modelInfo: LocalModelInfo, destinationPath: string): Promise<number> {
  // In a real implementation, this would:
  // 1. Download the model file from a CDN or model repository
  // 2. Show progress updates
  // 3. Verify file integrity
  // 4. Extract if compressed
  
  // For now, we'll simulate the download
  console.log(`Downloading ${modelInfo.name} to ${destinationPath}`);
  
  // Create a placeholder file to simulate download
  const placeholderContent = `# ${modelInfo.name} Model
# This is a placeholder for the actual model file
# In production, this would be the actual model binary
# Size: ${modelInfo.size}
# Capabilities: ${modelInfo.capabilities.join(', ')}

# Model would be downloaded from: ${modelInfo.downloadUrl}
# Requirements: ${JSON.stringify(modelInfo.requirements, null, 2)}
`;

  await writeFile(destinationPath, placeholderContent);
  
  return 100; // 100% complete
}

async function installOllamaModel(modelInfo: LocalModelInfo): Promise<string> {
  try {
    // Install Ollama if not already installed
    const ollamaCheck = await execAsync('which ollama');
    if (!ollamaCheck.stdout) {
      throw new Error('Ollama not installed. Please install Ollama first.');
    }

    // Pull the model via Ollama
    const modelName = modelInfo.name.toLowerCase().replace(/\s+/g, '-');
    const { stdout, stderr } = await execAsync(`ollama pull ${modelName}`);
    
    if (stderr) {
      console.error('Ollama stderr:', stderr);
    }

    return stdout;
  } catch (error) {
    console.error('Error installing Ollama model:', error);
    throw error;
  }
}

// Get model installation status
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { modelName } = await request.json();
    const modelInfo = AVAILABLE_LOCAL_MODELS.find(m => m.name === modelName);
    
    if (!modelInfo) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }

    const modelsPath = path.join(process.cwd(), 'models');
    const modelPath = path.join(modelsPath, modelInfo.modelFile);

    try {
      await access(modelPath);
      
      // Check if Ollama is available and model is loaded
      try {
        const ollamaResponse = await fetch('http://localhost:11434/api/tags');
        if (ollamaResponse.ok) {
          const models = await ollamaResponse.json();
          const isLoaded = models.models?.some((m: any) => 
            m.name.includes(modelInfo.name.toLowerCase().replace(/\s+/g, '-'))
          );
          
          return NextResponse.json({
            status: isLoaded ? 'ready' : 'installed',
            modelPath: modelPath,
            ollamaAvailable: true,
            message: isLoaded ? 'Model ready for use' : 'Model installed but not loaded'
          });
        }
      } catch (error) {
        // Ollama not available
      }

      return NextResponse.json({
        status: 'installed',
        modelPath: modelPath,
        ollamaAvailable: false,
        message: 'Model file installed'
      });
    } catch (error) {
      return NextResponse.json({
        status: 'not_installed',
        modelPath: modelPath,
        message: 'Model not installed'
      });
    }
  } catch (error) {
    console.error('Error checking model status:', error);
    return NextResponse.json({ error: 'Failed to check model status' }, { status: 500 });
  }
}