import { Redirect } from 'next/navigation';

export default function SportsRedirectPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to Go4it Sports Academy...</h1>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.location.href = '/schools/go4it-sports-academy';`,
          }}
        />
        <p className="text-gray-600">
          <a href="/schools/go4it-sports-academy" className="text-blue-600 hover:underline">
            Click here if you are not automatically redirected
          </a>
        </p>
      </div>
    </div>
  );
}
