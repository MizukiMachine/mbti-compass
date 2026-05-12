import { DynamicCard, GenerateRequest } from '../types/explore';
import { TrendContext } from './rss-scout';
import { buildExplorePrompt } from './prompts/explore-cards';

export async function generateExplorationCards(request: GenerateRequest, trendContext?: TrendContext | null): Promise<DynamicCard[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const baseUrl = process.env.LLM_BASE_URL || 'https://api.z.ai/api/anthropic';
  const model = process.env.LLM_MODEL || 'glm-5-turbo';

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }

  const { systemPrompt, userPrompt } = buildExplorePrompt(request, trendContext ?? undefined);

  const requestBody = {
    model,
    max_tokens: 4096,
    messages: [{ role: 'user', content: userPrompt }],
    system: systemPrompt,
  };

  const maxRetries = 1;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const res = await fetch(`${baseUrl}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => 'Unknown error');
        throw new Error(`LLM API error (${res.status}): ${errorText}`);
      }

      const data = await res.json();
      const content = data.content?.[0]?.text;
      if (!content) {
        throw new Error('Empty response from LLM');
      }

      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON object found in response');

        const parsed = JSON.parse(jsonMatch[0]);
        const cards = parsed.cards ?? parsed;

        if (!Array.isArray(cards) || cards.length < 3) {
          throw new Error('Invalid card array structure');
        }

        return cards.map((card: DynamicCard, i: number) => ({
          ...card,
          id: card.id || `llm-${request.phase}-${i}`,
          sourceType: 'llm' as const,
        }));
      } catch (parseError) {
        if (attempt === maxRetries) {
          throw new Error(`Failed to parse LLM response after ${maxRetries + 1} attempts: ${parseError}`);
        }
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error('Unexpected error in generateExplorationCards');
}
