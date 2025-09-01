import { getDashboard } from '@/server/routes';

export async function GET(request: Request) {
  return getDashboard(request as any);
}
