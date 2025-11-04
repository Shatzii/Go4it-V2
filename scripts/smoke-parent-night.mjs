/* eslint-disable no-console */
// Simple smoke test for Parent Night endpoints
// Usage: npm run smoke:parent-night

const base = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:5000';

async function main() {
  const scheduleUrl = new URL('/api/parent-night/schedule', base).toString();
  const pageUrl = new URL('/parent-night', base).toString();

  console.log(`[smoke] POST ${scheduleUrl}`);
  try {
    const res = await fetch(scheduleUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    const text = await res.text();
    console.log(`[smoke] schedule status=${res.status}`);
    console.log(text.slice(0, 400));
  } catch (err) {
    console.error('[smoke] schedule request failed:', err?.message || err);
  }

  console.log(`[smoke] GET ${pageUrl}`);
  try {
    const res = await fetch(pageUrl);
    console.log(`[smoke] page status=${res.status}`);
    const html = await res.text();
    console.log(`[smoke] page length=${html.length}`);
  } catch (err) {
    console.error('[smoke] page request failed:', err?.message || err);
  }
}

main();
