// Model License Management API
// Handles license generation, validation, and activation

import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { createModelEncryptionManager } from '@/lib/model-encryption';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { action, ...data } = await request.json();
    const encryptionManager = createModelEncryptionManager();

    switch (action) {
      case 'generate':
        return await handleGenerateLicense(user.id, data, encryptionManager);
      case 'validate':
        return await handleValidateLicense(data, encryptionManager);
      case 'activate':
        return await handleActivateLicense(data, encryptionManager);
      case 'deactivate':
        return await handleDeactivateLicense(data, encryptionManager);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('License API error:', error);
    return NextResponse.json({ error: 'License operation failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const licenseId = searchParams.get('licenseId');

    const encryptionManager = createModelEncryptionManager();

    if (licenseId) {
      // Get specific license status
      const status = await encryptionManager.getLicenseStatus(licenseId);
      return NextResponse.json(status);
    } else {
      // Get all user licenses
      const licenses = await encryptionManager.getUserLicenses(user.id);
      return NextResponse.json({ licenses });
    }
  } catch (error) {
    console.error('License API error:', error);
    return NextResponse.json({ error: 'Failed to fetch licenses' }, { status: 500 });
  }
}

async function handleGenerateLicense(
  userId: number,
  data: {
    modelName: string;
    features?: string[];
    maxActivations?: number;
    validityDays?: number;
  },
  encryptionManager: any,
) {
  const { modelName, features = [], maxActivations = 1, validityDays = 365 } = data;

  // Check if user already has a license for this model
  const existingLicenses = await encryptionManager.getUserLicenses(userId);
  const existingLicense = existingLicenses.find(
    (license: any) => license.modelName === modelName && license.isActive,
  );

  if (existingLicense) {
    return NextResponse.json(
      {
        error: 'License already exists for this model',
        existingLicense: {
          id: existingLicense.id,
          licenseKey: existingLicense.licenseKey,
          expirationDate: existingLicense.expirationDate,
        },
      },
      { status: 400 },
    );
  }

  const license = await encryptionManager.generateLicense(
    userId,
    modelName,
    features,
    maxActivations,
    validityDays,
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
  });
}

async function handleValidateLicense(data: { licenseKey: string }, encryptionManager: any) {
  const { licenseKey } = data;

  if (!licenseKey) {
    return NextResponse.json({ error: 'License key is required' }, { status: 400 });
  }

  const validation = await encryptionManager.validateLicense(licenseKey);

  if (!validation.valid) {
    return NextResponse.json(
      {
        valid: false,
        error: validation.error,
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    valid: true,
    license: {
      id: validation.license.id,
      modelName: validation.license.modelName,
      expirationDate: validation.license.expirationDate,
      features: validation.license.features,
      currentActivations: validation.license.currentActivations,
      maxActivations: validation.license.maxActivations,
    },
  });
}

async function handleActivateLicense(data: { licenseId: string }, encryptionManager: any) {
  const { licenseId } = data;

  if (!licenseId) {
    return NextResponse.json({ error: 'License ID is required' }, { status: 400 });
  }

  const result = await encryptionManager.activateLicense(licenseId);

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        error: result.error,
      },
      { status: 400 },
    );
  }

  return NextResponse.json({ success: true });
}

async function handleDeactivateLicense(data: { licenseId: string }, encryptionManager: any) {
  const { licenseId } = data;

  if (!licenseId) {
    return NextResponse.json({ error: 'License ID is required' }, { status: 400 });
  }

  const result = await encryptionManager.deactivateLicense(licenseId);

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        error: result.error,
      },
      { status: 400 },
    );
  }

  return NextResponse.json({ success: true });
}
