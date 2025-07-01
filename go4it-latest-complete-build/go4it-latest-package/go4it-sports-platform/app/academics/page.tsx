'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

interface AcademicProgress {
  gpa: number;
  eligibilityStatus: string;
  coursesCompleted: number;
  coursesRequired: number;
}

export default function AcademicsPage() {
  const { isLoaded, userId } = useAuth();
  const [progress, setProgress] = useState<AcademicProgress | null>(null);

  useEffect(() => {
    if (isLoaded && userId) {
      fetch('/api/academic/progress')
        .then(res => res.json())
        .then(setProgress);
    }
  }, [isLoaded, userId]);

  return (
    <div>
      <h1>Academic Progress Tracker</h1>
      {progress ? (
        <div>
          <p>GPA: {progress.gpa}</p>
          <p>Eligibility Status: {progress.eligibilityStatus}</p>
          <p>Courses Completed: {progress.coursesCompleted}</p>
          <p>Courses Required: {progress.coursesRequired}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}