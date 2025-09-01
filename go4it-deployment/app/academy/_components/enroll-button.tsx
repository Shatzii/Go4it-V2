'use client';
import { useTransition, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface Props {
  courseId: string;
  initialEnrolled?: boolean;
  onEnrolled?: () => void;
}

export function EnrollButton({ courseId, initialEnrolled, onEnrolled }: Props) {
  const [enrolled, setEnrolled] = useState(!!initialEnrolled);
  const [pending, start] = useTransition();

  const handleClick = () => {
    if (enrolled) return; // later could navigate
    start(async () => {
      try {
        const meRes = await fetch('/api/auth/me');
        const meJson = await meRes.json();
        const studentId = meJson?.user?.id;
        if (!studentId) throw new Error('No user');
        const res = await fetch('/api/academy/enroll', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId, courseId }),
        });
        if (!res.ok) throw new Error('Enroll failed');
        setEnrolled(true);
        onEnrolled?.();
        toast?.({ title: 'Enrolled', description: 'Enrollment successful.' });
      } catch (e: any) {
        toast?.({ title: 'Enrollment failed', description: e.message, variant: 'destructive' });
      }
    });
  };

  return (
    <Button
      onClick={handleClick}
      disabled={pending || enrolled}
      className={`flex-1 ${enrolled ? 'bg-green-600 hover:bg-green-700' : ''}`}
    >
      {pending ? 'Enrolling...' : enrolled ? 'Enrolled' : 'Enroll'}
    </Button>
  );
}
