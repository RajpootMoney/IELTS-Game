import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { pickSpeakingPrompt, SPEAKING_DURATION_SEC } from '../../data/speakingPrompts';
import { TargetBand, WeakTag } from '../../types/progress.types';
import { audioEngine } from '../../utils/audioUtils';
import MissionShell from './MissionShell';

interface SpeakingMissionProps {
  targetBand: TargetBand;
  stepLabel?: string;
  onComplete: (selfRating: 'good' | 'ok' | 'weak', weakTags: WeakTag[]) => void;
  onExit: () => void;
}

type Phase = 'prep' | 'speak' | 'reflect';

export default function SpeakingMission({
  targetBand,
  stepLabel,
  onComplete,
  onExit,
}: SpeakingMissionProps) {
  const prompt = useMemo(() => pickSpeakingPrompt(targetBand), [targetBand]);
  const [phase, setPhase] = useState<Phase>('prep');
  const [secondsLeft, setSecondsLeft] = useState(SPEAKING_DURATION_SEC);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== 'speak') return;
    timerRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase('reflect');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  const handleRating = useCallback(
    (rating: 'good' | 'ok' | 'weak') => {
      audioEngine.play('buttonClick');
      const weak: WeakTag[] =
        rating === 'good' ? [] : rating === 'ok' ? ['speaking-fluency'] : ['speaking-fluency', 'speaking-vocabulary'];
      onComplete(rating, weak);
    },
    [onComplete]
  );

  return (
    <MissionShell
      title="Pressure Booth"
      zone="SPEAKING BOOTH"
      step={stepLabel}
      tint="default"
      onExit={onExit}
    >
      <p className="font-pixel text-xs text-neon-yellow mb-2">Part {prompt.part} — {prompt.topic}</p>

      {phase === 'prep' && (
        <div className="space-y-4">
          <p className="font-mono text-lg text-white">{prompt.question}</p>
          <div className="p-4 bg-black/40 rounded border border-neon-yellow/30">
            <p className="font-pixel text-xs text-neon-yellow mb-2">DISCOURSE MARKERS — use 2+</p>
            <div className="flex flex-wrap gap-2">
              {prompt.discourseMarkers.map((m) => (
                <span key={m} className="font-mono text-sm px-2 py-1 bg-neon-yellow/10 text-neon-yellow rounded">
                  {m}
                </span>
              ))}
            </div>
          </div>
          <p className="font-mono text-xs text-gray-400 italic">{prompt.sampleOpener}</p>
          <p className="font-mono text-xs text-neon-cyan">{prompt.tip}</p>
          <button
            type="button"
            className="game-button w-full"
            onClick={() => {
              audioEngine.play('buttonClick');
              setSecondsLeft(SPEAKING_DURATION_SEC);
              setPhase('speak');
            }}
          >
            START {SPEAKING_DURATION_SEC}s TIMER →
          </button>
        </div>
      )}

      {phase === 'speak' && (
        <div className="text-center space-y-6 py-8">
          <p
            className={`font-pixel text-6xl neon-text ${
              secondsLeft <= 10 ? 'text-neon-red animate-pulse-glow' : 'text-neon-yellow'
            }`}
          >
            {secondsLeft}
          </p>
          <p className="font-mono text-sm text-white max-w-md mx-auto">{prompt.question}</p>
          <p className="font-mono text-xs text-gray-500">Speak out loud. Pause instead of saying &ldquo;um&rdquo;.</p>
          <button
            type="button"
            className="font-pixel text-xs text-gray-400 underline"
            onClick={() => setPhase('reflect')}
          >
            Finish early
          </button>
        </div>
      )}

      {phase === 'reflect' && (
        <div className="space-y-4">
          <p className="font-mono text-sm text-white mb-4">How did that feel?</p>
          <div className="grid gap-3">
            {(
              [
                { id: 'good' as const, label: 'Smooth & structured', color: 'neon-green' },
                { id: 'ok' as const, label: 'OK — some hesitation', color: 'neon-yellow' },
                { id: 'weak' as const, label: 'Hard — need practice', color: 'neon-red' },
              ] as const
            ).map(({ id, label, color }) => (
              <button
                key={id}
                type="button"
                onClick={() => handleRating(id)}
                className={`p-4 rounded border-2 font-mono text-sm border-${color} text-${color} hover:bg-white/5`}
                style={{
                  borderColor: color === 'neon-green' ? '#00FF00' : color === 'neon-yellow' ? '#FFFF00' : '#FF0000',
                  color: color === 'neon-green' ? '#00FF00' : color === 'neon-yellow' ? '#FFFF00' : '#FF0000',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </MissionShell>
  );
}
