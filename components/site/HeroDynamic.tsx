import { db } from "@/lib/db";
import { funnelEvents } from "@/lib/db/schema/funnel";
import { flags } from "@/lib/flags";
import { sql } from "drizzle-orm";
import { PARENT_NIGHT_COPY } from "@/content/parent-night-copy";
import { BRAND } from "@/content/brand";
import Link from "next/link";

/**
 * Dynamic Hero that shows next Parent Night session
 * Server component - queries DB for next upcoming event
 */
export default async function HeroDynamic() {
  if (!flags.NEW_HERO) {
    // Fallback to legacy hero if flag disabled
    const LegacyHero = (await import("./Hero")).default;
    return <LegacyHero />;
  }

  // Query next upcoming parent_night_info event
  let nextEvent: any = null;
  try {
    const now = new Date().toISOString();
    const results = await db
      .select()
      .from(funnelEvents)
      .where(sql`${funnelEvents.kind} = 'parent_night_info' AND ${funnelEvents.startIso} > ${now}`)
      .orderBy(sql`${funnelEvents.startIso} ASC`)
      .limit(1);
    
    nextEvent = results[0] || null;
  } catch (error) {
    // Silently fail - show hero without event details
    nextEvent = null;
  }

  const { hero } = PARENT_NIGHT_COPY;

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            {hero.headline}
          </h1>
          
          <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto">
            {hero.subheadline}
          </p>

          {nextEvent && (
            <div className="inline-block bg-blue-700 bg-opacity-50 backdrop-blur-sm rounded-lg px-4 py-2 text-sm">
              <span className="font-semibold">Next Session:</span>{" "}
              {nextEvent.region === "eu" ? "🇪🇺 Europe/Vienna" : "🇺🇸 US Central"} —{" "}
              {new Date(nextEvent.startIso).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                timeZone: nextEvent.tz,
              })}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link
              href={hero.ctaHref}
              data-cta="hero-parent-night-rsvp"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-lg bg-white text-blue-900 hover:bg-blue-50 transition-colors shadow-xl hover:shadow-2xl"
            >
              {hero.ctaLabel}
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            <a
              href={`tel:${BRAND.phoneTel.replace("tel:", "")}`}
              className="text-blue-100 hover:text-white transition-colors font-medium"
            >
              Or call {BRAND.phoneDisplay}
            </a>
          </div>

          <p className="text-xs text-blue-200 pt-4">
            {PARENT_NIGHT_COPY.compliance.micro}
          </p>
        </div>
      </div>
    </section>
  );
}
