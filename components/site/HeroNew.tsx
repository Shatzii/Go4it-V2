import { hero } from '@/content/go4it';
import Link from 'next/link';

export function HeroNew() {
  return (
    <section 
      id="hero" 
      className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-16 md:py-24"
    >
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="container relative mx-auto">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          {/* Content */}
          <div className="space-y-6">
            {/* Main headline */}
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {hero.title}
              </span>
            </h1>

            {/* Lead paragraph */}
            <p className="text-lg leading-relaxed text-slate-300 md:text-xl">
              {hero.lead}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              {hero.ctas.map((cta) => (
                <Link
                  key={cta.id}
                  href={cta.href}
                  data-cta={cta.id}
                  className={`
                    inline-flex items-center rounded-2xl px-6 py-3 font-semibold transition-all
                    ${
                      cta.variant === 'primary'
                        ? 'border border-cyan-400 bg-cyan-400 text-slate-950 hover:bg-cyan-300'
                        : cta.variant === 'secondary'
                        ? 'border border-blue-500 bg-blue-500 text-white hover:bg-blue-600'
                        : 'border border-slate-600 bg-slate-800 text-white hover:border-slate-500 hover:bg-slate-700'
                    }
                  `}
                >
                  {cta.label}
                </Link>
              ))}
            </div>

            {/* Stats/KPIs */}
            <ul className="flex flex-wrap gap-3 pt-4">
              {hero.stats.map((stat) => (
                <li
                  key={stat}
                  data-kpi
                  className="rounded-full border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm text-slate-300"
                >
                  ✓ {stat}
                </li>
              ))}
            </ul>
          </div>

          {/* Visual placeholder */}
          <div className="relative">
            <div 
              aria-hidden="true"
              className="aspect-video rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900"
            >
              {/* Placeholder for hero image/video */}
              <div className="flex h-full items-center justify-center text-slate-500">
                <div className="text-center">
                  <div className="mb-2 text-4xl">🎓⚽🏀</div>
                  <p className="text-sm">Hero Visual</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
