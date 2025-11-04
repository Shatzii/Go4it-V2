import { brand } from '@/lib/brand';

export type MailSignContext = {
  locale?: string;
  includeSafetyLine?: boolean;
};

/**
 * Ensure all transactional emails include compliance footer and safety line.
 * Adds a small muted block at the end of the email body.
 */
export function signEmail(html: string, ctx: MailSignContext = {}): string {
  const safety = ctx.includeSafetyLine !== false ? `<p style="margin:8px 0;color:${brand.colors.muted};font-size:12px">${brand.a11y.safetyLine}</p>` : '';
  const footer = `<p style="margin:8px 0;color:${brand.colors.muted};font-size:12px;line-height:18px">${brand.complianceFooter}</p>`;

  // If already signed, avoid duplication
  if (html.includes(brand.complianceFooter)) return html;

  // Insert before closing body if present
  if (html.includes('</body>')) {
    return html.replace('</body>', `${safety}${footer}</body>`);
  }
  return `${html}${safety}${footer}`;
}

export const BANNED_CLAIMS = [
  /guaranteed\s*scholarship/i,
  /placement\s*guaranteed/i,
  /recruitment\s*(?:guaranteed|promised)/i,
];

export function containsBannedClaims(text: string): boolean {
  return BANNED_CLAIMS.some((re) => re.test(text));
}
