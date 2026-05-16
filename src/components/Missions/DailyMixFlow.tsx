import { useState, useCallback } from 'react';
import { UserProgress } from '../../types/progress.types';
import { DailyMixStepResult } from '../../types/hub.types';
import { DAILY_MIX_XP } from '../../data/zones';
import ListeningMission from './ListeningMission';
import ReadingMission from './ReadingMission';
import WritingForge from './WritingForge';
import SpeakingMission from './SpeakingMission';
import DailyReview from './DailyReview';

type Step = 'listening' | 'reading' | 'writing' | 'speaking' | 'review';

interface DailyMixFlowProps {
  progress: UserProgress;
  onFinish: (results: DailyMixStepResult[], xp: number) => void;
  onExit: () => void;
}

export default function DailyMixFlow({ progress, onFinish, onExit }: DailyMixFlowProps) {
  const [step, setStep] = useState<Step>('listening');
  const [results, setResults] = useState<DailyMixStepResult[]>([]);

  const record = useCallback((result: DailyMixStepResult) => {
    setResults((prev) => [...prev, result]);
  }, []);

  const stepLabel = (n: number, total: number) => `Daily Mix ${n}/${total}`;

  if (step === 'review') {
    return (
      <DailyReview
        results={results}
        progress={progress}
        xpEarned={DAILY_MIX_XP}
        onDone={() => onFinish(results, DAILY_MIX_XP)}
        onExit={onExit}
      />
    );
  }

  if (step === 'listening') {
    return (
      <ListeningMission
        targetBand={progress.targetBand}
        stepLabel={stepLabel(1, 4)}
        onExit={onExit}
        onComplete={(correct, weakTags) => {
          record({ step: 'listening', correct, weakTags });
          setStep('reading');
        }}
      />
    );
  }

  if (step === 'reading') {
    return (
      <ReadingMission
        targetBand={progress.targetBand}
        stepLabel={stepLabel(2, 4)}
        onExit={onExit}
        onComplete={(correct, weakTags) => {
          record({ step: 'reading', correct, weakTags });
          setStep('writing');
        }}
      />
    );
  }

  if (step === 'writing') {
    return (
      <WritingForge
        targetBand={progress.targetBand}
        stepLabel={stepLabel(3, 4)}
        questionCount={2}
        onExit={onExit}
        onComplete={(correct, total, weakTags) => {
          record({
            step: 'writing',
            correct: correct >= Math.ceil(total / 2),
            weakTags,
          });
          setStep('speaking');
        }}
      />
    );
  }

  return (
    <SpeakingMission
      targetBand={progress.targetBand}
      stepLabel={stepLabel(4, 4)}
      onExit={onExit}
      onComplete={(rating, weakTags) => {
        record({
          step: 'speaking',
          correct: rating !== 'weak',
          weakTags,
        });
        setStep('review');
      }}
    />
  );
}
