export default function SimpleHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Go4It Sports Platform</h1>
          <p className="text-xl text-slate-300 mb-8">
            AI-Enhanced Sports Analytics and Recruitment
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href="/rankings" className="bg-slate-800 p-6 rounded-lg hover:bg-slate-700 transition-colors">
              <h3 className="text-lg font-semibold mb-2">Rankings</h3>
              <p className="text-slate-400">View comprehensive athlete rankings</p>
            </a>
            <a href="/dashboard" className="bg-slate-800 p-6 rounded-lg hover:bg-slate-700 transition-colors">
              <h3 className="text-lg font-semibold mb-2">Dashboard</h3>
              <p className="text-slate-400">Access your athlete dashboard</p>
            </a>
            <a href="/auth" className="bg-slate-800 p-6 rounded-lg hover:bg-slate-700 transition-colors">
              <h3 className="text-lg font-semibold mb-2">Login</h3>
              <p className="text-slate-400">Sign in to your account</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}