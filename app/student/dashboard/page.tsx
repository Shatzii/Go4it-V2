'use client';

import React, { useEffect, useState } from 'react';

type Enrollment = { id: string; courseSlug: string; studentName: string; studentEmail: string; timestamp: string };

export default function StudentDashboard() {
  const [email, setEmail] = useState('');
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [filtered, setFiltered] = useState<Enrollment[]>([]);

  useEffect(() => {
    fetch('/api/academy/enroll')
      .then((r) => r.json())
      .then((d) => setEnrollments(d.enrollments || []))
      .catch((e) => console.error(e));
  }, []);

  useEffect(() => {
    setFiltered(email ? enrollments.filter((e) => e.studentEmail === email) : enrollments);
  }, [email, enrollments]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      <div className="mb-4">
        <label className="block">Filter by email</label>
        <input className="border p-2 w-full" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@example.com" />
      </div>

      <div>
        {filtered.map((e) => (
          <div key={e.id} className="border p-3 mb-3">
            <div className="text-sm text-gray-400">{new Date(e.timestamp).toLocaleString()}</div>
            <div className="font-semibold">{e.courseSlug}</div>
            <div>{e.studentName} — {e.studentEmail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
