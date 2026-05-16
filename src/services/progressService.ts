import {
  UserProgress,
  DEFAULT_PROGRESS,
  WeakTag,
  MissionResult,
  TargetBand,
} from '../types/progress.types';
import { DailyMixStepResult } from '../types/hub.types';

const STORAGE_KEY = 'ielts-band-quest-progress';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(progress: UserProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function setTargetBand(band: TargetBand): UserProgress {
  const p = loadProgress();
  const updated = { ...p, targetBand: band, onboardingComplete: true };
  saveProgress(updated);
  return updated;
}

export function recordWeakTags(progress: UserProgress, tags: WeakTag[]): UserProgress {
  const weakTags = { ...progress.weakTags };
  for (const tag of tags) {
    weakTags[tag] = (weakTags[tag] ?? 0) + 1;
  }
  return { ...progress, weakTags };
}

export function completeMission(progress: UserProgress, result: MissionResult): UserProgress {
  const missionsCompleted = progress.missionsCompleted.includes(result.missionId)
    ? progress.missionsCompleted
    : [...progress.missionsCompleted, result.missionId];

  let updated: UserProgress = {
    ...progress,
    missionsCompleted,
    totalXp: progress.totalXp + result.xpEarned,
  };

  if (result.weakTags?.length) {
    updated = recordWeakTags(updated, result.weakTags);
  }

  saveProgress(updated);
  return updated;
}

export function completeDailyMixWithResults(
  progress: UserProgress,
  results: DailyMixStepResult[],
  xp: number
): UserProgress {
  let updated = progress;
  for (const r of results) {
    if (r.weakTags.length > 0) {
      updated = recordWeakTags(updated, r.weakTags);
    }
  }
  return completeDailyMix(updated, xp);
}

export function completeDailyMix(progress: UserProgress, xp: number): UserProgress {
  const today = todayKey();
  const isNewDay = progress.lastDailyDate !== today;
  const streak = isNewDay
    ? progress.lastDailyDate
      ? progress.dailyStreak + 1
      : 1
    : progress.dailyStreak;

  const updated: UserProgress = {
    ...progress,
    lastDailyDate: today,
    dailyStreak: streak,
    dailyMixCompletedToday: true,
    totalXp: progress.totalXp + xp,
  };
  saveProgress(updated);
  return updated;
}

export function getTopWeaknesses(progress: UserProgress, limit = 3): { tag: WeakTag; count: number }[] {
  return (Object.entries(progress.weakTags) as [WeakTag, number][])
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }));
}

export function weakTagLabel(tag: WeakTag): string {
  const labels: Record<WeakTag, string> = {
    'listening-prediction': 'Listening — prediction',
    'listening-detail': 'Listening — specific detail',
    'reading-tfng': 'Reading — True / False / Not Given',
    'reading-skimming': 'Reading — skimming for gist',
    'writing-grammar': 'Writing — grammar accuracy',
    'writing-structure': 'Writing — essay structure',
    'speaking-fluency': 'Speaking — fluency & fillers',
    'speaking-vocabulary': 'Speaking — vocabulary range',
    'vocabulary-range': 'Vocabulary — word choice',
    collocations: 'Vocabulary — collocations',
  };
  return labels[tag] ?? tag;
}
