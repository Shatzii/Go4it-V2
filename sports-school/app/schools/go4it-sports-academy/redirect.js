/**
 * Redirect for go4it-sports-academy to prevent build issues
 * This is a fallback redirect in case the main page has issues
 */

// Simple redirect to main schools page
if (typeof window !== 'undefined') {
  window.location.href = '/schools/sports';
}

export default function RedirectPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-8"></div>
        <h2 className="text-2xl font-bold text-white mb-4">Redirecting...</h2>
        <p className="text-white/70">Taking you to Go4it Sports Academy</p>
      </div>
    </div>
  );
}
