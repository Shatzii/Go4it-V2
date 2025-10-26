'use client';

import Link from 'next/link';

export default function Page() {
  return (
    <>
      <style jsx>{`
        /* =========================================================
           GO4IT SPORTS ACADEMY - BRAND THEME
           Colors: Charcoal #0B0F14, Cyan #00D4FF, Green #27E36A
           ========================================================= */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          background: #0B0F14;
          color: #E6EAF0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }

        .wrapper {
          min-height: 100vh;
          background: #0B0F14;
        }

        /* Navigation */
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(11, 15, 20, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 212, 255, 0.2);
        }

        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-family: 'Oswald', 'Anton', sans-serif;
          font-size: 1.8rem;
          font-weight: 900;
          color: #00D4FF;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
          list-style: none;
        }

        .nav-links a {
          color: #E6EAF0;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: color 0.3s;
        }

        .nav-links a:hover {
          color: #00D4FF;
        }

        .btn {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.3s;
          font-size: 0.9rem;
        }

        .btn-primary {
          background: #00D4FF;
          color: #0B0F14;
        }

        .btn-primary:hover {
          background: #36E4FF;
          transform: translateY(-2px);
        }

        .btn-outline {
          border: 2px solid #00D4FF;
          color: #00D4FF;
        }

        .btn-outline:hover {
          background: rgba(0, 212, 255, 0.1);
        }

        /* Hero Section */
        .hero {
          padding: 8rem 2rem 6rem;
          text-align: center;
          background: 
            radial-gradient(ellipse at top, rgba(0, 212, 255, 0.1) 0%, transparent 60%),
            #0B0F14;
        }

        .hero-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .tagline {
          font-size: 1.2rem;
          color: #00D4FF;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 3px;
          margin-bottom: 1.5rem;
        }

        h1 {
          font-family: 'Oswald', 'Anton', sans-serif;
          font-size: clamp(2.5rem, 8vw, 4.5rem);
          font-weight: 900;
          color: #00D4FF;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 1rem;
          line-height: 1.1;
        }

        .hero-subtitle {
          font-size: 1.5rem;
          color: #E6EAF0;
          margin-bottom: 2rem;
          font-weight: 600;
        }

        .declaration {
          max-width: 800px;
          margin: 2rem auto;
          padding: 1.5rem 2rem;
          background: rgba(0, 212, 255, 0.05);
          border-left: 4px solid #00D4FF;
          border-radius: 4px;
          font-size: 1rem;
          line-height: 1.8;
          color: #E6EAF0;
        }

        .hubs {
          margin: 2rem 0;
          font-size: 1.2rem;
          font-weight: 700;
          color: #00D4FF;
          letter-spacing: 1px;
        }

        .cta-buttons {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          margin-top: 2.5rem;
          flex-wrap: wrap;
        }

        /* Section Styling */
        .section {
          padding: 5rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        h2 {
          font-family: 'Oswald', 'Anton', sans-serif;
          font-size: clamp(2rem, 5vw, 3rem);
          color: #00D4FF;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          color: #5C6678;
          font-size: 1.1rem;
        }

        /* Service Cards Grid */
        .services-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 768px) {
          .services-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .services-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .service-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(0, 212, 255, 0.2);
          border-radius: 8px;
          padding: 2rem;
          transition: all 0.3s;
        }

        .service-card:hover {
          border-color: #00D4FF;
          background: rgba(0, 212, 255, 0.05);
          transform: translateY(-5px);
        }

        .service-number {
          display: inline-block;
          width: 40px;
          height: 40px;
          background: #00D4FF;
          color: #0B0F14;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 1.2rem;
          margin-bottom: 1rem;
        }

        h3 {
          font-size: 1.5rem;
          color: #00D4FF;
          margin-bottom: 0.75rem;
          font-weight: 700;
        }

        .service-tagline {
          color: #5C6678;
          font-size: 0.95rem;
          font-style: italic;
          margin-bottom: 1rem;
        }

        .service-description {
          color: #E6EAF0;
          margin-bottom: 1rem;
          line-height: 1.7;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 1rem 0;
        }

        li {
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
          color: #E6EAF0;
        }

        li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #27E36A;
          font-weight: 900;
        }

        /* Contact Section */
        .contact-section {
          background: rgba(0, 212, 255, 0.05);
          border-top: 2px solid rgba(0, 212, 255, 0.3);
          border-bottom: 2px solid rgba(0, 212, 255, 0.3);
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          text-align: center;
        }

        @media (min-width: 768px) {
          .contact-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .contact-item {
          color: #E6EAF0;
        }

        .contact-label {
          font-size: 0.9rem;
          color: #5C6678;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.5rem;
        }

        .contact-value {
          font-size: 1.2rem;
          font-weight: 700;
          color: #00D4FF;
        }

        .contact-value a {
          color: #00D4FF;
          text-decoration: none;
        }

        .contact-value a:hover {
          text-decoration: underline;
        }

        /* Footer */
        .footer {
          padding: 3rem 2rem;
          text-align: center;
          border-top: 1px solid rgba(0, 212, 255, 0.2);
        }

        .compliance {
          max-width: 900px;
          margin: 0 auto;
          font-size: 0.85rem;
          color: #5C6678;
          line-height: 1.6;
          padding: 1.5rem;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
          border: 1px solid rgba(0, 212, 255, 0.1);
        }

        .copyright {
          margin-top: 2rem;
          color: #5C6678;
          font-size: 0.9rem;
        }

        /* Mobile Menu Toggle (hidden by default, show on small screens) */
        .mobile-menu-toggle {
          display: none;
          background: none;
          border: 2px solid #00D4FF;
          color: #00D4FF;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .mobile-menu-toggle {
            display: block;
          }

          .nav-links {
            display: none;
          }

          .nav-links.mobile-open {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #0B0F14;
            border-bottom: 1px solid rgba(0, 212, 255, 0.2);
            padding: 1rem 2rem;
            gap: 1rem;
          }
        }
      `}</style>

      <div className="wrapper">
        {/* Navigation */}
        <nav className="navbar">
          <div className="navbar-container">
            <Link href="/" className="logo">
              GO4IT SPORTS ACADEMY
            </Link>
            <ul className="nav-links">
              <li><Link href="/academy">Academy</Link></li>
              <li><Link href="/starpath">StarPath</Link></li>
              <li><Link href="/recruiting-hub">Recruiting Hub</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
            </ul>
            <Link href="/apply" className="btn btn-primary">
              Apply Now
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero">
          <div className="hero-container">
            <div className="tagline">TRAIN HERE. PLACE ANYWHERE.</div>
            <h1>ONLINE + HYBRID SCHOOL FOR ELITE STUDENT-ATHLETES</h1>
            <p className="hero-subtitle">Go4it Sports Academy</p>
            <div className="hubs">Denver • Vienna • Dallas • Mérida (MX)</div>
            
            <div className="declaration">
              Go4it Sports Academy is an online school with hybrid training blocks for serious athletes. 
              We keep academics on track and eligibility clean while you train, test, and compete—locally 
              and internationally. Verification ≠ recruitment. No guarantees.
            </div>

            <div className="cta-buttons">
              <Link href="/apply" className="btn btn-primary">Apply to Academy</Link>
              <Link href="/audit" className="btn btn-outline">48-Hour Credit Audit</Link>
              <Link href="/events" className="btn btn-outline">View Events</Link>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="section">
          <div className="section-header">
            <h2>Complete Athletic Development System</h2>
            <p className="section-subtitle">Standards over hype. Verification over promises.</p>
          </div>

          <div className="services-grid">
            {/* 1. Academy Core Program */}
            <div className="service-card">
              <div className="service-number">1</div>
              <h3>Online + Hybrid Academy</h3>
              <p className="service-tagline">The school built for athletes who refuse to choose between grades and game.</p>
              <p className="service-description">8th–12th grade and post-grad athletes seeking rigorous academics, verified development, and global showcase opportunities.</p>
              <ul>
                <li>American-teacher online courses (NCAA core-course expectations)</li>
                <li>Study Hall & weekly progress checks</li>
                <li>Integrated GAR™ testing each term</li>
                <li>Weekend camps, FNL showcases, Vienna/Mérida residencies</li>
                <li>FERPA/GDPR compliance, amateurism protected</li>
              </ul>
              <Link href="/academy" className="btn btn-outline" style={{marginTop: '1rem', display: 'inline-block'}}>Learn More</Link>
            </div>

            {/* 2. NCAA Pathway */}
            <div className="service-card">
              <div className="service-number">2</div>
              <h3>NCAA Pathway</h3>
              <p className="service-tagline">Turn confusion into a clean, step-by-step NCAA plan.</p>
              <p className="service-description">U.S. and international families needing core-course mapping, transcript intake, GPA translation, and amateurism protection.</p>
              <ul>
                <li>Eligibility Center setup (DI/DII/DIII)</li>
                <li>Official transcripts + certified translations</li>
                <li>GPA conversion & standardized test guidance</li>
                <li>Amateur status protection</li>
              </ul>
              <Link href="/ncaa-eligibility" className="btn btn-outline" style={{marginTop: '1rem', display: 'inline-block'}}>Get NCAA Plan</Link>
            </div>

            {/* 3. 48-Hour Credit Audit */}
            <div className="service-card">
              <div className="service-number">3</div>
              <h3>48-Hour Credit Audit</h3>
              <p className="service-tagline">In two days, know exactly what counts and what's missing.</p>
              <p className="service-description">Any athlete considering Go4it or just needing a clean eligibility map.</p>
              <ul>
                <li>Transcript intake + core-course evaluation</li>
                <li>GPA translation and gap analysis</li>
                <li>Eligibility Center action list and deadlines</li>
                <li>Coach/parent debrief call</li>
              </ul>
              <Link href="/audit" className="btn btn-outline" style={{marginTop: '1rem', display: 'inline-block'}}>Book Audit</Link>
            </div>

            {/* 4. GAR Testing */}
            <div className="service-card">
              <div className="service-number">4</div>
              <h3>GAR™ Testing</h3>
              <p className="service-tagline">If it isn't measured, it's a myth.</p>
              <p className="service-description">The Go4it Athletic Rating—a 0–100 score with star tags that blends combine performance, cognitive/learning, and mental profile.</p>
              <ul>
                <li>Physical: 40yd/20m, shuttle, vertical, reaction</li>
                <li>Cognitive: tap speed, pattern recall, fast choice</li>
                <li>Mental: confidence, coachability, motivation</li>
                <li>Electric timing, standardized stations</li>
                <li>60-sec AI summary video</li>
              </ul>
              <Link href="/events" className="btn btn-outline" style={{marginTop: '1rem', display: 'inline-block'}}>Testing Dates</Link>
            </div>

            {/* 5. AthleteAI */}
            <div className="service-card">
              <div className="service-number">5</div>
              <h3>AthleteAI</h3>
              <p className="service-tagline">Your coach + calendar + eligibility in one hub.</p>
              <p className="service-description">Turn verified data into daily action.</p>
              <ul>
                <li>AI Coach: voice/text Q&A, drill prescriptions, weekly plans</li>
                <li>Rankings & trajectory: GAR-powered growth curves</li>
                <li>NCAA tracker: documents, deadlines, alerts</li>
                <li>StarPath: goals → milestones → tasks</li>
              </ul>
              <Link href="/starpath" className="btn btn-outline" style={{marginTop: '1rem', display: 'inline-block'}}>Activate AthleteAI</Link>
            </div>

            {/* 6. Friday Night Lights */}
            <div className="service-card">
              <div className="service-number">6</div>
              <h3>Friday Night Lights (FNL)</h3>
              <p className="service-tagline">Verified testing + real games = film that travels.</p>
              <p className="service-description">1 hr verified testing + 2 hrs live games. DJ/emcee, content capture, family vibe.</p>
              <ul>
                <li>Ages 13–25 (full GAR); Youth 5–12 (foundations)</li>
                <li>Verified metrics, film moments, spotlight eligibility</li>
                <li>Verification ≠ recruitment; amateur status protected</li>
              </ul>
              <Link href="/friday-night-lights" className="btn btn-outline" style={{marginTop: '1rem', display: 'inline-block'}}>Register for FNL</Link>
            </div>

            {/* 7. International Soccer Testing */}
            <div className="service-card">
              <div className="service-number">7</div>
              <h3>International Soccer Testing (IST)</h3>
              <p className="service-tagline">Verification-first European look—no agent noise.</p>
              <p className="service-description">EU-style, verification-first soccer evaluation—no trials promises.</p>
              <ul>
                <li>Technical stations + GAR soccer weighting</li>
                <li>Small-sided match play; coach notes</li>
                <li>Coach Pack: verified metrics, film, instruction profile</li>
                <li>FIFA/FA minors protection; no agents, no inducements</li>
              </ul>
              <Link href="/events" className="btn btn-outline" style={{marginTop: '1rem', display: 'inline-block'}}>Soccer Dates</Link>
            </div>

            {/* 8. Residencies */}
            <div className="service-card">
              <div className="service-number">8</div>
              <h3>Vienna & Mérida Residencies</h3>
              <p className="service-tagline">Train abroad with a plan and protection.</p>
              <p className="service-description">Concentrated training blocks with international exposure. Invite based on GAR + academics + coach references.</p>
              <ul>
                <li>High-performance sessions</li>
                <li>Cultural/study blocks</li>
                <li>Showcase friendlies (when scheduled)</li>
                <li>Film + safety protocols</li>
              </ul>
              <Link href="/apply" className="btn btn-outline" style={{marginTop: '1rem', display: 'inline-block'}}>Apply (note Residencies)</Link>
            </div>

            {/* 9. Camps */}
            <div className="service-card">
              <div className="service-number">9</div>
              <h3>Seasonal Camps</h3>
              <p className="service-tagline">Build skills. Capture film. Level up.</p>
              <p className="service-description">Easter Camp 2026 (Mar 30–Apr 4) • Vienna Summer Camp 2026 (Jul 20–24)</p>
              <ul>
                <li>Verified skills blocks</li>
                <li>AthleteAI workshops</li>
                <li>Eligibility mini-clinics</li>
                <li>Film sessions</li>
              </ul>
              <Link href="/events" className="btn btn-outline" style={{marginTop: '1rem', display: 'inline-block'}}>Camp Updates</Link>
            </div>

            {/* 10. NextUp Spotlights */}
            <div className="service-card">
              <div className="service-number">10</div>
              <h3>NextUp Global Spotlights</h3>
              <p className="service-tagline">Earn your spotlight with verified data.</p>
              <p className="service-description">Editorial features for top GAR athletes with coach-ready blurbs.</p>
              <ul>
                <li>Profile card (GAR, stars, position fit)</li>
                <li>Short film</li>
                <li>Shareable link</li>
                <li>Entry: Verified combine or Academy enrollment</li>
              </ul>
              <Link href="/events" className="btn btn-outline" style={{marginTop: '1rem', display: 'inline-block'}}>Qualify for Spotlight</Link>
            </div>

            {/* 11. Grade-8 Foundations */}
            <div className="service-card">
              <div className="service-number">11</div>
              <h3>Grade-8 Foundations</h3>
              <p className="service-tagline">Build the right habits before high school counts.</p>
              <p className="service-description">Study skills, movement literacy, baseline GAR (age-scaled), parent eligibility orientation.</p>
              <ul>
                <li>Clear 9th-grade plan</li>
                <li>Training cadence setup</li>
                <li>Age-appropriate GAR baseline</li>
                <li>Parent NCAA orientation</li>
              </ul>
              <Link href="/apply" className="btn btn-outline" style={{marginTop: '1rem', display: 'inline-block'}}>Join Foundations</Link>
            </div>

            {/* 12. Blueprint 72h */}
            <div className="service-card">
              <div className="service-number">12</div>
              <h3>Blueprint 72h</h3>
              <p className="service-tagline">In 72 hours, set your family's academic + training + eligibility rhythm.</p>
              <p className="service-description">Weekly schedule, AthleteAI setup, first-month milestones, audit booking.</p>
              <ul>
                <li>Customized weekly schedule</li>
                <li>AthleteAI platform setup</li>
                <li>First-month milestone map</li>
                <li>Fast-track audit booking</li>
              </ul>
              <Link href="/audit" className="btn btn-outline" style={{marginTop: '1rem', display: 'inline-block'}}>Start Blueprint 72h</Link>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section contact-section">
          <div className="section-header">
            <h2>Get Started</h2>
            <p className="section-subtitle">Ready to join the academy?</p>
          </div>

          <div className="contact-grid">
            <div className="contact-item">
              <div className="contact-label">Email</div>
              <div className="contact-value">
                <a href="mailto:invest@go4itsports.org">invest@go4itsports.org</a>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-label">Phone</div>
              <div className="contact-value">
                <a href="tel:+12054344005">+1-205-434-4005</a>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-label">Website</div>
              <div className="contact-value">
                <a href="https://go4itsports.org" target="_blank" rel="noopener noreferrer">go4itsports.org</a>
              </div>
            </div>
          </div>

          <div className="cta-buttons">
            <Link href="/apply" className="btn btn-primary">Apply to Academy</Link>
            <Link href="/audit" className="btn btn-outline">Book 48-Hour Audit</Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="compliance">
            <strong>Important Compliance Information:</strong> Go4it Sports Academy operates with full FERPA and GDPR compliance. 
            All student data is protected under applicable privacy laws. We respect NCAA amateurism rules—no pay-for-play, 
            no inducements, no recruiting guarantees. Verification services and performance ratings are provided for athlete 
            development purposes only. International operations comply with FIFA/FA minor protection protocols. Parents and 
            guardians maintain full decision-making authority. All showcases and events are verification-focused; participation 
            does not guarantee college placement, professional contracts, or athletic scholarships.
          </div>
          <div className="copyright">
            © {new Date().getFullYear()} Go4it Sports Academy. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
}
