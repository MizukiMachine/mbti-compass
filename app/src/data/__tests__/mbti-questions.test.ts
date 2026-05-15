import { calculateMbti, mbtiQuestions } from '../mbti-questions';

const axisPoles = {
  EI: ['E', 'I'],
  SN: ['S', 'N'],
  TF: ['T', 'F'],
  JP: ['J', 'P'],
} as const;

describe('mbtiQuestions', () => {
  it('has five valid questions per MBTI axis', () => {
    expect(mbtiQuestions).toHaveLength(20);

    const ids = new Set(mbtiQuestions.map((question) => question.id));
    expect(ids.size).toBe(mbtiQuestions.length);

    for (const axis of Object.keys(axisPoles) as Array<keyof typeof axisPoles>) {
      expect(mbtiQuestions.filter((question) => question.axis === axis)).toHaveLength(5);
    }

    for (const question of mbtiQuestions) {
      const poles = axisPoles[question.axis] as readonly string[];
      expect(poles).toContain(question.optionA.value);
      expect(poles).toContain(question.optionB.value);
      expect(question.optionA.value).not.toBe(question.optionB.value);
    }
  });

  it('mixes option positions to reduce first-choice bias', () => {
    for (const axis of Object.keys(axisPoles) as Array<keyof typeof axisPoles>) {
      const [firstPole, secondPole] = axisPoles[axis];
      const optionAValues = mbtiQuestions
        .filter((question) => question.axis === axis)
        .map((question) => question.optionA.value);

      expect(optionAValues.filter((value) => value === firstPole)).toHaveLength(3);
      expect(optionAValues.filter((value) => value === secondPole)).toHaveLength(2);
    }
  });
});

describe('calculateMbti', () => {
  it('scores answers by selected values regardless of option position', () => {
    const firstPoleAnswers: Record<number, string> = {};
    const secondPoleAnswers: Record<number, string> = {};

    for (const question of mbtiQuestions) {
      const [firstPole, secondPole] = axisPoles[question.axis];
      firstPoleAnswers[question.id] = firstPole;
      secondPoleAnswers[question.id] = secondPole;
    }

    expect(calculateMbti(firstPoleAnswers)).toBe('ESTJ');
    expect(calculateMbti(secondPoleAnswers)).toBe('INFP');
  });
});
