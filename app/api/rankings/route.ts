import { getAthleteRankings } from '@/server/routes';

export async function GET(request: Request) {
  return getAthleteRankings(request as any);
}
