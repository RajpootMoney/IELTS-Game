import { useCallback } from 'react';
import { audioEngine } from '../../utils/audioUtils';

export interface GrammarFeedbackData {
  flawed: string;
  correct: string;
  tip: string;
  errorLabel: string;
}

interface GrammarFeedbackProps {
  feedback: GrammarFeedbackData;
  onDismiss: () => void;
}

export default function GrammarFeedback({ feedback, onDismiss }: GrammarFeedbackProps) {
  const handleDismiss = useCallback(() => {
    audioEngine.play('buttonClick');
    onDismiss();
  }, [onDismiss]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="bg-game-bg border-2 border-neon-red/60 rounded-lg max-w-xl w-full p-6 shadow-[0_0_40px_rgba(255,0,0,0.3)]">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">✗</span>
          <h3 className="font-pixel text-lg text-neon-red">Not quite — life lost</h3>
        </div>
        <span className="font-pixel text-xs text-neon-yellow bg-neon-yellow/10 px-2 py-1 rounded mb-4 inline-block">
          {feedback.errorLabel}
        </span>

        <div className="space-y-4 font-mono text-sm">
          <div>
            <p className="text-gray-500 text-xs mb-1">Flawed sentence:</p>
            <p className="text-gray-400 line-through">{feedback.flawed}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Correct sentence:</p>
            <p className="text-neon-green text-base leading-relaxed">{feedback.correct}</p>
          </div>
          <div className="bg-neon-cyan/10 border border-neon-cyan/40 rounded-lg p-4">
            <p className="text-neon-cyan font-pixel text-xs mb-2">GRAMMAR TIP</p>
            <p className="text-gray-200 leading-relaxed">{feedback.tip}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="w-full mt-6 py-3 bg-neon-green/20 border border-neon-green text-neon-green font-pixel text-sm rounded hover:bg-neon-green/30 transition-all"
        >
          CONTINUE →
        </button>
      </div>
    </div>
  );
}
