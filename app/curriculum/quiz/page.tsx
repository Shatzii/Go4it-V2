"use client";

import { use } from "react";
import QuizEngine from "@/components/starpath/QuizEngine";

export default function QuizPage({ searchParams }: { searchParams: Promise<{ course?: string; week?: string }> }) {
  const params = use(searchParams);
  const courseId = params.course || "SCI-401";
  const weekNumber = parseInt(params.week || "1");

  return (
    <div className="min-h-screen starpath-bg">
      <header className="bg-black border-b border-amber-500/30">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Go4it Sports Academy" className="h-12 w-12" />
              <div>
                <div className="text-2xl font-bold text-white">Go4it Sports Academy™</div>
                <div className="text-sm text-amber-500">+ StarPath Accelerator™</div>
              </div>
            </div>
            <div className="flex gap-4">
              <a href="/curriculum" className="text-white hover:text-amber-500 transition">
                Back to Curriculum
              </a>
              <a href="/dashboard" className="text-white hover:text-amber-500 transition">
                Dashboard
              </a>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <QuizEngine courseId={courseId} weekNumber={weekNumber} />
      </div>
    </div>
  );
}
