import { NextRequest, NextResponse } from 'next/server';
import { generateTreeNodes } from '../../../../src/lib/llm-client';
import { TreeGenerateRequest } from '../../../../src/types/explore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as TreeGenerateRequest;

    if (!body.mbtiType || typeof body.depth !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request: mbtiType and depth are required' },
        { status: 400 },
      );
    }

    if (!/^[EI][SN][TF][JP]$/.test(body.mbtiType) || body.depth < 0 || body.depth > 8) {
      return NextResponse.json(
        { error: 'Invalid request: unsupported mbtiType or depth' },
        { status: 400 },
      );
    }

    if (body.depth > 0 && !body.parentNode) {
      return NextResponse.json(
        { error: 'Invalid request: parentNode is required for depth > 0' },
        { status: 400 },
      );
    }

    const nodes = await generateTreeNodes({
      mbtiType: body.mbtiType,
      depth: body.depth,
      parentNode: body.parentNode,
      pathHistory: body.pathHistory,
    });

    return NextResponse.json({ nodes });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Explore generate error:', message);

    if (message.includes('API_KEY') || message.includes('not configured')) {
      return NextResponse.json(
        { error: 'LLM service is not configured' },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate nodes' },
      { status: 500 },
    );
  }
}
