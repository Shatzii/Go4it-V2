#!/usr/bin/env node

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

async function main() {
  // Health
  console.log('> GET /api/health');
  const h = await fetch(`${BASE_URL}/api/health`);
  const hText = await h.text();
  console.log('Status:', h.status);
  if (!h.ok) throw new Error(`Health failed: ${hText}`);

  // Register to get verifyUrl (exposed in dev/CI)
  const ts = Date.now();
  const payload = {
    username: `verify${ts}`,
    email: `verify${ts}@example.com`,
    password: 'StrongPassw0rd!',
    firstName: 'Verify',
    lastName: 'Test',
    acceptTerms: true
  };
  console.log('> POST /api/auth/register (for verify)');
  const reg = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
  });
  const regJson = await reg.json();
  if (!reg.ok) throw new Error(`Register for verify failed: ${JSON.stringify(regJson)}`);
  if (!regJson.verifyUrl) {
    console.log('verifyUrl not provided (expected in prod). Skipping verify test.');
    return;
  }
  console.log('> GET', regJson.verifyUrl);
  const v = await fetch(regJson.verifyUrl);
  console.log('Verify redirect status:', v.status);
  if (v.status >= 400) throw new Error('Verify flow failed');
}

main().catch((e) => { console.error(e.message || e); process.exit(1); });
