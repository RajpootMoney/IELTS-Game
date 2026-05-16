import { DailyMixStepResult } from '../../types/hub.types';
import { UserProgress } from '../../types/progress.types';
import { getTopWeaknesses, weakTagLabel } from '../../services/progressService';
import { audioEngine } from '../../utils/audioUtils';
import HubBackground from '../Hub/HubBackground';

interface DailyReviewProps {
  results: DailyMixStepResult[];
  progress: UserProgress;
  xpEarned: number;
  onDone: () => void;
  onExit: () => void;
}

const stepTitles: Record<DailyMixStepResult['step'], string> = {
  listening: '🎧 Listening',
  reading: '📖 Reading',
  writing: '✏️ Writing',
  speaking: '🗣️ Speaking',
};

export default function DailyReview({
  results,
  progress,
  xpEarned,
  onDone,
  onExit,
}: DailyReviewProps) {
  const correctCount = results.filter((r) => r.correct).length;
  const sessionWeak = results.flatMap((r) => r.weakTags);
  const combined = { ...progress.weakTags };
  for (const tag of sessionWeak) {
    combined[tag] = (combined[tag] ?? 0) + 1;
  }
  const topWeak = getTopWeaknesses({ ...progress, weakTags: combined }, 3);

  return (
    <HubBackground tint="purple">
      <div className="flex-1 overflow-y-auto p-6 max-w-lg mx-auto w-full">
        <h1 className="font-pixel text-2xl text-center text-neon-cyan neon-text mb-2">
          DAILY MIX COMPLETE
        </h1>
        <p className="font-mono text-sm text-center text-gray-400 mb-8">
          {correctCount}/{results.length} steps strong today · +{xpEarned} XP
        </p>

        <div className="space-y-3 mb-8">
          {results.map((r) => (
            <div
              key={r.step}
              className={`flex justify-between items-center p-3 rounded border ${
                r.correct ? 'border-neon-green/50 bg-neon-green/10' : 'border-neon-red/40 bg-neon-red/10'
              }`}
            >
              <span className="font-mono text-sm">{stepTitles[r.step]}</span>
              <span className={`font-pixel text-xs ${r.correct ? 'text-neon-green' : 'text-neon-red'}`}>
                {r.correct ? '✓' : 'REVIEW'}
              </span>
            </div>
          ))}
        </div>

        {topWeak.length > 0 && (
          <div className="mb-8 p-4 rounded-lg border border-neon-yellow/40 bg-neon-yellow/5">
            <p className="font-pixel text-xs text-neon-yellow mb-3">FOCUS NEXT</p>
            <ul className="space-y-2">
              {topWeak.map(({ tag }) => (
                <li key={tag} className="font-mono text-sm text-gray-300">
                  → {weakTagLabel(tag)}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="font-mono text-xs text-center text-gray-500 mb-6">
          Streak: {progress.dailyStreak} day{progress.dailyStreak !== 1 ? 's' : ''} · Target band{' '}
          {progress.targetBand}
        </p>

        <button
          type="button"
          className="game-button w-full mb-3"
          onClick={() => {
            audioEngine.play('buttonClick');
            onDone();
          }}
        >
          CLAIM REWARD →
        </button>
        <button
          type="button"
          className="w-full font-pixel text-xs text-gray-500 hover:text-white"
          onClick={onExit}
        >
          Back to hub
        </button>
      </div>
    </HubBackground>
  );
}
