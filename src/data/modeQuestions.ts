import { Question, WordData } from '../types/game.types';
import { GameMode } from '../types/mode.types';
import { generateQuestion } from './questionGenerator';
import { GrammarChallenge } from './grammarChallenges';

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/['']/g, "'")
    .replace(/[.,!?;:]/g, '');
}

export function generateGrammarQuestion(
  challenge: GrammarChallenge,
  targetAlienId: string
): Question {
  const normalized = normalizeText(challenge.correct);
  return {
    type: 'grammarFix',
    prompt: `Rewrite this sentence correctly:`,
    correctAnswer: normalized,
    acceptableAnswers: [normalized],
    targetAlienId,
    grammarTip: challenge.tip,
    flawedSentence: challenge.flawed,
    correctSentence: challenge.correct,
    errorLabel: challenge.errorLabel,
    band: challenge.band,
  };
}

export function generateShooterQuestion(
  targetWord: WordData,
  targetAlienId: string
): Question {
  return {
    type: 'shooter',
    prompt: `Type the word on the alien that means: "${targetWord.definition}"`,
    correctAnswer: targetWord.word.toLowerCase(),
    acceptableAnswers: [targetWord.word.toLowerCase()],
    targetAlienId,
    context: `Find the alien labelled "${targetWord.word}"`,
  };
}

export function generateQuestionForMode(
  mode: GameMode,
  wordData: WordData,
  targetAlienId: string,
  grammarChallenge?: GrammarChallenge
): Question {
  if (mode === 'grammar' && grammarChallenge) {
    return generateGrammarQuestion(grammarChallenge, targetAlienId);
  }
  if (mode === 'shooter') {
    return generateShooterQuestion(wordData, targetAlienId);
  }
  return generateQuestion(wordData, targetAlienId);
}

export function checkShooterAnswer(
  answer: string,
  question: Question,
  aliens: { id: string; word: string; isAlive: boolean }[]
): boolean {
  const normalized = normalizeText(answer);
  const target = aliens.find((a) => a.id === question.targetAlienId && a.isAlive);
  if (!target) return false;
  return normalized === normalizeText(target.word);
}

export function checkGrammarAnswer(answer: string, question: Question): boolean {
  const normalized = normalizeText(answer);
  if (question.acceptableAnswers.includes(normalized)) return true;
  return normalized === question.correctAnswer;
}
