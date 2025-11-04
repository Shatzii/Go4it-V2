'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function AuthButton() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) {
    return (
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-white">
          {user.firstName} {user.lastName || ''}
        </span>
        {user.imageUrl && (
          <img
            src={user.imageUrl}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        <button
          onClick={() => signOut()}
          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/login"
        className="text-white hover:text-blue-400 transition-colors"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Sign Up
      </Link>
    </div>
  );
}
