export interface WordData {
  word: string;
  definition: string;
  synonyms: string[];
  antonyms?: string[];
  sentence: string;
  band: 5 | 6 | 7;
  wordForms?: {
    noun?: string;
    verb?: string;
    adjective?: string;
    adverb?: string;
  };
  collocations?: string[];
  idiom?: {
    phrase: string;
    meaning: string;
  };
}

export interface Alien {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  word: string;
  wordData: WordData;
  questionType: QuestionType;
  isAlive: boolean;
  bobOffset: number;
  color: string;
}

export type QuestionType = 
  | 'synonym' 
  | 'definition' 
  | 'fillBlank'
  | 'antonym'
  | 'wordForm'
  | 'collocation'
  | 'sentenceCompletion'
  | 'errorCorrection'
  | 'phoneticMatch'
  | 'idiomCompletion'
  | 'academicWord'
  | 'grammarFix'
  | 'shooter';

export interface Question {
  type: QuestionType;
  prompt: string;
  correctAnswer: string;
  targetAlienId: string;
  acceptableAnswers: string[];
  context?: string;
  explanation?: string;
  difficulty?: 1 | 2 | 3 | 4 | 5;
  band?: 5 | 6 | 7 | 8;
  /** Grammar Fix mode: shown when the player answers incorrectly */
  grammarTip?: string;
  flawedSentence?: string;
  correctSentence?: string;
  errorLabel?: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface Laser {
  x: number;
  y: number;
  targetY: number;
  speed: number;
  isActive: boolean;
  color: string;
}

export interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  brightness: number;
}

export interface GameState {
  status: 'start' | 'playing' | 'paused' | 'gameOver';
  score: number;
  lives: number;
  wave: number;
  combo: number;
  comboMultiplier: number;
  currentQuestion: Question | null;
  inputText: string;
  wrongWords: WordData[];
  wordsCorrect: number;
  totalAttempts: number;
}

export interface SoundConfig {
  type: 'sine' | 'square' | 'sawtooth' | 'triangle';
  frequency: number;
  duration: number;
  volume: number;
  slide?: boolean;
  slideTo?: number;
}
