import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { clerkClient } from '@clerk/nextjs/server';
import fs from 'fs/promises';
import path from 'path';

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 30; // max requests per window per actor
const rateMap = new Map<string, { count: number; reset: number }>();

async function auditLog(entry: Record<string, any>) {
  const DATA = path.join(process.cwd(), 'data');
  const auditFile = path.join(DATA, 'role-audit.jsonl');
  try {
    await fs.mkdir(DATA, { recursive: true });
    await fs.appendFile(auditFile, JSON.stringify(entry) + '\n');
  } catch (err) {
    console.error('Failed to write audit log', err);
  }
}

function checkRate(key: string) {
  const now = Date.now();
  const r = rateMap.get(key);
  if (!r || now > r.reset) {
    rateMap.set(key, { count: 1, reset: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (r.count >= RATE_LIMIT_MAX) return false;
  r.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // only admin users may assign roles
    try {
      await requireRole('admin');
    } catch (err) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const actor = (await req.json()).actor || 'unknown';
    const rateKey = `assign-role:${actor}`;
    if (!checkRate(rateKey)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const body = await req.json();
    const { clerkUserId, role } = body;
    if (!clerkUserId || !role) {
      return NextResponse.json({ error: 'clerkUserId and role required' }, { status: 400 });
    }

    // Update Clerk user public metadata
    try {
      await clerkClient.users.updateUser(clerkUserId, { publicMetadata: { role } });
      // audit
      await auditLog({ ts: new Date().toISOString(), actor, clerkUserId, role });
    } catch (err) {
      console.error('Failed to update Clerk user:', err);
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('POST /api/admin/roles/assign error', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
