import { createVideoAnalysis, getUserVideoAnalyses } from '@/server/routes';

export async function POST(request: Request) {
  return createVideoAnalysis(request as any);
}

export async function GET(request: Request) {
  return getUserVideoAnalyses(request as any);
}
