// Demo License Generation for Testing
// Creates sample licenses for demonstration purposes

import { NextRequest, NextResponse } from 'next/server';
import { createModelEncryptionManager } from '@/lib/model-encryption';

export const dynamic = 'force-dynamic';
export async function POST(request: NextRequest) {
  try {
    const { modelName } = await request.json();

    if (!modelName) {
      return NextResponse.json({ error: 'Model name is required' }, { status: 400 });
    }

    const encryptionManager = createModelEncryptionManager();

    // Generate a demo license for testing
    const license = await encryptionManager.generateLicense(
      1, // Demo user ID
      modelName,
      ['offline_use', 'commercial_use', 'demo_license'],
      3, // Allow 3 activations for demo
      30, // 30 days validity
    );

    return NextResponse.json({
      success: true,
      license: {
        id: license.id,
        licenseKey: license.licenseKey,
        modelName: license.modelName,
        expirationDate: license.expirationDate,
        maxActivations: license.maxActivations,
        features: license.features,
      },
      message: 'Demo license generated successfully',
    });
  } catch (error) {
    console.error('Demo license generation failed:', error);
    return NextResponse.json({ error: 'Failed to generate demo license' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const modelName = searchParams.get('modelName');

    if (!modelName) {
      return NextResponse.json({ error: 'Model name is required' }, { status: 400 });
    }

    const encryptionManager = createModelEncryptionManager();

    // Get all licenses for demo user
    const licenses = await encryptionManager.getUserLicenses(1);
    const modelLicense = licenses.find((license) => license.modelName === modelName);

    if (!modelLicense) {
      return NextResponse.json({ error: 'No demo license found for this model' }, { status: 404 });
    }

    return NextResponse.json({
      license: {
        id: modelLicense.id,
        licenseKey: modelLicense.licenseKey,
        modelName: modelLicense.modelName,
        expirationDate: modelLicense.expirationDate,
        maxActivations: modelLicense.maxActivations,
        currentActivations: modelLicense.currentActivations,
        features: modelLicense.features,
        isActive: modelLicense.isActive,
      },
    });
  } catch (error) {
    console.error('Demo license retrieval failed:', error);
    return NextResponse.json({ error: 'Failed to retrieve demo license' }, { status: 500 });
  }
}
