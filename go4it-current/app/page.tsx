import Link from 'next/link';

export const metadata = {
  title: 'Go4it — Landing',
  description: 'Go4it platform — wellness, sports, and academy.'
};

export default function Page() {
  return (
    <main style={{fontFamily: 'Inter, system-ui, -apple-system, Roboto, sans-serif', padding: 32}}>
      <h1 style={{fontSize: 36, marginBottom: 8}}>Welcome to Go4it</h1>
      <p style={{fontSize: 16, color: '#555', maxWidth: 760}}>
        This is a lightweight landing page intended for quick deployments (Replit, Docker, preview).
        Use the links below to access the main deployment areas.
      </p>

      <nav style={{marginTop: 24, display: 'flex', gap: 12}}>
        <Link href="/go4it-deployment" style={{padding: '8px 12px', background: '#0ea5a4', color: 'white', borderRadius: 6}}>Go4it Deployment</Link>
        <Link href="/sports-school" style={{padding: '8px 12px', background: '#3b82f6', color: 'white', borderRadius: 6}}>Sports School</Link>
        <Link href="/ai-automation" style={{padding: '8px 12px', background: '#7c3aed', color: 'white', borderRadius: 6}}>AI Automation</Link>
      </nav>

      <section style={{marginTop: 36}}>
        <h2 style={{fontSize: 20}}>Quick Replit tips</h2>
        <ul>
          <li>Replit uses the provided <code>replit.nix</code> for packages.</li>
          <li>Build and start are handled by the repo <code>.replit</code> run command.</li>
          <li>If you hit native dependency errors, the Replit build will skip optional deps configured locally.</li>
        </ul>
      </section>

      <footer style={{marginTop: 36, color: '#777'}}>
        <small>If a page 404s, open the repo and check the relevant app folder (e.g. <code>go4it-deployment/app</code>, <code>sports-school/app</code>).</small>
      </footer>
    </main>
  );
}
export default function Go4ItHomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">Go4It Sports Platform</h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Elite Athletic Development Platform for Neurodivergent Student Athletes
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <h3 className="text-2xl font-bold mb-4">StarPath XP System</h3>
              <p className="text-slate-300 mb-4">
                Revolutionary gamified training platform with skill progression
              </p>
              <a href="/starpath" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-block">
                Enter StarPath
              </a>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <h3 className="text-2xl font-bold mb-4">NCAA Recruiting</h3>
              <p className="text-slate-300 mb-4">
                Elite recruiting platform with GAR analysis and college matching
              </p>
              <a href="/recruiting-hub" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded inline-block">
                Get Recruited
              </a>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <h3 className="text-2xl font-bold mb-4">Go4It Academy</h3>
              <p className="text-slate-300 mb-4">
                Full K-12 educational institution with integrated athletics
              </p>
              <a href="/academy" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded inline-block">
                Join Academy
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center bg-slate-800 border border-slate-700 p-4 rounded">
              <div className="text-2xl font-bold text-yellow-400 mb-1">156+</div>
              <div className="text-sm text-slate-300">College Commits</div>
            </div>
            <div className="text-center bg-slate-800 border border-slate-700 p-4 rounded">
              <div className="text-2xl font-bold text-blue-400 mb-1">2,847+</div>
              <div className="text-sm text-slate-300">Verified Athletes</div>
            </div>
            <div className="text-center bg-slate-800 border border-slate-700 p-4 rounded">
              <div className="text-2xl font-bold text-green-400 mb-1">89%</div>
              <div className="text-sm text-slate-300">NCAA Eligible</div>
            </div>
            <div className="text-center bg-slate-800 border border-slate-700 p-4 rounded">
              <div className="text-2xl font-bold text-purple-400 mb-1">94%</div>
              <div className="text-sm text-slate-300">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}