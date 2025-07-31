import { authRegister } from '@/server/routes';

export async function POST(request: Request) {
  return authRegister(request as any);
}