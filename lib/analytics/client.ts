export async function capture(event: string, props: Record<string, any> = {}) {
  try {
    await fetch('/api/analytics/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, properties: props, timestamp: new Date().toISOString() }),
      keepalive: true,
    });
  } catch {
    // swallow errors client-side
  }
}
