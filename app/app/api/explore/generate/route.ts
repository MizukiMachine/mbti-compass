import { NextRequest, NextResponse } from 'next/server';
import { generateExplorationCards } from '../../../../src/lib/llm-client';
import { getTrendContext } from '../../../../src/lib/rss-scout';
import { GenerateRequest } from '../../../../src/types/explore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as GenerateRequest;

    if (!body.mbtiType || typeof body.phase !== 'number' || !Array.isArray(body.selectionHistory)) {
      return NextResponse.json(
        { error: 'Invalid request: mbtiType, phase, and selectionHistory are required' },
        { status: 400 }
      );
    }

    if (body.phase < 2) {
      return NextResponse.json(
        { error: 'Invalid phase: must be 2 or higher' },
        { status: 400 }
      );
    }

    const trendContext = await getTrendContext().catch(() => null);

    const cards = await generateExplorationCards({
      mbtiType: body.mbtiType,
      phase: body.phase,
      selectionHistory: body.selectionHistory,
    }, trendContext);

    return NextResponse.json({ cards });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Explore generate error:', message);

    if (message.includes('API_KEY') || message.includes('not configured')) {
      return NextResponse.json(
        { error: 'LLM service is not configured' },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate cards' },
      { status: 500 }
    );
  }
}
