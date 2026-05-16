import { TargetBand } from '../types/progress.types';

export interface ListeningDrill {
  id: string;
  band: TargetBand;
  context: string;
  transcript: string;
  question: string;
  answerType: 'number' | 'name' | 'noun' | 'adjective' | 'verb';
  options: string[];
  correctIndex: number;
  tip: string;
}

export const listeningDrills: ListeningDrill[] = [
  {
    id: 'l1',
    band: 5,
    context: 'Section 1 — Library membership',
    transcript:
      'The library card costs fifteen pounds per year, and you can borrow up to six books at a time.',
    question: 'How much does the library card cost per year?',
    answerType: 'number',
    options: ['5 pounds', '15 pounds', '50 pounds', '6 pounds'],
    correctIndex: 1,
    tip: 'Numbers are often spelled out AND said as digits. Predict "cost" → listen for a number.',
  },
  {
    id: 'l2',
    band: 6,
    context: 'Section 2 — Campus tour',
    transcript:
      'The science building is opposite the main cafeteria, next to the sports centre.',
    question: 'Where is the science building?',
    answerType: 'noun',
    options: ['Next to the library', 'Opposite the cafeteria', 'Behind the car park', 'Near the station'],
    correctIndex: 1,
    tip: 'Location questions: underline prepositions (opposite, next to) before audio plays.',
  },
  {
    id: 'l3',
    band: 7,
    context: 'Section 3 — Research discussion',
    transcript:
      'I think we should postpone the survey until after the pilot study is complete.',
    question: 'What does the speaker want to do with the survey?',
    answerType: 'verb',
    options: ['Cancel it', 'Postpone it', 'Expand it', 'Publish it'],
    correctIndex: 1,
    tip: 'Paraphrasing is common: "delay" = "postpone". Focus on meaning, not exact words.',
  },
  {
    id: 'l4',
    band: 6,
    context: 'Section 4 — Lecture excerpt',
    transcript:
      'Urbanisation has accelerated most dramatically in coastal regions of Southeast Asia.',
    question: 'Where has urbanisation increased most?',
    answerType: 'noun',
    options: ['European cities', 'Coastal Southeast Asia', 'Rural Africa', 'North America'],
    correctIndex: 1,
    tip: 'Academic lectures use synonyms: "accelerated" = increased quickly.',
  },
  {
    id: 'l5',
    band: 8,
    context: 'Section 3 — Essay planning',
    transcript:
      'Your thesis should address the economic implications, not merely describe the trend.',
    question: 'What should the thesis focus on?',
    answerType: 'noun',
    options: ['Historical background', 'Economic implications', 'Personal opinion', 'Graph description only'],
    correctIndex: 1,
    tip: 'Contrast signals ("not merely") often mark the correct answer.',
  },
];

// Fix band 7 drill - answerType 'verb' not in type - use noun
export function pickListeningDrill(band: TargetBand): ListeningDrill {
  const pool = listeningDrills.filter((d) => d.band <= band + 1);
  return pool[Math.floor(Math.random() * pool.length)];
}
