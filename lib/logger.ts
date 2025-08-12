type Level = 'info' | 'warn' | 'error';

function log(level: Level, msg: string, meta?: Record<string, unknown>) {
  const entry = { level, msg, ts: new Date().toISOString(), ...(meta || {}) };
  const line = JSON.stringify(entry);
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

export const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => log('info', msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) => log('warn', msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => log('error', msg, meta),
};

// Helpers
export const mask = {
  email(e?: string | null) {
    if (!e) return e as any;
    const [user, domain] = String(e).split('@');
    if (!domain) return e;
    const u = user.length <= 2 ? user[0] + '*' : user[0] + '*'.repeat(Math.max(1, user.length - 2)) + user[user.length - 1];
    return `${u}@${domain}`;
  }
};
