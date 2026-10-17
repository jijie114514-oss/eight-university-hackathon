/** AI 解讀為附加文案，不能覆蓋行程與決策事實。 */
export interface AiExplanation {
  status: 'generated' | 'unavailable' | 'not_configured';
  text: string;
  model: string | null;
}
