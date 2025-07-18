export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Go4It Sports Platform</h1>
        <p className="text-xl mb-8">Elite Athletic Development Platform</p>
        
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Top Verified Athletes</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800 p-4 rounded-lg">
              <h3 className="font-semibold text-white">Cooper Flagg</h3>
              <p className="text-slate-400">Basketball • Forward</p>
              <p className="text-blue-400">GAR: 98/100</p>
            </div>
            
            <div className="bg-slate-800 p-4 rounded-lg">
              <h3 className="font-semibold text-white">Ace Bailey</h3>
              <p className="text-slate-400">Basketball • Guard</p>
              <p className="text-blue-400">GAR: 96/100</p>
            </div>
            
            <div className="bg-slate-800 p-4 rounded-lg">
              <h3 className="font-semibold text-white">Dylan Harper</h3>
              <p className="text-slate-400">Basketball • Point Guard</p>
              <p className="text-blue-400">GAR: 95/100</p>
            </div>
            
            <div className="bg-slate-800 p-4 rounded-lg">
              <h3 className="font-semibold text-white">VJ Edgecombe</h3>
              <p className="text-slate-400">Basketball • Guard</p>
              <p className="text-blue-400">GAR: 93/100</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}