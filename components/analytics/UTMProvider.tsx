"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type UTM = Partial<Record<'utm_source'|'utm_medium'|'utm_campaign'|'utm_term'|'utm_content', string>>;

const Ctx = createContext<UTM>({});

function getQueryUTM(): UTM {
  if (typeof window === 'undefined') return {};
  const p = new URLSearchParams(window.location.search);
  const keys: (keyof UTM)[] = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'];
  const out: UTM = {};
  for (const k of keys) {
    const v = p.get(k as string);
    if (v) out[k] = v;
  }
  return out;
}

const COOKIE = 'g4t_utm';

function readCookie(): UTM {
  if (typeof document === 'undefined') return {};
  const m = document.cookie.match(new RegExp('(?:^|; )' + COOKIE + '=([^;]*)'));
  if (!m) return {};
  try { return JSON.parse(decodeURIComponent(m[1])); } catch { return {}; }
}

function writeCookie(val: UTM, days = 30) {
  if (typeof document === 'undefined') return;
  // Gate non-essential cookies by consent if provided
  try {
    const m = document.cookie.match(/(?:^|; )g4t_consent=([^;]+)/);
    if (m) {
      const c = JSON.parse(decodeURIComponent(m[1]));
      if (c && c.analytics === false) return; // don't set UTM without analytics consent
    }
  } catch {}
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(val))}; Path=/; Expires=${expires}; SameSite=Lax`;
}

export function UTMProvider({ children }: { children: React.ReactNode }) {
  const [utm, setUtm] = useState<UTM>({});
  useEffect(() => {
    const current = readCookie();
    const q = getQueryUTM();
    const next = { ...current, ...q };
    if (Object.keys(q).length > 0) writeCookie(next);
    setUtm(next);
    // Non-essential cookies: set only after basic page load, and only with consent
    let clickHandler: ((e: MouseEvent) => void) | undefined;
    try {
      let allowAnalytics = true;
      let allowPersonalization = true;
      const m = document.cookie.match(/(?:^|; )g4t_consent=([^;]+)/);
      if (m) {
        const c = JSON.parse(decodeURIComponent(m[1]));
        allowAnalytics = c?.analytics !== false;
        allowPersonalization = c?.personalization !== false;
      }
      // Returning visitor marker
      if (allowPersonalization && !document.cookie.includes('g4t_returning=')) {
        document.cookie = `g4t_returning=${encodeURIComponent(String(Date.now()))}; Path=/; Max-Age=${60*60*24*365}; SameSite=Lax`;
      }
      // Page view counter (kept small)
      if (allowAnalytics) {
        const pvMatch = document.cookie.match(/(?:^|; )g4t_pv=(\d+)/);
        const pv = pvMatch ? parseInt(pvMatch[1]) : 0;
        document.cookie = `g4t_pv=${pv + 1}; Path=/; Max-Age=${60*60*24*30}; SameSite=Lax`;
      }
      // Last seen timestamp
      if (allowPersonalization) {
        document.cookie = `g4t_last_seen=${encodeURIComponent(String(Date.now()))}; Path=/; Max-Age=${60*60*24*30}; SameSite=Lax`;
      }
      // Timezone and language hints
      if (allowPersonalization) {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        document.cookie = `g4t_tz=${encodeURIComponent(tz)}; Path=/; Max-Age=${60*60*24*90}; SameSite=Lax`;
        const lang = navigator.language || (navigator as any).userLanguage || 'en';
        document.cookie = `g4t_lang=${encodeURIComponent(lang)}; Path=/; Max-Age=${60*60*24*180}; SameSite=Lax`;
      }
      // Stage init if not set
      if (allowPersonalization && !document.cookie.includes('g4t_stage=')) {
        document.cookie = `g4t_stage=site_visit; Path=/; Max-Age=${60*60*24*90}; SameSite=Lax`;
      }
      // Mark ICS downloaded on click to any /api/ics link
      if (allowPersonalization) {
        clickHandler = (e: MouseEvent) => {
          const target = e.target as HTMLElement | null;
          const a = target?.closest('a');
          if (a && a.getAttribute('href')?.startsWith('/api/ics/')) {
            document.cookie = `g4t_ics=1; Path=/; Max-Age=${60*60*24*14}; SameSite=Lax`;
          }
        };
        document.addEventListener('click', clickHandler);
      }
    } catch {}

    return () => {
      if (clickHandler) document.removeEventListener('click', clickHandler);
    };
  }, []);
  const value = useMemo(() => utm, [utm]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUTM() {
  return useContext(Ctx);
}
