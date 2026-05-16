import { useState, useCallback, useMemo } from 'react';
import { pickReadingDrill, TfngAnswer, TFNG_LABELS } from '../../data/readingDrills';
import { TargetBand, WeakTag } from '../../types/progress.types';
import { audioEngine } from '../../utils/audioUtils';
import MissionShell from './MissionShell';

interface ReadingMissionProps {
  targetBand: TargetBand;
  stepLabel?: string;
  onComplete: (correct: boolean, weakTags: WeakTag[]) => void;
  onExit: () => void;
}

const OPTIONS: TfngAnswer[] = ['true', 'false', 'not-given'];

export default function ReadingMission({
  targetBand,
  stepLabel,
  onComplete,
  onExit,
}: ReadingMissionProps) {
  const drill = useMemo(() => pickReadingDrill(targetBand), [targetBand]);
  const [selected, setSelected] = useState<TfngAnswer | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(() => {
    if (!selected) return;
    audioEngine.play('buttonClick');
    const correct = selected === drill.correct;
    if (correct) audioEngine.play('correct');
    else audioEngine.play('wrong');
    setSubmitted(true);
    const weak: WeakTag[] = correct ? [] : ['reading-tfng'];
    setTimeout(() => onComplete(correct, weak), 2800);
  }, [selected, drill.correct, onComplete]);

  return (
    <MissionShell
      title="Scanline"
      zone="READING GRID"
      step={stepLabel}
      tint="default"
      onExit={onExit}
    >
      <p className="font-pixel text-[10px] text-gray-500 mb-2">{drill.passageTitle}</p>
      <div className="p-4 mb-6 bg-black/40 rounded-lg border border-neon-pink/30 max-h-48 overflow-y-auto">
        <p className="font-mono text-sm text-gray-200 leading-relaxed">{drill.passage}</p>
      </div>

      <p className="font-mono text-xs text-neon-pink mb-2">Statement:</p>
      <p className="font-mono text-base text-white mb-6">{drill.statement}</p>

      {!submitted ? (
        <>
          <p className="font-pixel text-xs text-gray-400 mb-3">TRUE / FALSE / NOT GIVEN</p>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  audioEngine.play('buttonClick');
                  setSelected(opt);
                }}
                className={`py-3 font-pixel text-[10px] md:text-xs rounded border-2 transition-all ${
                  selected === opt
                    ? 'bg-neon-pink text-black border-neon-pink'
                    : 'border-gray-600 text-gray-400 hover:border-neon-pink/50'
                }`}
              >
                {TFNG_LABELS[opt]}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="game-button w-full"
            onClick={handleSubmit}
            disabled={!selected}
          >
            SUBMIT
          </button>
        </>
      ) : (
        <div
          className={`p-4 rounded-lg border-2 ${
            selected === drill.correct
              ? 'border-neon-green bg-neon-green/10'
              : 'border-neon-red bg-neon-red/10'
          }`}
        >
          <p
            className={`font-pixel text-lg mb-2 ${
              selected === drill.correct ? 'text-neon-green' : 'text-neon-red'
            }`}
          >
            {selected === drill.correct ? 'CORRECT!' : `Answer: ${TFNG_LABELS[drill.correct]}`}
          </p>
          <p className="font-mono text-sm text-gray-200">{drill.explanation}</p>
        </div>
      )}
    </MissionShell>
  );
}
