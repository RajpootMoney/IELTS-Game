import { useState, useCallback } from 'react';
import { UserProgress, TargetBand, MissionResult } from '../types/progress.types';
import { DailyMixStepResult } from '../types/hub.types';
import {
  loadProgress,
  setTargetBand,
  completeMission,
  completeDailyMixWithResults,
} from '../services/progressService';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress());

  const refresh = useCallback(() => {
    setProgress(loadProgress());
  }, []);

  const chooseBand = useCallback((band: TargetBand) => {
    setProgress(setTargetBand(band));
  }, []);

  const recordMission = useCallback((result: MissionResult) => {
    setProgress(completeMission(loadProgress(), result));
  }, []);

  const finishDailyMix = useCallback((results: DailyMixStepResult[], xp: number) => {
    setProgress(completeDailyMixWithResults(loadProgress(), results, xp));
  }, []);

  return {
    progress,
    refresh,
    chooseBand,
    recordMission,
    finishDailyMix,
  };
}
