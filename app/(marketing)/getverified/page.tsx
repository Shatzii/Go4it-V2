/**
 * /getverified - GetVerified™ Combine Landing Page
 * 
 * Purpose: Marketing page for athletic testing events (combines/showcases)
 * Features: Hero, session picker, pricing, FAQ, JSON-LD structured data
 * CTAs: Register → Check-in → Test → Get Results → Optional $299 Audit
 */

import { Metadata } from "next";
import { db } from "@/lib/db";
import { starpathEvents } from "@/lib/db/schema-starpath-v2";
import type { StarpathEvent } from "@/lib/db/schema-starpath-v2";
import { gte, eq } from "drizzle-orm";

// Force dynamic rendering - do not statically generate this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "GetVerified™ Combines | Go4it Sports Academy",
  description:
    "Get tested. Get verified. Get recruited. Athletic testing combines with NCAA eligibility audits.",
};

async function getUpcomingEvents(): Promise<StarpathEvent[]> {
  return db
    .select()
    .from(starpathEvents)
    .where(
      gte(starpathEvents.startsAt, new Date())
    )
    .orderBy(starpathEvents.startsAt)
    .limit(6) as Promise<StarpathEvent[]>;
}

export default async function GetVerifiedPage() {
  const events: StarpathEvent[] = await getUpcomingEvents();

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    name: "GetVerified™ Combines",
    organizer: {
      "@type": "Organization",
      name: "Go4it Sports Academy",
      url: "https://go4itsports.org",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: "99",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#0B0F14]">
        {/* Hero */}
        <section className="relative overflow-hidden py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white uppercase mb-6">
              GET<span className="text-[#00D4FF]">VERIFIED</span>™
            </h1>
            <p className="text-xl md:text-2xl text-[#E6EAF0] mb-8">
              Get tested. Get verified. Get recruited.
            </p>
            <p className="text-lg text-[#5C6678] max-w-2xl mx-auto mb-12">
              Professional athletic testing + NCAA eligibility audit. One event.
              One price. Your pathway to college sports starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#events"
                className="bg-[#00D4FF] text-[#0B0F14] px-8 py-4 rounded-lg font-bold uppercase hover:bg-[#00B8E6] transition"
              >
                Find an Event
              </a>
              <a
                href="#how-it-works"
                className="border-2 border-[#00D4FF] text-[#00D4FF] px-8 py-4 rounded-lg font-bold uppercase hover:bg-[#00D4FF] hover:text-[#0B0F14] transition"
              >
                How It Works
              </a>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 px-4 bg-[#0f1419]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center uppercase mb-12">
              How It Works
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                  {
                    step: "1",
                    title: "Register",
                    description: "Choose your city and time slot. $99 base.",
                  },
                  {
                    step: "2",
                    title: "Check In",
                    description: "Arrive 15 min early. Get your athlete ID.",
                  },
                  {
                    step: "3",
                    title: "Test",
                    description: "40yd, vertical, agility, strength. 45-60 min.",
                  },
                  {
                    step: "4",
                    title: "Results",
                    description:
                      "Instant GAR score + percentiles. Add $299 NCAA audit.",
                  },
                ].map((item: { step: string; title: string; description: string }) => (
                <div key={item.step} className="text-center">
                  <div className="w-16 h-16 bg-[#00D4FF] rounded-full flex items-center justify-center text-[#0B0F14] text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[#5C6678]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section id="events" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center uppercase mb-12">
              Upcoming Events
            </h2>
            {events.length === 0 ? (
              <p className="text-center text-[#5C6678] text-lg">
                No events scheduled yet. Check back soon!
              </p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event: StarpathEvent) => (
                  <div
                    key={event.id}
                    className="bg-[#0f1419] border border-[#1a1f26] rounded-lg p-6 hover:border-[#00D4FF] transition"
                  >
                    <h3 className="text-xl font-bold text-white mb-2">
                      {event.city}, {event.state}
                    </h3>
                    <p className="text-[#5C6678] mb-4">
                      {new Date(event.startsAt).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-[#E6EAF0] mb-4">{event.venue}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[#00D4FF] font-bold text-lg">
                        ${(event.priceBase || 9900) / 100}
                      </span>
                      <a
                        href={`/event/${event.slug}/register`}
                        className="bg-[#00D4FF] text-[#0B0F14] px-6 py-2 rounded font-bold hover:bg-[#00B8E6] transition"
                      >
                        Register
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 px-4 bg-[#0f1419]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center uppercase mb-12">
              Pricing
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#0B0F14] border-2 border-[#1a1f26] rounded-lg p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Base Testing
                </h3>
                <p className="text-4xl font-bold text-[#00D4FF] mb-6">$99</p>
                <ul className="space-y-3 text-[#E6EAF0] mb-8">
                  <li className="flex items-start">
                    <span className="text-[#27E36A] mr-2">✓</span>
                    40yd dash, vertical, pro agility
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#27E36A] mr-2">✓</span>
                    Instant GAR score + percentiles
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#27E36A] mr-2">✓</span>
                    Digital results card
                  </li>
                </ul>
                <a
                  href="#events"
                  className="block text-center bg-[#1a1f26] text-white px-6 py-3 rounded font-bold hover:bg-[#2a2f36] transition"
                >
                  Select Event
                </a>
              </div>

              <div className="bg-[#0B0F14] border-2 border-[#00D4FF] rounded-lg p-8 relative">
                <div className="absolute top-4 right-4 bg-[#00D4FF] text-[#0B0F14] px-3 py-1 rounded text-sm font-bold">
                  MOST POPULAR
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Pro Pack + NCAA Audit
                </h3>
                <p className="text-4xl font-bold text-[#00D4FF] mb-6">$398</p>
                <ul className="space-y-3 text-[#E6EAF0] mb-8">
                  <li className="flex items-start">
                    <span className="text-[#27E36A] mr-2">✓</span>
                    Everything in Base Testing
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#27E36A] mr-2">✓</span>
                    Video analysis + slow-mo replays
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#27E36A] mr-2">✓</span>
                    Full NCAA eligibility audit
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#27E36A] mr-2">✓</span>
                    Core GPA + credit breakdown
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#27E36A] mr-2">✓</span>
                    Personalized course plan
                  </li>
                </ul>
                <a
                  href="#events"
                  className="block text-center bg-[#00D4FF] text-[#0B0F14] px-6 py-3 rounded font-bold hover:bg-[#00B8E6] transition"
                >
                  Select Event
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center uppercase mb-12">
              FAQ
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "What's included in the GAR score?",
                  a: "GAR (Game Athlete Readiness) combines speed, power, agility, and mobility into a single 0-100 score with age-group percentiles.",
                },
                {
                  q: "Do I need to bring equipment?",
                  a: "Just athletic shoes and comfortable clothes. We provide all testing equipment.",
                },
                {
                  q: "How long does testing take?",
                  a: "45-60 minutes including warm-up. Arrive 15 min early for check-in.",
                },
                {
                  q: "What's the NCAA audit?",
                  a: "A $299 add-on that evaluates your transcripts against NCAA Division I & II requirements. You get your Core GPA, credit breakdown, and a personalized course plan.",
                },
                {
                  q: "Can I add the audit later?",
                  a: "Yes, but you'll save time by bundling at the event. We can pull your results into your audit report instantly.",
                },
              ].map((faq: { q: string; a: string }, i: number) => (
                <details
                  key={i}
                  className="bg-[#0f1419] border border-[#1a1f26] rounded-lg p-6"
                >
                  <summary className="text-lg font-bold text-white cursor-pointer">
                    {faq.q}
                  </summary>
                  <p className="mt-4 text-[#5C6678]">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="py-20 px-4 bg-[#00D4FF] text-[#0B0F14]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold uppercase mb-4">
              Ready to Get Verified?
            </h2>
            <p className="text-xl mb-8">
              Find an event near you and take the first step toward college
              sports.
            </p>
            <a
              href="#events"
              className="inline-block bg-[#0B0F14] text-[#00D4FF] px-8 py-4 rounded-lg font-bold uppercase hover:bg-[#1a1f26] transition"
            >
              View Events
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
