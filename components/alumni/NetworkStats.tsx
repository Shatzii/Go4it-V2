import { db } from '@/lib/db';
import { alumniProfiles, coachProfiles, mentorships, networkingEvents } from '@/lib/db/alumni-network-schema';
import { sql } from 'drizzle-orm';

export default async function NetworkStats() {
  try {
    // Count alumni
    const alumniCount = await db.select({ count: sql<number>`count(*)` })
      .from(alumniProfiles);

    // Count coaches
    const coachCount = await db.select({ count: sql<number>`count(*)` })
      .from(coachProfiles);

    // Count active mentorships
    const activeMentorships = await db.select({ count: sql<number>`count(*)` })
      .from(mentorships)
      .where(sql`status = 'active'`);

    // Count events
    const eventsCount = await db.select({ count: sql<number>`count(*)` })
      .from(networkingEvents);

    const stats = [
      {
        label: 'Alumni',
        value: alumniCount[0]?.count || 0,
        icon: (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ),
        color: 'from-blue-500 to-cyan-500',
      },
      {
        label: 'Coaches',
        value: coachCount[0]?.count || 0,
        icon: (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
        color: 'from-purple-500 to-pink-500',
      },
      {
        label: 'Active Mentorships',
        value: activeMentorships[0]?.count || 0,
        icon: (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
        color: 'from-green-500 to-emerald-500',
      },
      {
        label: 'Events Hosted',
        value: eventsCount[0]?.count || 0,
        icon: (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
        color: 'from-orange-500 to-red-500',
      },
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500 transition-all"
          >
            <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${stat.color} text-white mb-4`}>
              {stat.icon}
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stat.value.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>
    );
  } catch {
    return (
      <div className="text-center py-8 text-slate-400">
        <p>Unable to load network statistics</p>
      </div>
    );
  }
}
