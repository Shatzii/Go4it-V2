'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function AuthButton() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-white">
          {user.firstName} {user.lastName}
        </span>
        {user.profileImageUrl && (
          <img
            src={user.profileImageUrl}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        <Link
          href="/api/auth/logout"
          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Logout
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/api/auth/login"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
      >
        Sign In
      </Link>
      <Link
        href="/register"
        className="border border-slate-400 hover:border-white text-slate-300 hover:text-white px-6 py-2 rounded-lg transition-colors font-medium"
      >
        Register
      </Link>
    </div>
  );
}
