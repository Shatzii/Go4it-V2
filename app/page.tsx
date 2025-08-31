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