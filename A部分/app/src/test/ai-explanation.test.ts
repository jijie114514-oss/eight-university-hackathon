import { describe, expect, it, vi } from 'vitest';
import { explainResult, explanationFacts } from '@/lib/ai/explain';
import { analyzeJourney } from '@/lib/journey/analysis';
import { handleTeamJourneyRequest } from '@/lib/api/team-journey-handler';
import { decodeTeamResult } from '@/components/d-team/contract';
const request = { origin: 'central-exchange-square', destination: 'futian-station-sz', departAt: '2026-10-17T08:00:00+08:00', mode: 'balanced' as const, scenario: 'normal' as const };
const completed = (content: string, finish_reason = 'stop') => new Response(JSON.stringify({ choices: [{ finish_reason, message: { content } }] }));
describe('真實模型解讀邊界', () => {
  it('只送出精簡事實，不傳座標，成功時不改寫原計算結果', async () => {
    const result = await analyzeJourney(request);
    const before = structuredClone(result);
    const mock = vi.fn<typeof fetch>().mockResolvedValue(completed('本次為演示資料，請依比較結果選擇行程，出發前核實官方資訊。'));
    const ai = await explainResult(result, { fetch: mock, key: 'test-key' });
    expect(ai.status).toBe('generated');
    expect(result).toEqual(before);
    const [url, init] = mock.mock.calls[0]!;
    expect(url).toBe('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions');
    expect(init?.headers).toMatchObject({ Authorization: 'Bearer test-key' });
    expect(init?.body).not.toContain('test-key');
    expect(JSON.stringify(explanationFacts(result))).not.toMatch(/"lat"|"lon"|"geometry"/);
    expect(init?.signal).toBeInstanceOf(AbortSignal);
  });
  it('未配置時不發請求', async () => {
    const mock = vi.fn<typeof fetch>();
    expect((await explainResult(await analyzeJourney(request), { key: '', fetch: mock })).status).toBe('not_configured');
    expect(mock).not.toHaveBeenCalled();
  });
  it.each([401, 429, 500])('供應商 %s 時保留規則結果，不洩漏錯誤內容', async status => {
    const ai = await explainResult(await analyzeJourney(request), { key: 'test-key', fetch: vi.fn<typeof fetch>().mockResolvedValue(new Response('private upstream detail', { status })) });
    expect(ai.status).toBe('unavailable');
    expect(JSON.stringify(ai)).not.toMatch(/test-key|private/);
  });
  it.each(['', '建議再等987654分鐘', '準時機率為99%', 'ok'])('拒絕空白、新增數字、概率和截斷輸出 %s', async text => {
    const ai = await explainResult(await analyzeJourney(request), { key: 'test-key', fetch: vi.fn<typeof fetch>().mockResolvedValue(completed(text, text === 'ok' ? 'length' : 'stop')) });
    expect(ai.status).toBe('unavailable');
  });
  it('網路或逾時失敗採可辨識回退', async () => {
    const ai = await explainResult(await analyzeJourney(request), { key: 'test-key', fetch: vi.fn<typeof fetch>().mockRejectedValue(new DOMException('secret', 'TimeoutError')) });
    expect(ai.status).toBe('unavailable');
  });
  it('團隊頁契約接受並保留新增的AI欄位', async () => {
    const result = await handleTeamJourneyRequest(request);
    expect(result.status).toBe(400); // formal contract deliberately rejects demo scenario
    const { scenario: _scenario, ...formal } = request;
    const response = await handleTeamJourneyRequest(formal);
    const body = response.body as Record<string, unknown>;
    const ai = { status: 'generated', text: '請核實官方資訊。', model: 'qwen-plus' };
    expect(decodeTeamResult({ ...body, aiExplanation: ai }).aiExplanation).toEqual(ai);
  });
});
