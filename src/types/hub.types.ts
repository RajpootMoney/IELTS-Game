import { TargetBand } from './progress.types';

export type SkillZone = 'vocab' | 'listening' | 'reading' | 'writing' | 'speaking';

export interface ZoneInfo {
  id: SkillZone;
  title: string;
  subtitle: string;
  icon: string;
  accent: 'cyan' | 'pink' | 'yellow' | 'green' | 'purple';
  missionCount: number;
}

export interface MissionInfo {
  id: string;
  zone: SkillZone;
  title: string;
  description: string;
  durationMin: number;
  minBand: TargetBand;
  xpReward: number;
}

export type DailyMixStep = 'listening' | 'reading' | 'writing' | 'speaking';

export interface DailyMixStepResult {
  step: DailyMixStep;
  correct: boolean;
  weakTags: import('./progress.types').WeakTag[];
}
