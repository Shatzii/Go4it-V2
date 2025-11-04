/**
 * Studio Dashboard - Elite Integrated Core Studio (grades 9-12)
 * 3-hour daily studio with cross-curricular rotations + NCAA tasks + AthleteAI
 * Feature flag: NEXT_PUBLIC_FEATURE_STUDIO
 */
'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

// ---- Types ----
export type SubjectKey = 'math' | 'ela' | 'science' | 'socialStudies';

export interface StudioActivity {
  type: 'mini_lesson' | 'guided_practice' | 'lab_demo' | 'cer_writeup' | 'close_reading' | 'writing_workshop' | 'peer_review' | 'case_study' | 'learning_log' | 'concept_check' | 'exit_ticket';
  duration: number; // minutes
  content: string;
  resources?: string[];
}

export interface StudioRotation {
  title: string;
  duration: number; // minutes
  standards: string[];
  objectives: string[];
  activities: StudioActivity[];
  differentiation?: {
    scaffolded?: string;
    extended?: string;
  };
}

export interface DailyStudio {
  date: string; // ISO date
  theme: string;
  drivingQuestion: string;
  rotations: Record<SubjectKey, StudioRotation>;
  ncaaTasks: string[];
  athleteAIData: {
    sleepScore: number;
    readiness: number;
    trainingLoad: number;
  };
}

// ---- Rotation Card Component ----
function RotationCard(props: {
  subject: SubjectKey;
  rotation: StudioRotation;
  completed: boolean;
  onComplete: () => void;
}) {
  const { subject, rotation, completed, onComplete } = props;
  const subjectLabels: Record<SubjectKey, string> = {
    math: 'Mathematics',
    ela: 'English Language Arts',
    science: 'Science',
    socialStudies: 'Social Studies',
  };

  return (
    <div className="p-4 bg-[#0F141B] border border-[#1C2430] rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-oswald uppercase font-bold text-[#E6EAF0]">
          {subjectLabels[subject]} — {rotation.title}
        </h3>
        <button
          onClick={() => {
            if (typeof window !== 'undefined' && window.posthog) {
              window.posthog.capture('rotation_complete', { subject });
            }
            onComplete();
          }}
          className={`px-3 py-1 rounded font-oswald uppercase text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#00D4FF] focus:ring-offset-2 focus:ring-offset-[#0B0F14] ${
            completed
              ? 'bg-[#27E36A] text-[#0B0F14] cursor-default'
              : 'bg-[#00D4FF] text-[#0B0F14] hover:bg-[#00B8E6]'
          }`}
          aria-pressed={completed}
          aria-label={`Mark ${subjectLabels[subject]} rotation as ${completed ? 'completed' : 'complete'}`}
        >
          {completed ? '✓ Completed' : 'Mark Done'}
        </button>
      </div>
      <div className="text-sm text-[#5C6678] space-y-2">
        <p>
          <span className="font-semibold text-[#00D4FF]">Standards:</span>{' '}
          {rotation.standards.join(', ')}
        </p>
        <p>
          <span className="font-semibold text-[#00D4FF]">Duration:</span> {rotation.duration} min
        </p>
        {rotation.objectives.length > 0 && (
          <div>
            <span className="font-semibold text-[#00D4FF]">Objectives:</span>
            <ul className="list-disc list-inside mt-1 ml-2">
              {rotation.objectives.map((obj, i) => (
                <li key={i}>{obj}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Progress Tracker Component ----
function ProgressTracker(props: { timeOnTask: number; completedCount: number; totalCount: number }) {
  const { timeOnTask, completedCount, totalCount } = props;
  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="p-4 bg-[#0F141B] border border-[#1C2430] rounded-lg">
      <h3 className="font-oswald uppercase font-bold text-[#E6EAF0] mb-3">Progress Tracker</h3>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-[#5C6678]">Completion</span>
            <span className="text-[#00D4FF] font-bold">{percentComplete}%</span>
          </div>
          <div className="w-full h-2 bg-[#1C2430] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00D4FF] transition-all duration-300"
              style={{ width: `${percentComplete}%` }}
              role="progressbar"
              aria-valuenow={percentComplete}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Studio completion progress"
            />
          </div>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-[#5C6678]">Time on Task</span>
          <span className="text-[#27E36A] font-bold">{timeOnTask} min</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-[#5C6678]">Rotations</span>
          <span className="text-[#E6EAF0] font-bold">
            {completedCount}/{totalCount}
          </span>
        </div>
      </div>
    </div>
  );
}

// ---- NCAA Compliance Panel Component ----
function NCAACompliancePanel(props: { tasks: string[] }) {
  const { tasks } = props;

  return (
    <div className="p-4 bg-[#0F141B] border border-[#1C2430] rounded-lg">
      <h3 className="font-oswald uppercase font-bold text-[#E6EAF0] mb-3">NCAA Tasks</h3>
      {tasks.length === 0 ? (
        <p className="text-sm text-[#5C6678]">No tasks due this week</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task, i) => (
            <li key={i} className="flex items-start text-sm">
              <span className="text-[#FFC53D] mr-2">▸</span>
              <span className="text-[#E6EAF0]">{task}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 pt-3 border-t border-[#1C2430]">
        <p className="text-xs text-[#5C6678]">
          Core course status and counselor notes available in full NCAA dashboard
        </p>
      </div>
    </div>
  );
}

// ---- AthleteAI Integration Component ----
function AthleteAIIntegration(props: {
  sleepScore: number;
  readiness: number;
  trainingLoad: number;
}) {
  const { sleepScore, readiness, trainingLoad } = props;

  const getReadinessColor = (score: number) => {
    if (score >= 8) return '#27E36A';
    if (score >= 6) return '#FFC53D';
    return '#FF4D4F';
  };

  return (
    <div className="p-4 bg-[#0F141B] border border-[#1C2430] rounded-lg">
      <h3 className="font-oswald uppercase font-bold text-[#E6EAF0] mb-3">AthleteAI Insights</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#5C6678]">Readiness</span>
          <span
            className="text-2xl font-bold"
            style={{ color: getReadinessColor(readiness) }}
            aria-label={`Readiness score: ${readiness} out of 10`}
          >
            {readiness}/10
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#5C6678]">Sleep Score</span>
          <span className="text-xl font-bold text-[#00D4FF]">{sleepScore}/10</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#5C6678]">Training Load</span>
          <span className="text-xl font-bold text-[#FF4D4F]">{trainingLoad}/10</span>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-[#1C2430]">
        <p className="text-xs text-[#5C6678]">
          Today&apos;s workload is adjusted based on your recovery metrics
        </p>
      </div>
    </div>
  );
}

// ---- Main Studio Dashboard Component ----
export function StudioDashboard() {
  const { user, isLoaded } = useUser();
  const [todayStudio, setTodayStudio] = useState<DailyStudio | null>(null);
  const [loading, setLoading] = useState(true);
  const [completionStatus, setCompletionStatus] = useState<
    Record<SubjectKey | 'synthesis', boolean>
  >({
    math: false,
    ela: false,
    science: false,
    socialStudies: false,
    synthesis: false,
  });
  const [timeOnTask, setTimeOnTask] = useState(0);

  useEffect(() => {
    // Track page view
    if (typeof window !== 'undefined' && window.posthog) {
      const isMarketing = new URLSearchParams(window.location.search).get('marketing') === '1';
      window.posthog.capture('studio_view', {
        marketing: isMarketing,
        userId: user?.id,
      });
    }

    // Fetch today's studio
    const qs = typeof window !== 'undefined' ? window.location.search : '';
    fetch(`/api/studio/today${qs}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setTodayStudio(data);
        setLoading(false);
      })
      .catch(() => {
        setTodayStudio(null);
        setLoading(false);
      });
  }, [user?.id]);

  // Calculate time on task (simulate increment every minute for demo)
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOnTask((prev) => prev + 1);
    }, 60000); // 1 minute
    return () => clearInterval(interval);
  }, []);

  const completedCount = Object.values(completionStatus).filter(Boolean).length;
  const totalTasks = 5; // 4 rotations + synthesis

  if (!isLoaded || loading) {
    return (
      <div className="bg-[#0B0F14] text-[#E6EAF0] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D4FF] mx-auto mb-4" />
          <p className="text-[#5C6678]">Loading studio...</p>
        </div>
      </div>
    );
  }

  if (!todayStudio) {
    return (
      <div className="bg-[#0B0F14] text-[#E6EAF0] min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold font-oswald uppercase mb-4">No Studio Today</h2>
          <p className="text-[#5C6678]">
            There is no studio scheduled for today. Check back tomorrow or contact your instructor.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0F14] text-[#E6EAF0] min-h-screen p-6">
      {/* Header Stats */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        role="region"
        aria-label="Studio overview metrics"
      >
        <div className="bg-[#0F141B] rounded-xl p-6 border border-[#1C2430]">
          <h3 className="text-lg font-bold font-oswald uppercase mb-2 text-[#5C6678]">
            Today&apos;s Readiness
          </h3>
          <div
            className="text-4xl font-bold text-[#27E36A]"
            aria-label={`Readiness score: ${todayStudio.athleteAIData.readiness} out of 10`}
          >
            {todayStudio.athleteAIData.readiness}/10
          </div>
          <div className="text-sm text-[#5C6678] mt-2">Based on sleep & recovery</div>
        </div>

        <div className="bg-[#0F141B] rounded-xl p-6 border border-[#1C2430]">
          <h3 className="text-lg font-bold font-oswald uppercase mb-2 text-[#5C6678]">
            Studio Progress
          </h3>
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold text-[#00D4FF]">
              {completedCount}/{totalTasks}
            </div>
            <div
              className="w-16 h-2 bg-[#1C2430] rounded-full overflow-hidden"
              aria-hidden="true"
            >
              <div
                className="h-full bg-[#00D4FF] transition-all duration-300"
                style={{ width: `${(completedCount / totalTasks) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-[#0F141B] rounded-xl p-6 border border-[#1C2430]">
          <h3 className="text-lg font-bold font-oswald uppercase mb-2 text-[#5C6678]">
            NCAA Tasks
          </h3>
          <div className="text-4xl font-bold text-[#FFC53D]">
            {todayStudio.ncaaTasks.length}
          </div>
          <div className="text-sm text-[#5C6678] mt-2">This week</div>
        </div>

        <div className="bg-[#0F141B] rounded-xl p-6 border border-[#1C2430]">
          <h3 className="text-lg font-bold font-oswald uppercase mb-2 text-[#5C6678]">
            Training Load
          </h3>
          <div className="text-4xl font-bold text-[#FF4D4F]">
            {todayStudio.athleteAIData.trainingLoad}/10
          </div>
          <div className="text-sm text-[#5C6678] mt-2">Today&apos;s intensity</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Studio Content */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-[#0F141B] rounded-xl p-6 border border-[#1C2430]">
            {/* Title */}
            <h1 className="text-3xl font-bold font-oswald uppercase mb-2">{todayStudio.theme}</h1>
            <p className="text-lg text-[#00D4FF] mb-6 font-inter">
              {todayStudio.drivingQuestion}
            </p>

            {/* Prime Section */}
            <div className="mb-6 p-4 bg-[#1C2430] rounded-lg" aria-live="polite">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[#E6EAF0] font-oswald uppercase">
                  🎯 Prime (0:00–0:10)
                </h3>
                <span className="text-sm bg-[#27E36A] text-[#0B0F14] px-3 py-1 rounded font-bold">
                  READY
                </span>
              </div>
              <p className="text-sm text-[#5C6678]">
                Review agenda, connect to prior learning, set today&apos;s 3 priorities
              </p>
            </div>

            {/* Rotation Cards */}
            <div className="space-y-4">
              {(Object.keys(todayStudio.rotations) as SubjectKey[]).map((subject) => (
                <RotationCard
                  key={subject}
                  subject={subject}
                  rotation={todayStudio.rotations[subject]}
                  completed={completionStatus[subject]}
                  onComplete={() =>
                    setCompletionStatus((prev) => ({ ...prev, [subject]: true }))
                  }
                />
              ))}
            </div>

            {/* Synthesis Section */}
            <div className="mt-6 p-4 bg-[#1C2430] rounded-lg border-l-4 border-[#27E36A]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[#E6EAF0] font-oswald uppercase">
                  🧠 Synthesis (2:45–3:00)
                </h3>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.posthog) {
                      window.posthog.capture('synthesis_complete');
                    }
                    setCompletionStatus((p) => ({ ...p, synthesis: true }));
                  }}
                  className={`px-4 py-2 rounded font-bold text-sm font-oswald uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-[#00D4FF] focus:ring-offset-2 focus:ring-offset-[#0B0F14] ${
                    completionStatus.synthesis
                      ? 'bg-[#27E36A] text-[#0B0F14] cursor-default'
                      : 'bg-[#00D4FF] text-[#0B0F14] hover:bg-[#00B8E6]'
                  }`}
                  aria-label={`${completionStatus.synthesis ? 'Synthesis completed' : 'Start synthesis'}`}
                >
                  {completionStatus.synthesis ? '✓ Completed' : 'Start Synthesis'}
                </button>
              </div>
              <p className="text-sm text-[#5C6678]">
                Connect today&apos;s learning across subjects. How does this apply to your sport, training,
                and future goals?
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Tools & Insights */}
        <div className="space-y-6">
          <ProgressTracker
            timeOnTask={timeOnTask}
            completedCount={completedCount}
            totalCount={totalTasks}
          />
          <NCAACompliancePanel tasks={todayStudio.ncaaTasks} />
          <AthleteAIIntegration
            sleepScore={todayStudio.athleteAIData.sleepScore}
            readiness={todayStudio.athleteAIData.readiness}
            trainingLoad={todayStudio.athleteAIData.trainingLoad}
          />
        </div>
      </div>

      {/* Compliance Footer */}
      <div className="mt-12 pt-6 border-t border-[#1C2430]">
        <p className="text-xs text-[#5C6678] leading-relaxed">
          <strong>Compliance Notice:</strong> Go4it is a homeschool learning provider with American
          teachers. Credits and official transcripts are issued via U.S. school-of-record partners
          until Fall 2026. Athlete OS and GAR Testing are non-academic and do not grant credit. No
          recruiting guarantees. NCAA amateurism and FIFA/FA rules respected. Families remain
          responsible for local education registration. We do not provide immigration or legal advice.
        </p>
      </div>
    </div>
  );
}
