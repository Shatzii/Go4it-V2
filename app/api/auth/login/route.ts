import { authLogin } from '@/server/routes';

export async function POST(request: Request) {
  return authLogin(request as any);
}