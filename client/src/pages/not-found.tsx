import React from "react";
import { Link } from "wouter";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4" style={{ backgroundColor: "#0e1628" }}>
      <div className="max-w-md">
        <h1 className="text-6xl font-bold text-blue-400 mb-6">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">Page Not Found</h2>
        <p className="text-slate-300 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <button className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors">
            Go Back Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;