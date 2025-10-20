export default function SchoolsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto mb-8"></div>
        <h2 className="text-2xl font-bold text-white mb-4">Loading School Information...</h2>
        <p className="text-white/70">Preparing educational excellence for you</p>
      </div>
    </div>
  );
}
