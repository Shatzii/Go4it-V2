import { NextResponse } from 'next/server';
import { z } from 'zod';
import fs from 'node:fs/promises';
import path from 'node:path';

const Body = z.object({ country: z.string(), city: z.string(), sport: z.string(), gradYear: z.number() });

export async function POST(req: Request) {
  try {
    const body = Body.parse(await req.json());
    const slug = `${body.country}-${body.city}-${body.sport}-${body.gradYear}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const dir = path.join(process.cwd(), 'content', 'pseo');
    await fs.mkdir(dir, { recursive: true });
    const file = path.join(dir, `${slug}.mdx`);
    const fm = `---\ntitle: ${body.city} ${body.sport} NCAA Pathway ${body.gradYear}\ncity: ${body.city}\nsport: ${body.sport}\ngradYear: ${body.gradYear}\n---\n\n`;
    const jsonld = `<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'Is this NCAA compliant?', acceptedAnswer: { '@type': 'Answer', text: 'Verification ≠ recruitment. We follow NCAA amateurism and FERPA.' } },
      ],
    })}</script>`;
    await fs.writeFile(file, fm + jsonld + '\n\n# Program Overview\n\nTODO content');
    return NextResponse.json({ slug });
  } catch (e: any) {
    if (e?.name === 'ZodError') return NextResponse.json({ error: e.message }, { status: 400 });
    return NextResponse.json({ error: 'Failed to generate P-SEO page' }, { status: 500 });
  }
}
