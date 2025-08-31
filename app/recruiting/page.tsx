'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RecruitingRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/recruiting-hub');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <div className="text-xl">Redirecting to Recruiting Hub...</div>
      </div>
    </div>
  );
}
