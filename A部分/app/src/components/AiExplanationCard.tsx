import type { AiExplanation } from '@/lib/types/ai';
export function AiExplanationCard({ value }: { value?: AiExplanation }) {
  if (!value) return null;
  return <section className="card journey-details dt-panel" aria-label="AI 行程解讀">
    <h2 className="text-base font-semibold">AI 行程解讀</h2>
    <p className="mt-1 text-xs text-slate-500">{value.status === 'generated' ? `${value.model} · 真實模型生成` : value.status === 'not_configured' ? '尚未啟用' : '服務暫時不可用'}</p>
    <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{value.text}</p>
    {value.status === 'generated' ? <p className="mt-2 text-xs text-slate-500">AI 只解釋本次計算結果；執行行程請以路線、時間、風險及官方資訊為準。</p> : null}
  </section>;
}
