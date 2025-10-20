#!/usr/bin/env node

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

async function main() {
  const ts = Date.now();
  const email = `flow${ts}@example.com`;
  const username = `flow${ts}`;
  const password = 'StrongPassw0rd!';

  // 1) Register
  console.log('> POST /api/auth/register');
  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      email,
      password,
      firstName: 'Flow',
      lastName: 'Test',
      acceptTerms: true,
    }),
  });
  const regText = await regRes.text();
  console.log('Status:', regRes.status);
  if (!regRes.ok) throw new Error(`Register failed: ${regText}`);
  const regCookie = regRes.headers.get('set-cookie')?.split(';')[0] || '';

  // 2) Me
  console.log('> GET /api/auth/me');
  const meRes = await fetch(`${BASE_URL}/api/auth/me`, { headers: { Cookie: regCookie } });
  const meText = await meRes.text();
  console.log('Status:', meRes.status);
  if (!meRes.ok) throw new Error(`Me failed: ${meText}`);

  // 3) Logout
  console.log('> POST /api/auth/logout');
  const outRes = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: 'POST',
    headers: { Cookie: regCookie },
  });
  console.log('Status:', outRes.status);
  if (!outRes.ok) throw new Error('Logout failed');

  // 4) Login
  console.log('> POST /api/auth/login');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const loginText = await loginRes.text();
  console.log('Status:', loginRes.status);
  if (!loginRes.ok) throw new Error(`Login failed: ${loginText}`);
  const loginCookie = loginRes.headers.get('set-cookie')?.split(';')[0] || '';

  // 5) Me again
  console.log('> GET /api/auth/me (after login)');
  const me2Res = await fetch(`${BASE_URL}/api/auth/me`, { headers: { Cookie: loginCookie } });
  const me2Text = await me2Res.text();
  console.log('Status:', me2Res.status);
  if (!me2Res.ok) throw new Error(`Me after login failed: ${me2Text}`);

  console.log('Auth flow OK');
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
