import { TargetBand } from '../types/progress.types';

export type TfngAnswer = 'true' | 'false' | 'not-given';

export interface ReadingDrill {
  id: string;
  band: TargetBand;
  passageTitle: string;
  passage: string;
  statement: string;
  correct: TfngAnswer;
  explanation: string;
}

export const readingDrills: ReadingDrill[] = [
  {
    id: 'r1',
    band: 5,
    passageTitle: 'City cycling scheme',
    passage:
      'The city introduced rental bicycles in 2019. Usage doubled in the first year. However, maintenance costs were higher than predicted, so fees increased in 2021.',
    statement: 'Cycling fees were raised because usage was too low.',
    correct: 'false',
    explanation:
      'FALSE: fees rose due to high maintenance costs, not low usage. Usage actually doubled.',
  },
  {
    id: 'r2',
    band: 6,
    passageTitle: 'Marine plastics',
    passage:
      'Most ocean plastic originates from rivers in Asia. Some researchers argue that consumer behaviour in wealthy nations still drives demand for single-use packaging produced there.',
    statement: 'All ocean plastic comes directly from Asian rivers.',
    correct: 'false',
    explanation:
      'FALSE: "most" ≠ "all". The passage also mentions demand from wealthy nations.',
  },
  {
    id: 'r3',
    band: 7,
    passageTitle: 'Remote work study',
    passage:
      'A 2022 survey found that 40% of employees preferred hybrid schedules. The report does not compare productivity with pre-2020 levels.',
    statement: 'The survey proved that hybrid work is more productive than office work.',
    correct: 'not-given',
    explanation:
      'NOT GIVEN: preference is mentioned; productivity comparison is explicitly not in the report.',
  },
  {
    id: 'r4',
    band: 6,
    passageTitle: 'Ancient irrigation',
    passage:
      'Archaeologists discovered channels dating to 3000 BCE. The system relied on seasonal flooding rather than mechanical pumps.',
    statement: 'The irrigation system used seasonal floods.',
    correct: 'true',
    explanation: 'TRUE: directly stated — "relied on seasonal flooding".',
  },
  {
    id: 'r5',
    band: 8,
    passageTitle: 'AI in education',
    passage:
      'Adaptive software can tailor exercises to individual learners. Critics warn it may reduce teacher autonomy, though no large-scale trials have measured long-term outcomes.',
    statement: 'Large-scale trials have confirmed long-term benefits of adaptive software.',
    correct: 'false',
    explanation:
      'FALSE: the passage says no large-scale trials have measured long-term outcomes.',
  },
];

export function pickReadingDrill(band: TargetBand): ReadingDrill {
  const pool = readingDrills.filter((d) => d.band <= band + 1);
  return pool[Math.floor(Math.random() * pool.length)];
}

export const TFNG_LABELS: Record<TfngAnswer, string> = {
  true: 'TRUE',
  false: 'FALSE',
  'not-given': 'NOT GIVEN',
};
