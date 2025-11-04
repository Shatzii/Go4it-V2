import { NextResponse, type NextRequest } from 'next/server';

function days(n: number) { return n * 864e5; }
function exp(daysCount: number) { return new Date(Date.now() + days(daysCount)); }
function setCookie(res: NextResponse, name: string, value: string, opts?: { httpOnly?: boolean; maxDays?: number }) {
  try {
    res.cookies.set(name, value, {
      path: '/',
      httpOnly: opts?.httpOnly ?? true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      expires: exp(opts?.maxDays ?? 180),
    });
  } catch {}
}

// Inject compliance header for sensitive routes; layout can read and auto-inject footer
const COMPLIANCE_PATH = /^(?:\/audit|\/apply|\/ncaa|\/eligibility|\/academy)(?:\b|\/)/i;

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const res = NextResponse.next();

  if (COMPLIANCE_PATH.test(url.pathname)) {
    res.headers.set('x-go4it-requires-compliance', 'true');
  }

  // Capture marketing/partner params on first touch
  const qp = url.searchParams;
  const cookies = req.cookies;

  const ref = qp.get('ref');
  if (ref && !cookies.get('g4t_ref')) setCookie(res, 'g4t_ref', ref);

  const club = qp.get('club');
  if (club && !cookies.get('g4t_club')) setCookie(res, 'g4t_club', club);

  const aff = qp.get('aff');
  if (aff && !cookies.get('g4t_aff')) setCookie(res, 'g4t_aff', aff);

  // Region hint (if provided explicitly)
  const region = qp.get('region');
  if ((region === 'us' || region === 'eu') && !cookies.get('g4t_region')) setCookie(res, 'g4t_region', region);

  // First-touch ref chain (domain + landing path + ts), set only if not present
  if (!cookies.get('g4t_ref_chain')) {
    try {
      const referer = req.headers.get('referer') || '';
      const firstDomain = referer ? new URL(referer).hostname : '';
      const landing = url.pathname + (url.search ? url.search : '');
      const payload = JSON.stringify({ d: firstDomain, l: landing, t: Date.now() });
      // keep httpOnly for server use
      setCookie(res, 'g4t_ref_chain', payload, { httpOnly: true, maxDays: 180 });
    } catch {}
  }

  // Lightweight A/B assignment placeholder (OFFERS experiment): A or B
  if (!cookies.get('g4t_ab')) {
    const bucket = Math.random() < 0.5 ? 'offers:A' : 'offers:B';
    setCookie(res, 'g4t_ab', bucket, { httpOnly: true, maxDays: 30 });
  }

  return res;
}

export const config = {
  // Match app routes where compliance footer is required
  matcher: ['/audit/:path*', '/apply/:path*', '/ncaa/:path*', '/eligibility/:path*', '/academy/:path*'],
};
