'use client';

import useSWR from 'swr';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Shield, Trophy, Clock, TrendingUp, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface TodayTilesProps {
  studentId: string;
}

export function TodayTiles({ studentId }: TodayTilesProps) {
  // Fetch study hall data
  const { data: studyData } = useSWR(
    `/api/study?studentId=${studentId}`,
    fetcher,
    { refreshInterval: 30000 } // Refresh every 30s
  );

  // Fetch NCAA checklist data
  const { data: ncaaData } = useSWR(
    `/api/ncaa?studentId=${studentId}`,
    fetcher,
    { refreshInterval: 60000 } // Refresh every minute
  );

  // Fetch GAR score data
  const { data: garData } = useSWR(
    `/api/gar/latest?studentId=${studentId}`,
    fetcher,
    { refreshInterval: 300000 } // Refresh every 5 minutes
  );

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {/* Classes Progress Tile */}
      <Card className="border-slate-700 bg-slate-800/50">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center gap-2 text-base text-white">
            <BookOpen className="h-4 w-4 text-cyan-400" />
            Classes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold text-white">
            {/* Placeholder - will be connected to courses API */}
            On-Track
          </div>
          <p className="text-sm text-slate-400">
            Progress tracking coming soon
          </p>
        </CardContent>
      </Card>

      {/* NCAA Checklist Tile */}
      <Card className="border-slate-700 bg-slate-800/50">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center gap-2 text-base text-white">
            <Shield className="h-4 w-4 text-blue-400" />
            NCAA
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {ncaaData?.success ? (
            <>
              <div className="text-2xl font-bold text-white">
                {ncaaData.stats.done}/{ncaaData.stats.total}
              </div>
              <p className="text-sm text-slate-400">
                {ncaaData.stats.completionRate}% complete
              </p>
            </>
          ) : (
            <div className="text-sm text-slate-400">Loading...</div>
          )}
        </CardContent>
      </Card>

      {/* GAR Score Tile */}
      <Card className="border-slate-700 bg-slate-800/50">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center gap-2 text-base text-white">
            <Trophy className="h-4 w-4 text-yellow-400" />
            GAR™
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {garData?.success && garData.score ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">
                  {garData.score.overallScore}
                </span>
                <span className="text-yellow-400">
                  {'★'.repeat(garData.score.stars)}
                </span>
              </div>
              <p className="text-sm text-slate-400">
                Latest score
              </p>
            </>
          ) : (
            <div className="text-sm text-slate-400">
              No scores yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Study Hall Timer Tile */}
      <StudyTimer studentId={studentId} studyData={studyData} />
    </div>
  );
}

function StudyTimer({ studentId, studyData }: { studentId: string; studyData: any }) {
  const [logging, setLogging] = useState(false);

  async function logStudyTime(minutes: number) {
    setLogging(true);
    try {
      await fetch('/api/study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, minutes }),
      });
      // SWR will auto-refresh the data
    } catch (error) {
      alert('Failed to log study time');
    } finally {
      setLogging(false);
    }
  }

  return (
    <Card className="border-slate-700 bg-slate-800/50">
      <CardHeader className="p-4">
        <CardTitle className="flex items-center gap-2 text-base text-white">
          <Clock className="h-4 w-4 text-green-400" />
          Study Hall
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        {/* Quick log buttons */}
        <div className="flex flex-wrap gap-2">
          {[30, 45, 60].map((m) => (
            <Button
              key={m}
              size="sm"
              variant="outline"
              onClick={() => logStudyTime(m)}
              disabled={logging}
              className="border-green-400/30 text-green-400 hover:bg-green-400/10"
            >
              +{m}m
            </Button>
          ))}
        </div>

        {/* Stats */}
        {studyData?.success ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-3 w-3 text-green-400" />
              <span className="text-slate-300">
                {studyData.stats.streak} day streak
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-3 w-3 text-green-400" />
              <span className="text-slate-300">
                {studyData.stats.totalHours}h total
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400">
            Log minutes with one tap
          </p>
        )}
      </CardContent>
    </Card>
  );
}
