import { WordData } from './game.types';

// Extended question types beyond the original 3
export type ExtendedQuestionType = 
  | 'synonym' 
  | 'definition' 
  | 'fillBlank'
  | 'antonym'           // Opposite meaning
  | 'wordForm'          // Change word form (noun to adjective, etc.)
  | 'collocation'       // Words that go together
  | 'sentenceCompletion' // Complete the sentence
  | 'errorCorrection'   // Find and fix the error
  | 'phoneticMatch'     // Match similar sounding words
  | 'idiomCompletion'   // Complete the idiom
  | 'academicWord';     // High-frequency academic word

export interface ExtendedQuestion {
  type: ExtendedQuestionType;
  prompt: string;
  correctAnswer: string;
  acceptableAnswers: string[];
  targetAlienId: string;
  difficulty: 1 | 2 | 3 | 4 | 5; // 1=easiest, 5=hardest
  band: 5 | 6 | 7 | 8; // IELTS band level
  context?: string; // Additional context or hint
  explanation?: string; // Explanation of the answer for learning
  relatedWords?: string[]; // Related vocabulary
}

export interface QuestionTemplate {
  type: ExtendedQuestionType;
  templates: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  band: 5 | 6 | 7 | 8;
}

export interface IELTSTip {
  id: string;
  category: 'listening' | 'reading' | 'writing' | 'speaking' | 'general';
  title: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  bandTarget: 5 | 6 | 7 | 8;
  tags: string[];
}

export interface DoYouKnowFact {
  id: string;
  category: 'vocabulary' | 'grammar' | 'exam' | 'strategy' | 'common_mistake';
  title: string;
  fact: string;
  example?: string;
  relatedWords?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface VocabularySet {
  id: string;
  name: string;
  description: string;
  words: WordData[];
  band: 5 | 6 | 7 | 8;
  category: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export interface APIData {
  tips: IELTSTip[];
  facts: DoYouKnowFact[];
  vocabularySets: VocabularySet[];
  lastUpdated: string;
}
