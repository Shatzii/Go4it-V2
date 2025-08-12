#!/usr/bin/env node

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

(async () => {
  const ts = Date.now();
  const payload = {
    username: `user${ts}`,
    email: `user${ts}@example.com`,
    password: 'StrongPassw0rd!',
    firstName: 'Test',
    lastName: 'User'
  };

  console.log('> POST /api/auth/register');
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Set-Cookie:', res.headers.get('set-cookie'));
  try { console.log('Body:', JSON.stringify(JSON.parse(text), null, 2)); } catch { console.log('Body:', text); }

  if (!res.ok) process.exit(1);

  const cookie = res.headers.get('set-cookie')?.split(';')[0] || '';
  console.log('\n> GET /api/auth/me with cookie');
  const me = await fetch(`${BASE_URL}/api/auth/me`, { headers: { Cookie: cookie } });
  const meBody = await me.text();
  console.log('Status:', me.status);
  try { console.log('Body:', JSON.stringify(JSON.parse(meBody), null, 2)); } catch { console.log('Body:', meBody); }

  process.exit(me.ok ? 0 : 2);
})();
