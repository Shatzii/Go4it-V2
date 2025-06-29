export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-slate-400 mb-8">The page you're looking for doesn't exist.</p>
        <a href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md">
          Go Home
        </a>
      </div>
    </div>
  );
}