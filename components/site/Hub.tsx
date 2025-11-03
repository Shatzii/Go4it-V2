import { hub } from '@/content/go4it';
import Link from 'next/link';
import { Shield, BookOpen, Trophy } from 'lucide-react';

const iconMap = {
  shield: Shield,
  book: BookOpen,
  trophy: Trophy,
} as const;

export function Hub() {
  return (
    <section 
      id="hub" 
      className="bg-gradient-to-b from-slate-900 to-slate-950 px-4 py-16 md:py-24"
    >
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {hub.title}
            </span>
          </h2>
          <p className="text-lg text-slate-400">
            {hub.subtitle}
          </p>
        </div>

        {/* Columns */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {hub.columns.map((col) => {
            const Icon = iconMap[col.icon];
            
            return (
              <article
                key={col.title}
                className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6 transition-all hover:border-slate-600 hover:bg-slate-800"
              >
                {/* Icon & Title */}
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-cyan-400/10 p-2">
                    <Icon className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {col.title}
                  </h3>
                </div>

                {/* Bullets */}
                <ul className="space-y-2">
                  {col.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2 text-sm text-slate-300"
                    >
                      <span className="mt-0.5 text-cyan-400">✓</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-3">
          {hub.ctas.map((cta) => (
            <Link
              key={cta.id}
              href={cta.href}
              data-cta={cta.id}
              className={`
                inline-flex items-center rounded-2xl px-6 py-3 font-semibold transition-all
                ${
                  cta.variant === 'primary'
                    ? 'border border-cyan-400 bg-cyan-400 text-slate-950 hover:bg-cyan-300'
                    : 'border border-slate-600 bg-slate-800 text-white hover:border-slate-500 hover:bg-slate-700'
                }
              `}
            >
              {cta.label}
            </Link>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-center text-xs text-slate-500">
          {hub.note}
        </p>
      </div>
    </section>
  );
}
