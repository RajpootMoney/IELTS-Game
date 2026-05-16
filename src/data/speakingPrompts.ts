import { TargetBand } from '../types/progress.types';

export interface SpeakingPrompt {
  id: string;
  band: TargetBand;
  part: 1 | 2 | 3;
  topic: string;
  question: string;
  discourseMarkers: string[];
  sampleOpener: string;
  tip: string;
}

export const speakingPrompts: SpeakingPrompt[] = [
  {
    id: 's1',
    band: 5,
    part: 1,
    topic: 'Hometown',
    question: 'What do you like most about the place where you live?',
    discourseMarkers: ['Well,', 'To be honest,', 'For example,'],
    sampleOpener: 'Well, what I like most about my hometown is...',
    tip: 'Extend with one reason + one example. Aim for 3–4 sentences in 30 seconds.',
  },
  {
    id: 's2',
    band: 6,
    part: 2,
    topic: 'Describe a skill',
    question: 'Describe a skill you would like to learn. You should say what it is, why you want it, and how you would learn it.',
    discourseMarkers: ['Firstly,', 'Moreover,', 'In the end,'],
    sampleOpener: "I'd like to talk about learning photography...",
    tip: 'Part 2: cover all bullet points. Use Firstly / Moreover to structure.',
  },
  {
    id: 's3',
    band: 7,
    part: 3,
    topic: 'Technology & society',
    question: 'Do you think technology has made communication better or worse?',
    discourseMarkers: ['On the one hand,', 'On the other hand,', 'Overall,'],
    sampleOpener: 'On the one hand, technology has clearly made it easier to...',
    tip: 'Part 3: give a balanced view, then a clear Overall conclusion.',
  },
  {
    id: 's4',
    band: 6,
    part: 1,
    topic: 'Study habits',
    question: 'How do you usually prepare for an important exam?',
    discourseMarkers: ['Generally speaking,', 'In addition,', 'As a result,'],
    sampleOpener: 'Generally speaking, I prepare by making a study plan...',
    tip: 'Avoid fillers (um, like). Pause briefly instead — examiners prefer silence to noise.',
  },
];

export function pickSpeakingPrompt(band: TargetBand): SpeakingPrompt {
  const pool = speakingPrompts.filter((p) => p.band <= band + 1);
  return pool[Math.floor(Math.random() * pool.length)];
}

export const SPEAKING_DURATION_SEC = 45;
