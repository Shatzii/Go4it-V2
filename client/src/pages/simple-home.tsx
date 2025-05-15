import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

interface User {
  username: string;
  name: string;
  role: string;
}

const SimpleHome = () => {
  const [user, setUser] = useState<User | null>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const userDataString = localStorage.getItem("go4it_user");
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("go4it_user");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("go4it_user");
    setUser(null);
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-[#0e1628] text-white">
      {/* Header */}
      <header className="border-b border-blue-600 bg-[rgba(15,23,42,0.8)] p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="text-2xl font-bold text-cyan-400">Go4It Sports</div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span>{user.name}</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/auth">
                <a className="rounded bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 font-bold text-white hover:opacity-90">
                  Sign In
                </a>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        {user ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {/* Sidebar */}
            <div className="rounded-lg bg-[rgba(15,23,42,0.6)] p-4 shadow-lg md:col-span-1">
              <ul className="space-y-2">
                <li className="rounded bg-blue-600 p-3">Dashboard</li>
                <li className="rounded p-3 hover:bg-[rgba(30,41,59,0.6)]">Videos</li>
                <li className="rounded p-3 hover:bg-[rgba(30,41,59,0.6)]">Highlights</li>
                <li className="rounded p-3 hover:bg-[rgba(30,41,59,0.6)]">Performance</li>
                <li className="rounded p-3 hover:bg-[rgba(30,41,59,0.6)]">Schools</li>
                <li className="rounded p-3 hover:bg-[rgba(30,41,59,0.6)]">Coaches</li>
                <li className="rounded p-3 hover:bg-[rgba(30,41,59,0.6)]">Training</li>
                <li className="rounded p-3 hover:bg-[rgba(30,41,59,0.6)]">Settings</li>
              </ul>
            </div>

            {/* Main content area */}
            <div className="space-y-6 md:col-span-3">
              {/* Performance Overview */}
              <div className="rounded-lg bg-[rgba(15,23,42,0.6)] p-6 shadow-lg">
                <h2 className="mb-4 text-xl text-cyan-400">Performance Overview</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="rounded bg-[rgba(30,41,59,0.6)] p-4 text-center">
                    <div className="my-2 text-2xl font-bold text-cyan-400">87.5</div>
                    <div className="text-sm text-gray-400">GAR Score</div>
                  </div>
                  <div className="rounded bg-[rgba(30,41,59,0.6)] p-4 text-center">
                    <div className="my-2 text-2xl font-bold text-cyan-400">12</div>
                    <div className="text-sm text-gray-400">Videos Uploaded</div>
                  </div>
                  <div className="rounded bg-[rgba(30,41,59,0.6)] p-4 text-center">
                    <div className="my-2 text-2xl font-bold text-cyan-400">8</div>
                    <div className="text-sm text-gray-400">Coach Views</div>
                  </div>
                  <div className="rounded bg-[rgba(30,41,59,0.6)] p-4 text-center">
                    <div className="my-2 text-2xl font-bold text-cyan-400">4</div>
                    <div className="text-sm text-gray-400">School Interests</div>
                  </div>
                </div>
              </div>

              {/* Recent Videos */}
              <div className="rounded-lg bg-[rgba(15,23,42,0.6)] p-6 shadow-lg">
                <h2 className="mb-4 text-xl text-cyan-400">Recent Videos</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="overflow-hidden rounded bg-[rgba(30,41,59,0.6)]">
                    <div className="flex h-40 items-center justify-center bg-[#1e293b]">
                      Video 1
                    </div>
                    <div className="p-4">
                      <div className="mb-2">Game Highlights vs. Westside High</div>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>May 10, 2025</span>
                        <span>3:42</span>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded bg-[rgba(30,41,59,0.6)]">
                    <div className="flex h-40 items-center justify-center bg-[#1e293b]">
                      Video 2
                    </div>
                    <div className="p-4">
                      <div className="mb-2">Skills Drill - Agility Training</div>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>May 8, 2025</span>
                        <span>2:15</span>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded bg-[rgba(30,41,59,0.6)]">
                    <div className="flex h-40 items-center justify-center bg-[#1e293b]">
                      Video 3
                    </div>
                    <div className="p-4">
                      <div className="mb-2">Field Work - Running Routes</div>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>May 5, 2025</span>
                        <span>4:30</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <button className="rounded bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 font-bold text-white hover:opacity-90">
                    View All Videos
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
            <h1 className="mb-6 text-4xl font-bold text-cyan-400">
              Welcome to Go4It Sports
            </h1>
            <p className="mb-8 max-w-2xl text-lg text-gray-300">
              The advanced sports analytics platform designed for neurodivergent 
              student athletes. Track your performance, connect with coaches, and 
              showcase your talent.
            </p>
            <Link href="/auth">
              <a className="rounded bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 text-lg font-bold text-white hover:opacity-90">
                Get Started
              </a>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleHome;