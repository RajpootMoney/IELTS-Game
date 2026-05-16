export type TargetBand = 5 | 6 | 7 | 8;

export type WeakTag =
  | 'listening-prediction'
  | 'listening-detail'
  | 'reading-tfng'
  | 'reading-skimming'
  | 'writing-grammar'
  | 'writing-structure'
  | 'speaking-fluency'
  | 'speaking-vocabulary'
  | 'vocabulary-range'
  | 'collocations';

export interface UserProgress {
  targetBand: TargetBand;
  onboardingComplete: boolean;
  missionsCompleted: string[];
  dailyStreak: number;
  lastDailyDate: string | null;
  dailyMixCompletedToday: boolean;
  weakTags: Partial<Record<WeakTag, number>>;
  totalXp: number;
}

export const DEFAULT_PROGRESS: UserProgress = {
  targetBand: 6,
  onboardingComplete: false,
  missionsCompleted: [],
  dailyStreak: 0,
  lastDailyDate: null,
  dailyMixCompletedToday: false,
  weakTags: {},
  totalXp: 0,
};

export interface MissionResult {
  missionId: string;
  correct: boolean;
  weakTags?: WeakTag[];
  xpEarned: number;
}
