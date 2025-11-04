
const N8N_BASE_URL = process.env.N8N_BASE_URL;

function assertEnv() {
  if (!N8N_BASE_URL) {
    throw new Error('N8N_BASE_URL is not configured');
  }
}

export async function postAttendance(payload: Record<string, any>): Promise<void> {
  assertEnv();
  const base = (N8N_BASE_URL as string).replace(/\/$/, '');
  const url = `${base}/webhook/attendance-webhook`;
  const idem = createAttendanceIdemKey(payload);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idem },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`n8n attendance webhook failed: ${res.status} ${text}`);
  }
}

export async function postHotLead(payload: { leadId: number; score: number; reason?: string }): Promise<void> {
  assertEnv();
  const base = (N8N_BASE_URL as string).replace(/\/$/, '');
  const url = `${base}/webhook/hot-lead`;
  const idem = `lead:${payload.leadId}:score:${payload.score}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idem },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`n8n hot-lead webhook failed: ${res.status} ${text}`);
  }
}

function createAttendanceIdemKey(p: Record<string, any>): string {
  const lead = p.leadId ?? p.email ?? 'unknown';
  const kind = p.eventKind ?? 'unknown';
  const ev = p.eventId ?? p.eventStartIso ?? '';
  return `attendance:${lead}:${kind}:${ev}`;
}
