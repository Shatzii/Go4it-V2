import { authMe } from '@/server/routes';

export async function GET(request: Request) {
  return authMe(request as any);
}