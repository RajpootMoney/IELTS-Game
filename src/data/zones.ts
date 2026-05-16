import { ZoneInfo, MissionInfo } from '../types/hub.types';

export const SKILL_ZONES: ZoneInfo[] = [
  {
    id: 'listening',
    title: 'Listening Lab',
    subtitle: 'Predict, hear, answer',
    icon: '🎧',
    accent: 'cyan',
    missionCount: 1,
  },
  {
    id: 'reading',
    title: 'Reading Grid',
    subtitle: 'Skim, scan, decide',
    icon: '📖',
    accent: 'pink',
    missionCount: 1,
  },
  {
    id: 'writing',
    title: 'Writing Forge',
    subtitle: 'Fix sentences, learn rules',
    icon: '✏️',
    accent: 'green',
    missionCount: 1,
  },
  {
    id: 'speaking',
    title: 'Speaking Booth',
    subtitle: 'Timed prompts & markers',
    icon: '🗣️',
    accent: 'yellow',
    missionCount: 1,
  },
  {
    id: 'vocab',
    title: 'Vocab Sector',
    subtitle: 'Arcade word invaders',
    icon: '🚀',
    accent: 'purple',
    missionCount: 4,
  },
];

export const MISSIONS: MissionInfo[] = [
  {
    id: 'listening-signal-hunt',
    zone: 'listening',
    title: 'Signal Hunt',
    description: 'Predict the answer type, then catch the detail from the transcript.',
    durationMin: 3,
    minBand: 5,
    xpReward: 80,
  },
  {
    id: 'reading-scanline',
    zone: 'reading',
    title: 'Scanline',
    description: 'True, False, or Not Given — under time pressure.',
    durationMin: 4,
    minBand: 5,
    xpReward: 80,
  },
  {
    id: 'writing-forge',
    zone: 'writing',
    title: 'Sentence Forge',
    description: 'Rewrite flawed sentences. Every mistake teaches a rule.',
    durationMin: 5,
    minBand: 5,
    xpReward: 100,
  },
  {
    id: 'speaking-booth',
    zone: 'speaking',
    title: 'Pressure Booth',
    description: '45-second answers with discourse markers.',
    durationMin: 3,
    minBand: 5,
    xpReward: 60,
  },
];

export const DAILY_MIX_XP = 150;
