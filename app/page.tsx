"use client";

import { useEffect } from "react";
import Link from "next/link";
import Script from "next/script";

export default function LandingPage() {
  useEffect(() => {
    // Scripts will be loaded via Script component
  }, []);

  return (
    <>
      {/* Load external stylesheets */}
      <link rel="stylesheet" href="/landing-page.css" />
      <link rel="stylesheet" href="/chat-widget.css" />

      {/* Structured Data */}
      <Script id="structured-data-org" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SportsOrganization",
          "name": "Go4it Sports Academy",
          "description": "Online + hybrid school for elite student-athletes with NCAA Pathway support and GAR™ verification",
          "url": "https://go4itsports.org",
          "logo": "https://go4itsports.org/logo.png",
          "email": "info@go4itsports.org",
          "telephone": "+1-205-434-8405",
          "slogan": "Train Here. Place Anywhere.",
          "address": [
            { "@type": "PostalAddress", "addressLocality": "Denver", "addressCountry": "US" },
            { "@type": "PostalAddress", "addressLocality": "Vienna", "addressCountry": "AT" },
            { "@type": "PostalAddress", "addressLocality": "Dallas", "addressCountry": "US" },
            { "@type": "PostalAddress", "addressLocality": "Mérida", "addressCountry": "MX" }
          ]
        })}
      </Script>

      {/* TOPBAR */}
      <div id="topbar" className="topbar" role="banner">
        <div className="container">
          <p>Denver • Vienna • Dallas • Mérida (MX) | <a href="mailto:invest@go4itsports.org">invest@go4itsports.org</a> | <a href="tel:+12054344005">+1-205-434-4005</a></p>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav id="nav" className="nav" role="navigation" aria-label="Main navigation">
        <div className="container">
          <div className="nav__brand">
            <Link href="/">
              <strong>Go4it Sports Academy</strong>
            </Link>
          </div>
          <ul className="nav__menu">
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/academy">Academy</Link></li>
            <li><Link href="/events">Events</Link></li>
            <li><Link href="/starpath">StarPath</Link></li>
            <li><Link href="/athleteai">AthleteAI</Link></li>
            <li><Link href="/recruiting-hub">Recruiting</Link></li>
            <li><Link href="/automation/dashboard">Automation</Link></li>
            <li><Link href="/audit" className="btn btn--primary" data-cta="nav-audit">48hr Audit</Link></li>
            <li><Link href="/apply" className="btn btn--primary" data-cta="nav-apply">Apply</Link></li>
          </ul>
        </div>
      </nav>

      {/* HERO */}
      <header id="hero" className="hero section--dark" data-scroll="fade-in">
        <div className="container">
          <h1>Your All-in-One Platform to Play at the Next Level</h1>
          <p className="lead">Go4it Sports Academy: Online School + AI Coaching + NCAA Tracker + Get Verified Combines. Everything elite student-athletes need in one place.</p>
          
          {/* Live GAR Leaderboard Ticker */}
          <div className="gar-ticker" aria-label="Top GAR Athletes">
            <div className="gar-ticker__track">
              <div className="gar-ticker__item">
                <span className="flag">🇺🇸</span> Marcus J. <span className="score">GAR 97</span> ⭐⭐⭐⭐⭐ Basketball
              </div>
              <div className="gar-ticker__item">
                <span className="flag">🇩🇪</span> Lena K. <span className="score">GAR 94</span> ⭐⭐⭐⭐⭐ Soccer
              </div>
              <div className="gar-ticker__item">
                <span className="flag">🇲🇽</span> Diego R. <span className="score">GAR 92</span> ⭐⭐⭐⭐ Football
              </div>
              <div className="gar-ticker__item">
                <span className="flag">🇪🇸</span> Sofia M. <span className="score">GAR 90</span> ⭐⭐⭐⭐ Volleyball
              </div>
              <div className="gar-ticker__item">
                <span className="flag">🇨🇦</span> Alex T. <span className="score">GAR 89</span> ⭐⭐⭐⭐ Basketball
              </div>
              <div className="gar-ticker__item">
                <span className="flag">🇫🇷</span> Emma D. <span className="score">GAR 88</span> ⭐⭐⭐⭐ Soccer
              </div>
              <div className="gar-ticker__item">
                <span className="flag">🇧🇷</span> Lucas S. <span className="score">GAR 87</span> ⭐⭐⭐⭐ Football
              </div>
              <div className="gar-ticker__item">
                <span className="flag">🇬🇧</span> Olivia W. <span className="score">GAR 86</span> ⭐⭐⭐⭐ Volleyball
              </div>
            </div>
          </div>

          <div className="hero__cta-group" role="group" aria-label="Primary actions">
            <a href="#pathways" className="btn btn--primary" data-cta="hero-pathways" data-kpi="conversion">Choose Your Path</a>
            <a href="#gar-top100" className="btn btn--secondary" data-cta="hero-athletes">Browse Verified Athletes</a>
          </div>

          <div className="hero__proof stack" data-scroll="slide-up">
            <div className="stat">
              <span className="badge badge--green">GAR™ Verified Athletes</span>
            </div>
            <div className="stat">
              <strong>NCAA Pathway + AI Coaching</strong>
            </div>
            <div className="stat">
              <strong>Online School Available</strong>
            </div>
          </div>
        </div>
      </header>

      {/* THREE PATHWAYS */}
      <section id="pathways" className="pathways section--accent">
        <div className="container">
          <h2>Three Ways to Go4it</h2>
          <p className="lead">Choose the path that fits your goals—or combine all three for maximum impact.</p>
          
          <div className="pathway-grid">
            {/* Student Path */}
            <div className="pathway-card" data-scroll="fade-in">
              <div className="pathway-card__icon">🎓</div>
              <h3>Full Academy Student</h3>
              <p className="pathway-card__tagline">Online + Hybrid School for Elite Athletes</p>
              <ul className="pathway-card__features">
                <li>✓ American-taught online courses</li>
                <li>✓ NCAA core-course alignment</li>
                <li>✓ Study Hall & academic coaching</li>
                <li>✓ GAR™ testing included</li>
                <li>✓ AthleteAI platform access</li>
                <li>✓ International training blocks</li>
              </ul>
              <p className="pathway-card__cta">
                <Link href="/apply" className="btn btn--primary" data-cta="pathway-student">Apply Now</Link>
              </p>
              <p className="microcopy">Full-time enrollment with NCAA Pathway support</p>
            </div>

            {/* AI Coach Path */}
            <div className="pathway-card pathway-card--featured" data-scroll="fade-in">
              <div className="pathway-card__badge">MOST POPULAR</div>
              <div className="pathway-card__icon">🤖</div>
              <h3>AthleteAI Coach</h3>
              <p className="pathway-card__tagline">AI-Powered Training + NCAA Tracker</p>
              <ul className="pathway-card__features">
                <li>✓ 24/7 AI coaching chatbot</li>
                <li>✓ Personalized training plans</li>
                <li>✓ Performance tracking & analytics</li>
                <li>✓ NCAA eligibility dashboard</li>
                <li>✓ GPA & credit monitoring</li>
                <li>✓ No school enrollment required</li>
              </ul>
              <p className="pathway-card__cta">
                <Link href="/athleteai" className="btn btn--primary" data-cta="pathway-ai">Try Free</Link>
              </p>
              <p className="microcopy">Perfect for athletes at any school</p>
            </div>

            {/* Get Verified Path */}
            <div className="pathway-card" data-scroll="fade-in">
              <div className="pathway-card__icon">⭐</div>
              <h3>Get Verified Athlete</h3>
              <p className="pathway-card__tagline">GAR™ Testing + NCAA Audit</p>
              <ul className="pathway-card__features">
                <li>✓ Official GAR™ combine testing</li>
                <li>✓ Verified athletic profile</li>
                <li>✓ 48-hour NCAA credit audit</li>
                <li>✓ Core-course gap analysis</li>
                <li>✓ Coach-ready film & metrics</li>
                <li>✓ Top 100 leaderboard ranking</li>
              </ul>
              <p className="pathway-card__cta">
                <Link href="/events" className="btn btn--primary" data-cta="pathway-verified">Book Testing</Link>
              </p>
              <p className="microcopy">Get discovered by college coaches</p>
            </div>
          </div>

          <div className="pathways__compare">
            <p><strong>Not sure which path?</strong> <a href="#compare">Compare all options →</a></p>
          </div>
        </div>
      </section>

      {/* GAR TOP 100 */}
      <section id="gar-top100" className="gar-top100 section--dark">
        <div className="container">
          <h2 className="neon-text">GAR Top 100</h2>
          <p className="lead">The highest verified athlete scores worldwide</p>
          
          {/* Filters */}
          <div className="gar-filters">
            <div className="filter-group">
              <label htmlFor="filter-sport">Sport:</label>
              <select id="filter-sport" className="filter-select">
                <option value="all">All Sports</option>
                <option value="basketball">Basketball</option>
                <option value="football">Football</option>
                <option value="soccer">Soccer</option>
                <option value="volleyball">Volleyball</option>
                <option value="baseball">Baseball</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="filter-year">Grad Year:</label>
              <select id="filter-year" className="filter-select">
                <option value="all">All Years</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </select>
            </div>
          </div>
          
          {/* Athlete Grid */}
          <div className="athlete-grid" data-athlete-grid>
            {[
              { name: "Marcus J.", sport: "Basketball", position: "Point Guard", year: "2026", gar: 97, stars: 5, flag: "🇺🇸", stats: ["40yd: 4.3s", "Vertical: 38\"", "GPA: 3.8"] },
              { name: "Lena K.", sport: "Soccer", position: "Midfielder", year: "2025", gar: 94, stars: 5, flag: "🇩🇪", stats: ["20m: 6.8s", "Vertical: 32\"", "GPA: 3.9"] },
              { name: "Diego R.", sport: "Football", position: "Wide Receiver", year: "2027", gar: 92, stars: 4, flag: "🇲🇽", stats: ["40yd: 4.5s", "Vertical: 36\"", "GPA: 3.7"] },
              { name: "Sofia M.", sport: "Volleyball", position: "Outside Hitter", year: "2026", gar: 90, stars: 4, flag: "🇪🇸", stats: ["Approach: 10'2\"", "Block: 9'8\"", "GPA: 3.6"] },
              { name: "Alex T.", sport: "Basketball", position: "Shooting Guard", year: "2025", gar: 89, stars: 4, flag: "🇨🇦", stats: ["40yd: 4.4s", "Vertical: 35\"", "GPA: 3.9"] },
              { name: "Emma D.", sport: "Soccer", position: "Forward", year: "2027", gar: 88, stars: 4, flag: "🇫🇷", stats: ["20m: 7.1s", "Vertical: 30\"", "GPA: 3.7"] },
            ].map((athlete, idx) => (
              <div key={idx} className="athlete-card" data-sport={athlete.sport.toLowerCase()} data-year={athlete.year} data-gar={athlete.gar}>
                <div className="athlete-card__image">
                  <img src="/placeholder-athlete.jpg" alt={athlete.name} width="200" height="250" />
                  <div className="gar-badge">
                    <span className="gar-badge__score">{athlete.gar}</span>
                    <span className="gar-badge__stars">{"⭐".repeat(athlete.stars)}</span>
                  </div>
                </div>
                <div className="athlete-card__info">
                  <h3>{athlete.name}</h3>
                  <p className="sport">{athlete.sport}</p>
                  <p className="details">{athlete.position} | {athlete.year} | <span className="flag">{athlete.flag}</span></p>
                  <div className="athlete-card__hover">
                    {athlete.stats.map((stat, i) => <p key={i} className="metric">{stat}</p>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="load-more-container">
            <button className="btn btn--secondary load-more-btn" data-load-more>Load More Athletes</button>
          </div>
        </div>
      </section>

      {/* NCAA PATHWAY */}
      <section id="pathway" className="pathway">
        <div className="container">
          <h2>NCAA Pathway</h2>
          <p className="lead">Clean eligibility from day one.</p>
          
          <ul className="stack">
            <li>Eligibility Center registration (DI/DII) or DIII profile</li>
            <li>Official transcripts + certified translations (as needed)</li>
            <li>GPA conversion & standardized test guidance (when applicable)</li>
            <li>Amateur status protection: no pay-for-play, no inducements</li>
          </ul>

          <Link href="/audit" className="btn btn--primary" data-cta="pathway-audit" data-kpi="conversion">Book the 48-Hour Credit Audit</Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="testimonials section--dark">
        <div className="container">
          <h2>What Families Say</h2>
          
          <div className="grid" data-scroll="stagger">
            <blockquote className="card">
              <p>&quot;Finally, a program that respects my academics and my athletic goals. The NCAA Pathway support is real.&quot;</p>
              <footer>— Student-Athlete, Class of 2026</footer>
            </blockquote>
            
            <blockquote className="card">
              <p>&quot;We needed clarity on eligibility. The 48-Hour Credit Audit gave us a roadmap and peace of mind.&quot;</p>
              <footer>— Parent, International Family</footer>
            </blockquote>
            
            <blockquote className="card">
              <p>&quot;GAR testing gives me objective data to track my players. The verification is professional and standardized.&quot;</p>
              <footer>— Club Coach, Denver</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="faq">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          
          <dl className="faq-list">
            <div className="faq-item" data-accordion="faq-1">
              <dt>
                <button type="button" aria-expanded="false" aria-controls="faq-1-answer">
                  Does this guarantee recruiting?
                </button>
              </dt>
              <dd id="faq-1-answer">
                <p>No. We verify and prepare. Verification ≠ recruitment.</p>
              </dd>
            </div>

            <div className="faq-item" data-accordion="faq-2">
              <dt>
                <button type="button" aria-expanded="false" aria-controls="faq-2-answer">
                  Is online learning accepted?
                </button>
              </dt>
              <dd id="faq-2-answer">
                <p>NCAA cares about credits, core courses, and amateurism. We align and track all three.</p>
              </dd>
            </div>

            <div className="faq-item" data-accordion="faq-3">
              <dt>
                <button type="button" aria-expanded="false" aria-controls="faq-3-answer">
                  Can international athletes participate?
                </button>
              </dt>
              <dd id="faq-3-answer">
                <p>Yes—Eligibility Center registration, translations, GPA conversion, amateur status documentation.</p>
              </dd>
            </div>

            <div className="faq-item" data-accordion="faq-4">
              <dt>
                <button type="button" aria-expanded="false" aria-controls="faq-4-answer">
                  What ages do you work with?
                </button>
              </dt>
              <dd id="faq-4-answer">
                <p>Youth 5–12 (movement focus); 13–25 (full GAR).</p>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* SIGNUP */}
      <section id="signup" className="signup section--accent">
        <div className="container">
          <h2>Claim Your Spot</h2>
          <p className="lead">Choose your path—Apply to the Academy, book a 48-Hour Credit Audit, or register for an event.</p>
          
          <form className="signup-form" action="/api/leads" method="POST" data-form="lead-capture">
            <fieldset>
              <legend>Your Information</legend>
              
              <div className="form-group">
                <label htmlFor="role">I am a <abbr title="required">*</abbr></label>
                <select id="role" name="role" required aria-required="true">
                  <option value="">Select one</option>
                  <option value="parent">Parent</option>
                  <option value="student-athlete">Student-Athlete</option>
                  <option value="coach-club">Coach/Club</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first-name">First Name <abbr title="required">*</abbr></label>
                  <input type="text" id="first-name" name="first_name" required aria-required="true" />
                </div>
                
                <div className="form-group">
                  <label htmlFor="last-name">Last Name <abbr title="required">*</abbr></label>
                  <input type="text" id="last-name" name="last_name" required aria-required="true" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email <abbr title="required">*</abbr></label>
                <input type="email" id="email" name="email" required aria-required="true" />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input type="tel" id="phone" name="phone" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input type="text" id="city" name="city" />
                </div>
                
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <input type="text" id="country" name="country" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="sport">Sport</label>
                  <select id="sport" name="sport">
                    <option value="">Select one</option>
                    <option value="basketball">Basketball</option>
                    <option value="football">American Football</option>
                    <option value="soccer">Soccer</option>
                    <option value="volleyball">Volleyball</option>
                    <option value="baseball">Baseball</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="grad-year">Graduation Year</label>
                  <input type="number" id="grad-year" name="graduation_year" min="2024" max="2035" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="interest">I&apos;m interested in <abbr title="required">*</abbr></label>
                <select id="interest" name="interest" required aria-required="true">
                  <option value="">Select one</option>
                  <option value="apply">Apply to the Academy</option>
                  <option value="audit">48-Hour Credit Audit</option>
                  <option value="events">Events (FNL, Camps, Testing)</option>
                  <option value="athleteai">AthleteAI</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Additional Notes</label>
                <textarea id="notes" name="notes" rows={4}></textarea>
              </div>

              <p className="microcopy">By submitting, you agree to our policies and data processing. Verification ≠ recruitment.</p>

              <button type="submit" className="btn btn--primary" data-cta="form-submit" data-kpi="conversion">Submit</button>
            </fieldset>
          </form>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact section--dark">
        <div className="container">
          <h2>Talk to Our Team</h2>
          <p>Email <a href="mailto:invest@go4itsports.org">invest@go4itsports.org</a> or call <a href="tel:+12054344005">+1-205-434-4005</a>.</p>
          <p><strong>Hubs:</strong> Denver • Vienna • Dallas • Mérida (MX)</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer" className="footer">
        <div className="container">
          <div className="footer__compliance">
            <p>Go4it is a homeschool learning provider with American teachers. Credits and official transcripts are issued via U.S. school-of-record partners until Fall 2026. Athlete OS and GAR Testing are non-academic and do not grant credit. No recruiting guarantees. NCAA amateurism and FIFA/FA rules respected. Families remain responsible for local education registration. We do not provide immigration or legal advice.</p>
          </div>
          
          <div className="footer__brand">
            <p>&copy; Go4it Sports Academy. <strong>Train Here. Place Anywhere.</strong></p>
          </div>

          <nav className="footer__nav" aria-label="Footer navigation">
            <ul>
              <li><Link href="/privacy">Privacy</Link></li>
              <li><Link href="/terms">Terms</Link></li>
              <li><Link href="/accessibility">Accessibility</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </nav>
        </div>
      </footer>

      {/* Load external scripts */}
      <Script src="/landing-page.js" strategy="afterInteractive" />
      <Script src="/chat-widget.js" strategy="afterInteractive" />
    </>
  );
}
