import { getAdminStats } from '@/server/routes';

export async function GET(request: Request) {
  return getAdminStats(request as any);
}