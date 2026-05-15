import { TreeGenerateRequest, ExploreNode, NodeType } from '../types/explore';
import { TrendContext } from './rss-scout';
import { buildRootPrompt, buildBranchPrompt } from './prompts/explore-tree';
import { generateFallbackTreeNodes } from './explore-fallback';

function stripEmojis(text: string): string {
  // Remove emoji surrogate pairs: high surrogates D83C-D83E followed by any low surrogate
  // plus standalone emoji ranges in BMP
  return text
    .replace(
      /[\uD83C-\uD83E][\uDC00-\uDFFF]|[☀-➿︀-️‍⃣]/g,
      '',
    )
    .trim();
}

const nodeTypes: NodeType[] = ['related', 'contrast', 'deep', 'growth', 'shadow'];

function normalizeNodeType(value: unknown): NodeType {
  return nodeTypes.includes(value as NodeType) ? value as NodeType : 'related';
}

export async function generateTreeNodes(
  request: TreeGenerateRequest,
  trendContext?: TrendContext | null,
): Promise<ExploreNode[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const baseUrl = process.env.LLM_BASE_URL || 'https://api.z.ai/api/anthropic';
  const model = process.env.LLM_MODEL || 'glm-5-turbo';
  const timeoutMs = Number(process.env.LLM_TIMEOUT_MS ?? 8000);

  if (!apiKey) return generateFallbackTreeNodes(request);

  const { systemPrompt, userPrompt } =
    request.depth === 0
      ? buildRootPrompt(request.mbtiType, trendContext ?? undefined)
      : buildBranchPrompt(request, trendContext ?? undefined);

  const requestBody = {
    model,
    max_tokens: 4096,
    messages: [{ role: 'user', content: userPrompt }],
    system: systemPrompt,
  };

  const maxRetries = 0;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

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
      if (!content) throw new Error('Empty response from LLM');

      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON object found in response');

        const parsed = JSON.parse(jsonMatch[0]);
        const nodes = parsed.nodes ?? parsed;

        if (!Array.isArray(nodes) || nodes.length < 3) {
          throw new Error('Invalid node array structure');
        }

        const maxNodes = request.depth === 0 ? 34 : 6;

        return nodes.slice(0, maxNodes).map((node: Partial<ExploreNode>, i: number) => ({
          ...node,
          id: node.id || `node-${request.depth}-${i}`,
          text: stripEmojis(node.text || ''),
          description: stripEmojis(node.description || ''),
          nodeType: normalizeNodeType(node.nodeType),
          parentId: request.depth === 0 ? null : (request.parentNode?.id ?? null),
          features: (node.features ?? []).map(stripEmojis),
          strengths: (node.strengths ?? []).map(stripEmojis),
          cautions: (node.cautions ?? []).map(stripEmojis),
          relatedThemes: (node.relatedThemes ?? []).map(stripEmojis),
          opposingThemes: (node.opposingThemes ?? []).map(stripEmojis),
        }));
      } catch (parseError) {
        if (attempt === maxRetries) {
          console.warn(`Failed to parse LLM response, using fallback nodes: ${parseError}`);
          return generateFallbackTreeNodes(request);
        }
      }
    } catch (error) {
      if (attempt === maxRetries) {
        console.warn(`LLM request failed, using fallback nodes: ${error}`);
        return generateFallbackTreeNodes(request);
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  return generateFallbackTreeNodes(request);
}
