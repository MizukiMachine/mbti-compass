import { NextRequest, NextResponse } from 'next/server';
import { createWorkplacePerson } from '../../../../src/data/workplace-presets';
import { generateWorkplaceAdvice, isAdviceActionId } from '../../../../src/lib/workplace-advice';
import { WorkplaceAdviceRequest, WorkplacePerson } from '../../../../src/types/workplace';

function toStringValue(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function toNumberValue(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.min(100, Math.max(0, Math.round(value)))
    : fallback;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Partial<WorkplaceAdviceRequest>;

    if (!body.selfMbti || !/^[EI][SN][TF][JP]$/.test(body.selfMbti)) {
      return NextResponse.json({ error: 'Invalid selfMbti' }, { status: 400 });
    }

    if (!isAdviceActionId(body.actionId)) {
      return NextResponse.json({ error: 'Invalid actionId' }, { status: 400 });
    }

    const rawPerson = body.person as Partial<WorkplacePerson> | undefined;
    if (!rawPerson?.id || !rawPerson.presetId) {
      return NextResponse.json({ error: 'Invalid person' }, { status: 400 });
    }

    const person = createWorkplacePerson({
      id: toStringValue(rawPerson.id, 'slot-person'),
      presetId: toStringValue(rawPerson.presetId),
      relationLabel: toStringValue(rawPerson.relationLabel, '職場の相手'),
      name: toStringValue(rawPerson.name),
      closeness: toNumberValue(rawPerson.closeness, 50),
      stress: toNumberValue(rawPerson.stress, 50),
      notes: toStringValue(rawPerson.notes),
    });

    const advice = await generateWorkplaceAdvice({
      selfMbti: body.selfMbti,
      selfName: toStringValue(body.selfName, 'ユーザー').slice(0, 80),
      person,
      actionId: body.actionId,
      userConcern: toStringValue(body.userConcern).slice(0, 1800),
    });

    return NextResponse.json(advice);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Workplace advice error:', message);
    return NextResponse.json({ error: 'Failed to generate workplace advice' }, { status: 500 });
  }
}
