// Model Encryption API
// Handles encryption and decryption of AI models

import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { createModelEncryptionManager } from '@/lib/model-encryption';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { action, ...data } = await request.json();
    const encryptionManager = createModelEncryptionManager();

    switch (action) {
      case 'encrypt':
        return await handleEncryptModel(user.id, data, encryptionManager);
      case 'decrypt':
        return await handleDecryptModel(user.id, data, encryptionManager);
      case 'verify':
        return await handleVerifyModel(user.id, data, encryptionManager);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Model encryption API error:', error);
    return NextResponse.json({ error: 'Encryption operation failed' }, { status: 500 });
  }
}

async function handleEncryptModel(
  userId: number,
  data: {
    modelName: string;
    licenseId: string;
    modelPath: string;
    metadata: {
      version: string;
      capabilities: string[];
      requirements: {
        ram: string;
        storage: string;
        gpu?: string;
      };
    };
  },
  encryptionManager: any,
) {
  const { modelName, licenseId, modelPath, metadata } = data;

  // Validate license
  const licenseStatus = await encryptionManager.getLicenseStatus(licenseId);
  if (!licenseStatus.valid) {
    return NextResponse.json(
      {
        error: 'Invalid license',
        status: licenseStatus.status,
      },
      { status: 400 },
    );
  }

  const license = licenseStatus.license;
  if (license.userId !== userId) {
    return NextResponse.json({ error: 'License does not belong to user' }, { status: 403 });
  }

  try {
    // Read the model file
    const modelData = await readFile(modelPath);

    // Encrypt the model
    const encryptedModel = await encryptionManager.encryptModel(modelData, license, {
      ...metadata,
      originalSize: modelData.length,
    });

    // Save encrypted model
    const encryptedPath = await encryptionManager.saveEncryptedModel(encryptedModel);

    return NextResponse.json({
      success: true,
      encryptedPath,
      modelName: encryptedModel.modelName,
      encryptedSize: encryptedModel.encryptedData.length,
      originalSize: encryptedModel.metadata.originalSize,
    });
  } catch (error) {
    console.error('Model encryption failed:', error);
    return NextResponse.json({ error: 'Failed to encrypt model' }, { status: 500 });
  }
}

async function handleDecryptModel(
  userId: number,
  data: {
    modelName: string;
    licenseKey: string;
    outputPath?: string;
  },
  encryptionManager: any,
) {
  const { modelName, licenseKey, outputPath } = data;

  // Validate license
  const validation = await encryptionManager.validateLicense(licenseKey);
  if (!validation.valid) {
    return NextResponse.json(
      {
        error: 'Invalid license',
        details: validation.error,
      },
      { status: 400 },
    );
  }

  const license = validation.license;
  if (license.userId !== userId) {
    return NextResponse.json({ error: 'License does not belong to user' }, { status: 403 });
  }

  try {
    // Load encrypted model
    const encryptedModel = await encryptionManager.loadEncryptedModel(modelName);
    if (!encryptedModel) {
      return NextResponse.json({ error: 'Encrypted model not found' }, { status: 404 });
    }

    // Verify license matches
    if (encryptedModel.licenseId !== license.id) {
      return NextResponse.json({ error: 'License does not match model' }, { status: 403 });
    }

    // Decrypt the model
    const decryptedData = await encryptionManager.decryptModel(encryptedModel, license);

    // Save decrypted model if output path provided
    if (outputPath) {
      await writeFile(outputPath, decryptedData);
    }

    return NextResponse.json({
      success: true,
      modelName: encryptedModel.modelName,
      decryptedSize: decryptedData.length,
      metadata: encryptedModel.metadata,
      outputPath: outputPath || null,
    });
  } catch (error) {
    console.error('Model decryption failed:', error);
    return NextResponse.json({ error: 'Failed to decrypt model' }, { status: 500 });
  }
}

async function handleVerifyModel(
  userId: number,
  data: {
    modelName: string;
    licenseKey: string;
  },
  encryptionManager: any,
) {
  const { modelName, licenseKey } = data;

  // Validate license
  const validation = await encryptionManager.validateLicense(licenseKey);
  if (!validation.valid) {
    return NextResponse.json({
      valid: false,
      error: validation.error,
    });
  }

  const license = validation.license;
  if (license.userId !== userId) {
    return NextResponse.json({
      valid: false,
      error: 'License does not belong to user',
    });
  }

  try {
    // Load encrypted model
    const encryptedModel = await encryptionManager.loadEncryptedModel(modelName);
    if (!encryptedModel) {
      return NextResponse.json({
        valid: false,
        error: 'Encrypted model not found',
      });
    }

    // Verify license matches
    if (encryptedModel.licenseId !== license.id) {
      return NextResponse.json({
        valid: false,
        error: 'License does not match model',
      });
    }

    return NextResponse.json({
      valid: true,
      modelName: encryptedModel.modelName,
      metadata: encryptedModel.metadata,
      licenseStatus: {
        expirationDate: license.expirationDate,
        currentActivations: license.currentActivations,
        maxActivations: license.maxActivations,
        features: license.features,
      },
    });
  } catch (error) {
    console.error('Model verification failed:', error);
    return NextResponse.json({
      valid: false,
      error: 'Failed to verify model',
    });
  }
}
