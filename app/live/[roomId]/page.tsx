import { notFound } from 'next/navigation';
import LiveRoom from '@/components/live-events/LiveRoom';
import { db } from '@/lib/db';
import { liveEvents } from '@/lib/db/live-events-schema';
import { eq } from 'drizzle-orm';

export const metadata = {
  title: 'Live Event | Go4It Sports',
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
      <LiveRoom event={event} />
    </div>
  );
}
