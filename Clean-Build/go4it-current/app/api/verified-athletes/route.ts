import { getVerifiedAthletes } from '@/server/routes';

export async function GET(request: Request) {
  return getVerifiedAthletes(request as any);
}
