import { notFound } from 'next/navigation';
import LiveRoom from '@/components/live-events/LiveRoom';
import { db } from '@/lib/db';
import { liveEvents } from '@/lib/db/live-events-schema';
import { eq } from 'drizzle-orm';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Parent Night - Go4It Sports',
  description: 'Join the live parent night session',
};

export default async function LiveEventPage({ 
  params 
}: { 
  params: Promise<{ roomId: string }> 
}) {
  const { roomId } = await params;
  
  // Fetch event details
  const [event] = await db
    .select()
    .from(liveEvents)
    .where(eq(liveEvents.roomId, roomId))
    .limit(1);

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <LiveRoom event={{
        id: event.id,
        title: event.title,
        description: event.description || '',
        roomId: event.roomId,
        status: event.status,
        startTime: event.startTime,
        endTime: event.endTime,
        allowChat: event.allowChat ?? true,
        allowQA: event.allowQA ?? true
      }} />
    </div>
  );
}
