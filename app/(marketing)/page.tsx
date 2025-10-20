import Image from "next/image";
import Script from "next/script";
import { Metadata } from "next";
import * as Dialog from "@radix-ui/react-dialog";
import * as Toggle from "@radix-ui/react-toggle";
import { LeadForm } from "@/components/marketing/LeadForm";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Go4It Sports — AI Coaching, NCAA Recruiting, GAR Verified",
  description:
    "AI-powered platform for neurodivergent student-athletes. Video analysis, academic balance, and NCAA-compliant recruiting. Get Verified Free.",
  alternates: { canonical: "https://www.go4itsports.org/" },
  openGraph: {
    title: "Go4It Sports — AI Coaching, NCAA Recruiting, GAR Verified",
    description:
      "AI-powered athletic development for neurodivergent student-athletes—video analysis, academic balance, and NCAA-compliant recruiting in one platform.",
    url: "https://www.go4itsports.org/",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Go4It Sports — AI Coaching, NCAA Recruiting, GAR Verified",
    description:
      "AI-powered athletic development for neurodivergent student-athletes.",
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
  themeColor: "#0F172A",
};

export const runtime = "edge";

export default function Page({
  searchParams,
}: { searchParams: { v?: string } }) {
  const variant = (searchParams?.v === "b") ? "b" : "a";
  const hero = variant === "a"
    ? { 
        h1: "Get Verified. Get Noticed. Get Recruited.", 
        primary: "btn-primary", 
        secondary: "btn-secondary" 
      }
    : { 
        h1: "Your Video. Our AI. Recruiter Results.", 
        primary: "px-5 py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-500", 
        secondary: "btn-primary" 
      };
  return (
    <main className="bg-slate-950 text-white">
      {/* Sticky mobile CTA */}
      <div className="fixed bottom-3 inset-x-3 z-40 md:hidden">
        <button
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-400 font-semibold"
          onClick={() =>
            document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" })
          }
          data-analytics="cta_click"
          data-label="Get Verified Free (Mobile)"
        >
          Get Verified Free
        </button>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur bg-slate-950/70 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2" aria-label="Go4It Sports Home">
            <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" className="text-lime-300">
              <path fill="currentColor" d="M12 2l8 4v6c0 5.523-4.477 10-10 10H4V6l8-4z"/>
            </svg>
            <span className="text-xl font-bold">Go4It Sports</span>
          </a>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#features" className="hover:text-lime-300">Features</a>
            <a href="#events" className="hover:text-lime-300">Events</a>
            <a href="#pricing" className="hover:text-lime-300">Pricing</a>
            <a href="#faq" className="hover:text-lime-300">FAQ</a>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <FocusToggle />
            <a
              href="#signup"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold"
              data-analytics="cta_click"
              data-label="Get Verified Free (Header)"
            >
              Get Verified Free
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              {hero.h1}
            </h1>
            <p className="mt-4 text-lg text-slate-300">
              AI-powered athletic development for neurodivergent student-athletes—video analysis, academic balance,
              and NCAA-compliant recruiting in one platform.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#signup"
                className={hero.primary}
                data-analytics="cta_click"
                data-label="Get Verified Free (Hero)"
              >
                Get Verified Free
              </a>
              <a href="#pricing" className={hero.secondary}>Enroll Now</a>
              <a href="#signup" className="px-5 py-3 rounded-xl border border-slate-700 hover:border-slate-500">Book a Recruiter Report</a>
            </div>
            <ul className="mt-6 grid sm:grid-cols-2 gap-3 text-sm text-slate-300">
              <li className="flex gap-2 items-start"><span className="text-lime-300">✓</span> Instant GAR scoring (&lt;2 min)</li>
              <li className="flex gap-2 items-start"><span className="text-lime-300">✓</span> 40% higher recruiter responses, 91% lower outreach costs</li>
              <li className="flex gap-2 items-start"><span className="text-lime-300">✓</span> ADHD-friendly Focus Mode</li>
              <li className="flex gap-2 items-start"><span className="text-lime-300">✓</span> NCAA eligibility tracking built-in</li>
            </ul>
            <div className="mt-6 text-slate-400 text-sm">FERPA • COPPA • GDPR • WCAG 2.1 AA • Edge AI</div>
          </div>
          <figure className="relative">
            <div className="aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <svg className="w-24 h-24 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <p className="text-lg font-medium">AI-Powered Analysis</p>
                <p className="text-sm">Upload athlete video for instant GAR scoring</p>
              </div>
            </div>
            <figcaption className="sr-only">Go4It Sports mobile AI video analysis.</figcaption>
          </figure>
        </div>
      </section>

      {/* Value Grid */}
      <section id="features" className="py-14 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">One Platform. Three Audiences. Zero Compromise.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card title="For Athletes" body="Real-time feedback. StarPath progression. Leaderboards. Highlight reels." />
            <Card title="For Parents" body="Progress dashboards. Tutoring sync. Scholarship planning. Safety & privacy." />
            <Card title="For Coaches" body="Team tools. Benchmarks. AI playbooks. Tournament & event management." />
          </div>
        </div>
      </section>

      {/* GAR + AI */}
      <section className="py-14 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-bold">GAR Analysis. Verified Performance. Actionable Gains.</h2>
            <p className="mt-3 text-slate-300">
              GAR (Growth & Ability Rating) analyzes technique, biomechanics, speed, and risk to produce a verified score and an actionable plan.
              Multi‑angle video. Edge AI. Less than 2 minutes.
            </p>
            <ul className="mt-4 space-y-2 text-slate-300 list-disc pl-4">
              <li>Biomechanics strengths & weaknesses</li>
              <li>Injury risk indicators</li>
              <li>Peer & benchmark comparisons</li>
              <li>Recruiter-ready reports</li>
            </ul>
            <DemoBox />
          </div>
          <div className="grid gap-4">
            <Card title="AI Personal Coach" body="Progressive plans. Voice tips. 24/7 guidance." />
            <Card title="AI Football Coach" body="Tactical analysis. Playbook creator. Position-specific coaching." />
            <Card title="Recruitment Assistant" body="College matching. Smart outreach. Forecasting for opportunities." />
          </div>
        </div>
      </section>

      {/* Neurodivergent + Academic */}
      <section className="py-14 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-bold">Designed For Every Brain.</h2>
            <p className="mt-3 text-slate-300">Clear visuals. Predictable layouts. Focus Mode. Reduced motion. Built to help neurodivergent athletes thrive.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <ReadableToggle />
              <MotionToggle />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold">Academics + Athletics. Balanced.</h2>
            <p className="mt-3 text-slate-300">K–12 course sync, live classes, AI learning companions, NCAA eligibility tracking, and a Gap Year Program ($999.95/mo).</p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-14 border-t border-slate-800 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Stats />
          <Testimonials />
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-14 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Pricing That Scales With Your Goals.</h2>
          <p className="mt-2 text-slate-300">Start Free. Upgrade when you see the gains.</p>
          <Pricing />
        </div>
      </section>

      {/* Events */}
      <section id="events" className="py-14 border-t border-slate-800 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-bold">Events & Programs</h2>
            <a
              href="#signup"
              className="hidden sm:inline-block px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500"
              data-analytics="cta_click"
              data-label="See Calendar"
            >
              See Calendar
            </a>
          </div>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <Card title="Friday Night Lights" body="Live streaming • Analytics during play • Recruiter visibility" />
            <Card title="Combines" body="Verified metrics • GAR reporting • Highlight reel generation" />
            <Card title="Camps & Private Coaching" body="Position-specific coaching • D1 prep • Gap Year Program" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-14 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            {FAQ.map((q) => (
              <details key={q.q} className="p-5 rounded-xl border border-slate-800 bg-slate-900/30">
                <summary className="font-semibold cursor-pointer">{q.q}</summary>
                <p className="mt-2 text-slate-300">{q.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Signup */}
      <section id="signup" className="py-14 border-t border-slate-800 bg-slate-900/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Join Go4It Sports</h2>
          <p className="mt-2 text-slate-300">Takes 45 seconds. No spam. Cancel anytime.</p>
          <LeadForm variant={variant} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-6 text-sm">
          <div>
            <p className="font-semibold">Go4It Sports</p>
            <p className="text-slate-400 mt-2">Be seen. Get recruited.</p>
          </div>
          <nav className="space-y-2">
            <p className="font-semibold">Company</p>
            <a className="block text-slate-300 hover:text-white" href="/about">About</a>
            <a className="block text-slate-300 hover:text-white" href="/contact">Contact</a>
          </nav>
          <nav className="space-y-2">
            <p className="font-semibold">Legal</p>
            <a className="block text-slate-300 hover:text-white" href="/privacy">Privacy</a>
            <a className="block text-slate-300 hover:text-white" href="/terms">Terms</a>
            <a className="block text-slate-300 hover:text-white" href="/ncaa">NCAA Compliance</a>
            <a className="block text-slate-300 hover:text-white" href="/accessibility">Accessibility</a>
          </nav>
          <div>
            <p className="font-semibold">Compliance</p>
            <p className="text-slate-400 mt-2">FERPA • COPPA • GDPR • WCAG 2.1 AA</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 text-slate-500 text-xs">
          © {new Date().getFullYear()} Go4It Sports. All rights reserved.
        </div>
      </footer>

      {/* Exit Intent (Radix Dialog) */}
      <ExitIntentDialog />

      {/* JSON-LD scripts */}
      <StructuredData />
    </main>
  );
}

/* ---------------- Components ---------------- */

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-slate-300 mt-1">{body}</p>
    </div>
  );
}

function DemoBox() {
  return (
    <div className="mt-6 p-4 rounded-xl border border-slate-800 bg-slate-900/50">
      <label className="block text-sm font-medium mb-2" htmlFor="demoUpload">Try the demo (mock)</label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input id="demoUpload" type="file" className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-semibold bg-slate-800/60 rounded-lg" />
        <button
          className="px-4 py-2 rounded-lg bg-lime-300 text-slate-950 font-semibold hover:bg-lime-200"
          onClick={() => {
            const node = document.getElementById("demoResult");
            node?.classList.remove("hidden");
            // @ts-ignore
            window.toast?.("Demo complete: GAR 8.6 with 3 recommended drills.");
            // @ts-ignore
            window.track?.("demo_analysis");
          }}
        >
          Analyze Video
        </button>
      </div>
      <div id="demoResult" className="mt-4 hidden">
        <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700">
          <div className="flex items-center justify-between">
            <p className="font-semibold">GAR Score</p>
            <p className="text-2xl font-extrabold text-lime-300">8.6 / 10</p>
          </div>
          <p className="mt-2 text-slate-300"><strong>Strengths:</strong> Acceleration burst, hip mobility</p>
          <p className="text-slate-300"><strong>Next Drills:</strong> Lateral shuffle series, resisted starts, crossover repeats</p>
        </div>
      </div>
    </div>
  );
}

function FocusToggle() {
  return (
    <Toggle.Root
      className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm"
      aria-label="Toggle Focus Mode"
      onPressedChange={(pressed) => {
        document.body.classList.toggle("focus-mode", pressed);
        // @ts-ignore
        window.track?.("toggle_focus_mode", { on: pressed });
      }}
    >
      Focus Mode
    </Toggle.Root>
  );
}

function ReadableToggle() {
  return (
    <Toggle.Root
      className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm"
      aria-label="Toggle Readable Font"
      onPressedChange={(pressed) => {
        document.body.classList.toggle("readable", pressed);
        // @ts-ignore
        window.track?.("toggle_readable_font", { on: pressed });
      }}
    >
      Readable Font
    </Toggle.Root>
  );
}

function MotionToggle() {
  return (
    <Toggle.Root
      className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm"
      aria-label="Toggle Motion"
      onPressedChange={(pressed) => {
        document.body.classList.toggle("reduce-motion", pressed);
        // @ts-ignore
        window.track?.("toggle_motion", { on: pressed });
      }}
    >
      Motion Off
    </Toggle.Root>
  );
}

function Stats() {
  const items = [
    ["2,847+", "Videos analyzed"],
    ["94.2%", "Prediction accuracy"],
    ["8,249+", "Athletes improved"],
    ["<200ms", "AI response"],
    ["54", "D1 scholarships"],
    ["$4.2M", "Scholarship value"],
  ];
  return (
    <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
      {items.map(([n, l]) => (
        <div key={l}><p className="text-3xl font-extrabold">{n}</p><p className="text-slate-300 text-sm">{l}</p></div>
      ))}
    </div>
  );
}

function Testimonials() {
  return (
    <div className="mt-10 grid md:grid-cols-3 gap-6">
      {[
        ["GAR showed exactly what recruiters needed. I PR'd in 3 weeks.", "Athlete, WR '26"],
        ["The parent dashboard made progress crystal clear. Worth it.", "Parent of RB '27"],
        ["Team tools + playbook creator saved us hours every week.", "HS Coach"],
      ].map(([quote, who]) => (
        <blockquote key={who} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
          <p>{quote}</p>
          <footer className="mt-2 text-sm text-slate-400">— {who}</footer>
        </blockquote>
      ))}
    </div>
  );
}

function Pricing() {
  const plans = [
    { name: "Freemium", price: "$0", desc: "Basic analysis • Community", cta: "Start Free", highlight: false },
    { name: "Starter", price: "$19/mo", desc: "GAR + AI Coach", cta: "Choose Starter", highlight: false },
    { name: "Pro", price: "$49/mo", desc: "Recruiting + Reports", cta: "Go Pro", highlight: true },
    { name: "Elite", price: "$99/mo", desc: "Team Tools + Events", cta: "Choose Elite", highlight: false },
  ];
  return (
    <div className="mt-8 grid lg:grid-cols-4 gap-6">
      {plans.map((p) => (
        <div key={p.name} className={cn(
          "p-6 rounded-2xl border bg-slate-900/40",
          p.highlight ? "border-lime-300/40" : "border-slate-800"
        )}>
          <h3 className="font-semibold">{p.name}</h3>
          <p className="text-sm text-slate-300">{p.desc}</p>
          <p className="mt-4 text-3xl font-extrabold">{p.price}</p>
          <a href="#signup" className={cn(
            "mt-4 inline-block px-4 py-2 rounded-lg",
            p.highlight ? "bg-lime-300 text-slate-950 font-semibold hover:bg-lime-200" : "bg-slate-800 hover:bg-slate-700"
          )} data-analytics="cta_click" data-label={p.name}>{p.cta}</a>
        </div>
      ))}
    </div>
  );
}

function ExitIntentDialog() {
  return (
    <Dialog.Root>
      <ExitIntentScript />
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 hidden items-center justify-center bg-black/70 p-4 data-[state=open]:flex" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 hidden w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-700 bg-slate-900 p-6 data-[state=open]:block">
          <Dialog.Title className="text-xl font-bold">Before you go—grab the free checklist</Dialog.Title>
          <Dialog.Description className="mt-2 text-slate-300">
            "Recruiter Report Checklist (PDF)" to boost your response rate by 40%.
          </Dialog.Description>
          <div className="mt-4 flex gap-3">
            <button className="px-4 py-2 rounded-lg bg-lime-300 text-slate-950 font-semibold hover:bg-lime-200" onClick={() => {
              // @ts-ignore
              window.downloadChecklist?.();
              (document.getElementById("exit-intent-close") as HTMLButtonElement)?.click();
            }}>
              Get the PDF
            </button>
            <Dialog.Close asChild>
              <button id="exit-intent-close" className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700">No thanks</button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ExitIntentScript() {
  return (
    <Script id="exit-intent-handler" strategy="afterInteractive">{`
      (function(){
        let shown=false;
        document.addEventListener('mouseout',function(e){
          if(shown) return;
          if(e.clientY<=0){
            shown=true;
            const overlay=document.querySelector('[data-radix-dialog-overlay]');
            const content=document.querySelector('[data-radix-dialog-content]');
            overlay && overlay.setAttribute('data-state','open');
            content && content.setAttribute('data-state','open');
            window.dispatchEvent(new CustomEvent('analytics',{detail:{event:'exit_intent'}}));
          }
        });
      })();
    `}</Script>
  );
}

function StructuredData() {
  return (
    <>
      {/* Organization */}
      <Script id="sd-org" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context":"https://schema.org","@type":"Organization","name":"Go4It Sports","url":"https://www.go4itsports.org/","logo":"https://www.go4itsports.org/logo.png","sameAs":["https://www.instagram.com/go4itsports","https://twitter.com/go4itsports","https://www.youtube.com/@go4itsports"]
      })}} />
      {/* SoftwareApplication */}
      <Script id="sd-app" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context":"https://schema.org","@type":"SoftwareApplication","name":"Go4It Sports Platform","applicationCategory":"SportsApplication","operatingSystem":"Web, iOS, Android","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"featureList":["AI video analysis (GAR score)","NCAA-compliant recruiting","Academic balance tools","Neurodivergent support","Edge AI mobile processing","Team and tournament management"]
      })}} />
      {/* Event */}
      <Script id="sd-event" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context":"https://schema.org","@type":"SportsEvent","name":"Friday Night Lights Combine","startDate":"2025-09-19T18:00","endDate":"2025-09-19T21:00","location":{"@type":"Place","name":"Go4It Sports Complex","address":"1234 Victory Way, Austin, TX"},"organizer":{"@type":"Organization","name":"Go4It Sports"},"url":"https://www.go4itsports.org/events"
      })}} />
      {/* FAQ */}
      <Script id="sd-faq" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context":"https://schema.org","@type":"FAQPage","mainEntity":[
          {"@type":"Question","name":"How does video analysis work?","acceptedAnswer":{"@type":"Answer","text":"Upload from your phone. We score movement, compare benchmarks, and deliver drills—typically in under two minutes."}},
          {"@type":"Question","name":"Is this NCAA compliant?","acceptedAnswer":{"@type":"Answer","text":"Yes—tracking, communications, and reporting adhere to NCAA guidelines."}},
          {"@type":"Question","name":"How do you support ADHD and neurodivergent athletes?","acceptedAnswer":{"@type":"Answer","text":"Focus Mode, chunked tasks, clear visual feedback, and reduced motion options across all tools."}},
          {"@type":"Question","name":"Which video formats are accepted?","acceptedAnswer":{"@type":"Answer","text":"MP4, MOV, and links from YouTube or Google Drive."}},
          {"@type":"Question","name":"Can parents track progress?","acceptedAnswer":{"@type":"Answer","text":"Yes—parents see academics and athletics together with alerts and milestones."}}
        ]
      })}} />
      {/* Breadcrumbs */}
      <Script id="sd-bc" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
          {"@type":"ListItem","position":1,"name":"Home","item":"https://www.go4itsports.org/"},
          {"@type":"ListItem","position":2,"name":"Features","item":"https://www.go4itsports.org/#features"},
          {"@type":"ListItem","position":3,"name":"Pricing","item":"https://www.go4itsports.org/#pricing"}
        ]
      })}} />
      {/* Helpers */}
      <Script id="helpers" strategy="afterInteractive">{`
        window.toast = function(msg){
          console.log('[toast]', msg);
          alert(msg);
        }
        window.track = function(event, params){
          console.log('[analytics]', event, params || {});
        }
        window.downloadChecklist = function(){
          const blob = new Blob(['Recruiter Report Checklist\\n\\n1) Verified GAR\\n2) Key metrics\\n3) Academic status\\n4) Contact details\\n5) Highlight links'],{type:'text/plain'});
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'Recruiter-Report-Checklist.txt';
          a.click();
          window.track('download_checklist');
        }
      `}</Script>
    </>
  );
}

/* --------------- Data --------------- */
const FAQ = [
  { q: "How does video analysis work?", a: "Upload from your phone. We score movement, compare benchmarks, and deliver drills—typically in under two minutes." },
  { q: "Is this NCAA compliant?", a: "Yes—tracking, communications, and reporting adhere to NCAA guidelines." },
  { q: "How do you support ADHD and neurodivergent athletes?", a: "Focus Mode, chunked tasks, clear feedback loops, and reduced motion options across the platform." },
  { q: "Which video formats are accepted?", a: "MP4, MOV, and links from YouTube or Google Drive." },
  { q: "Can parents track progress?", a: "Yes—parents see academics + athletics in one dashboard." },
  { q: "Refunds for events?", a: "Full refund 7+ days prior; credits otherwise (policy placeholder)." },
];