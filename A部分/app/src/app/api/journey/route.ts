import { explainResult } from '@/lib/ai/explain';
import { NextResponse } from 'next/server';
import { handleJourneyRequest } from '@/lib/api/journey-handler';
import { analyzeTransitJourney } from '@/lib/transit/service';
import { apiError } from '@/lib/api/errors';
export const dynamic = 'force-dynamic';
// 路线计算 + 外部交通接口 + 大模型解读，默认 10 秒函数超时不够用。
export const maxDuration = 60;
export async function POST(request: Request) {
  let input: unknown;
  try { input = await request.json(); } catch { return NextResponse.json(apiError('INVALID_INPUT', '請求內容必須是合法 JSON。'), { status: 400 }); }
  const result = await handleJourneyRequest(input, { transit: analyzeTransitJourney });
  if (result.status === 200 && !('error' in result.body)) {
    result.body.aiExplanation = await explainResult(result.body);
  }
  return NextResponse.json(result.body, { status: result.status, headers: { 'Cache-Control': 'no-store' } });
}
export function GET() { return NextResponse.json(apiError('METHOD_NOT_ALLOWED', '請以 POST 提交行程。'), { status: 405, headers: { Allow: 'POST' } }); }
