import { useState, useCallback, useMemo } from 'react';
import { pickGrammarChallenges } from '../../data/grammarChallenges';
import { checkGrammarAnswer, generateGrammarQuestion } from '../../data/modeQuestions';
import { TargetBand, WeakTag } from '../../types/progress.types';
import { audioEngine } from '../../utils/audioUtils';
import GrammarFeedback, { GrammarFeedbackData } from '../Game/GrammarFeedback';
import MissionShell from './MissionShell';

interface WritingForgeProps {
  targetBand: TargetBand;
  stepLabel?: string;
  questionCount?: number;
  onComplete: (correctCount: number, total: number, weakTags: WeakTag[]) => void;
  onExit: () => void;
}

export default function WritingForge({
  targetBand,
  stepLabel,
  questionCount = 3,
  onComplete,
  onExit,
}: WritingForgeProps) {
  const challenges = useMemo(
    () => pickGrammarChallenges(questionCount, targetBand <= 6 ? 2 : 4),
    [questionCount, targetBand]
  );
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<GrammarFeedbackData | null>(null);
  const [lives, setLives] = useState(3);

  const challenge = challenges[index];
  const question = useMemo(
    () => generateGrammarQuestion(challenge, `g-${index}`),
    [challenge, index]
  );

  const advance = useCallback(
    (wasCorrect: boolean) => {
      const nextCorrect = wasCorrect ? correctCount + 1 : correctCount;
      if (index + 1 >= challenges.length) {
        const weak: WeakTag[] = nextCorrect < challenges.length ? ['writing-grammar'] : [];
        onComplete(nextCorrect, challenges.length, weak);
        return;
      }
      setCorrectCount(nextCorrect);
      setIndex((i) => i + 1);
      setInput('');
      setFeedback(null);
    },
    [index, challenges.length, correctCount, onComplete]
  );

  const handleSubmit = useCallback(() => {
    if (!input.trim() || feedback) return;
    audioEngine.play('buttonClick');
    const ok = checkGrammarAnswer(input, question);

    if (ok) {
      audioEngine.play('correct');
      setTimeout(() => advance(true), 600);
    } else {
      audioEngine.play('wrong');
      audioEngine.play('lifeLost');
      setLives((l) => l - 1);
      setFeedback({
        flawed: question.flawedSentence!,
        correct: question.correctSentence!,
        tip: question.grammarTip!,
        errorLabel: question.errorLabel ?? 'Grammar',
      });
    }
  }, [input, feedback, question, advance, lives]);

  const dismissFeedback = useCallback(() => {
    setFeedback(null);
    setInput('');
    if (lives <= 0) {
      onComplete(correctCount, challenges.length, ['writing-grammar']);
    }
  }, [lives, correctCount, challenges.length, onComplete]);

  return (
    <MissionShell
      title="Sentence Forge"
      zone="WRITING FORGE"
      step={stepLabel ?? `Sentence ${index + 1} / ${challenges.length}`}
      tint="green"
      onExit={onExit}
    >
      <div className="flex justify-between mb-4 font-mono text-xs">
        <span className="text-neon-green">♥ {lives}</span>
        <span className="text-gray-400">Score {correctCount}/{challenges.length}</span>
      </div>

      <div className="p-4 mb-4 bg-neon-red/10 border border-neon-red/40 rounded-lg">
        <p className="font-mono text-xs text-neon-red mb-1">Fix this sentence:</p>
        <p className="font-mono text-base text-white">&ldquo;{challenge.flawed}&rdquo;</p>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit();
        }}
        placeholder="Type the corrected sentence..."
        rows={4}
        disabled={!!feedback}
        className="w-full bg-black/50 border-2 border-neon-green rounded-lg px-4 py-3 font-mono text-white placeholder-gray-500 focus:outline-none focus:border-neon-green mb-4"
      />
      <p className="font-mono text-xs text-gray-500 mb-4">Ctrl+Enter to submit</p>

      <button type="button" className="game-button w-full" onClick={handleSubmit} disabled={!!feedback}>
        SUBMIT
      </button>

      {feedback && <GrammarFeedback feedback={feedback} onDismiss={dismissFeedback} />}
    </MissionShell>
  );
}
