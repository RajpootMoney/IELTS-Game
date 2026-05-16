import { useState, useCallback, useMemo } from 'react';
import { pickListeningDrill, ListeningDrill } from '../../data/listeningDrills';
import { TargetBand, WeakTag } from '../../types/progress.types';
import { audioEngine } from '../../utils/audioUtils';
import MissionShell from './MissionShell';

interface ListeningMissionProps {
  targetBand: TargetBand;
  stepLabel?: string;
  onComplete: (correct: boolean, weakTags: WeakTag[]) => void;
  onExit: () => void;
}

type Phase = 'predict' | 'listen' | 'answer' | 'result';

export default function ListeningMission({
  targetBand,
  stepLabel,
  onComplete,
  onExit,
}: ListeningMissionProps) {
  const drill = useMemo(() => pickListeningDrill(targetBand), [targetBand]);
  const [phase, setPhase] = useState<Phase>('predict');
  const [selected, setSelected] = useState<number | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);

  const finish = useCallback(
    (correct: boolean) => {
      const weak: WeakTag[] = correct ? [] : ['listening-prediction', 'listening-detail'];
      onComplete(correct, weak);
    },
    [onComplete]
  );

  const handleSubmit = useCallback(() => {
    if (selected === null) return;
    audioEngine.play('buttonClick');
    const correct = selected === drill.correctIndex;
    if (correct) audioEngine.play('correct');
    else audioEngine.play('wrong');
    setPhase('result');
    setTimeout(() => finish(correct), 2500);
  }, [selected, drill.correctIndex, finish]);

  return (
    <MissionShell
      title="Signal Hunt"
      zone="LISTENING LAB"
      step={stepLabel}
      tint="cyan"
      onExit={onExit}
    >
      <p className="font-pixel text-[10px] text-gray-500 mb-4">{drill.context}</p>

      {phase === 'predict' && (
        <div className="space-y-4">
          <p className="font-mono text-sm text-neon-cyan">
            Step 1 — Before you &ldquo;hear&rdquo; the audio, predict the answer type:
          </p>
          <p className="font-mono text-lg text-white">{drill.question}</p>
          <p className="font-pixel text-xs text-neon-yellow">
            Expected: {drill.answerType.toUpperCase()}
          </p>
          <button
            type="button"
            className="game-button w-full"
            onClick={() => {
              audioEngine.play('buttonClick');
              setPhase('listen');
            }}
          >
            PLAY TRANSCRIPT →
          </button>
        </div>
      )}

      {phase === 'listen' && (
        <div className="space-y-4">
          <p className="font-mono text-xs text-gray-400">Read as if listening (exam simulation):</p>
          <p className="font-mono text-base text-white leading-relaxed p-4 bg-black/40 rounded border border-neon-cyan/30">
            {drill.transcript}
          </p>
          <button
            type="button"
            className="game-button w-full"
            onClick={() => setPhase('answer')}
          >
            ANSWER QUESTION →
          </button>
        </div>
      )}

      {phase === 'answer' && (
        <div className="space-y-4">
          <p className="font-mono text-white">{drill.question}</p>
          <div className="grid gap-2">
            {drill.options.map((opt, i) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  audioEngine.play('buttonClick');
                  setSelected(i);
                }}
                className={`p-3 rounded border-2 font-mono text-sm text-left transition-all ${
                  selected === i
                    ? 'border-neon-cyan bg-neon-cyan/20 text-white'
                    : 'border-gray-600 text-gray-300 hover:border-neon-cyan/40'
                }`}
              >
                {String.fromCharCode(65 + i)}. {opt}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="game-button w-full"
            onClick={handleSubmit}
            disabled={selected === null}
          >
            SUBMIT
          </button>
        </div>
      )}

      {phase === 'result' && (
        <ResultPanel
          drill={drill}
          selected={selected}
          showTranscript={showTranscript}
          onToggle={() => setShowTranscript((s) => !s)}
        />
      )}
    </MissionShell>
  );
}

function ResultPanel({
  drill,
  selected,
  showTranscript,
  onToggle,
}: {
  drill: ListeningDrill;
  selected: number | null;
  showTranscript: boolean;
  onToggle: () => void;
}) {
  const correct = selected === drill.correctIndex;
  return (
    <div
      className={`p-4 rounded-lg border-2 ${
        correct ? 'border-neon-green bg-neon-green/10' : 'border-neon-red bg-neon-red/10'
      }`}
    >
      <p className={`font-pixel text-lg mb-2 ${correct ? 'text-neon-green' : 'text-neon-red'}`}>
        {correct ? 'CORRECT!' : 'NOT QUITE'}
      </p>
      <p className="font-mono text-sm text-white mb-2">
        Answer: {drill.options[drill.correctIndex]}
      </p>
      <p className="font-mono text-xs text-neon-cyan">{drill.tip}</p>
      <button type="button" onClick={onToggle} className="font-mono text-xs text-gray-400 mt-3 underline">
        {showTranscript ? 'Hide' : 'Show'} transcript
      </button>
      {showTranscript && (
        <p className="font-mono text-xs text-gray-400 mt-2">{drill.transcript}</p>
      )}
    </div>
  );
}
