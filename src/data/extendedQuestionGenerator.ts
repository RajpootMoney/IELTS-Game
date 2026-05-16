import { WordData } from '../types/game.types';
import { 
  ExtendedQuestion, 
  ExtendedQuestionType, 
  IELTSTip, 
  DoYouKnowFact,
  VocabularySet 
} from '../types/question.types';
import ieltsApi from '../services/ieltsApi';

// Extended question templates for each type
const questionTemplates: Record<ExtendedQuestionType, string[]> = {
  synonym: [
    'Type a synonym of "{word}"',
    'What word has a similar meaning to "{word}"?',
    'Find a synonym for "{word}"'
  ],
  definition: [
    'Type the word for: "{definition}"',
    'What word means: "{definition}"?',
    'Enter the word that matches this definition: "{definition}"'
  ],
  fillBlank: [
    'Fill in the blank: "{sentence}"',
    'Complete the sentence: "{sentence}"',
    'What word fits here: "{sentence}"?'
  ],
  antonym: [
    'Type the opposite of "{word}"',
    'What is the antonym of "{word}"?',
    'Find a word with the opposite meaning to "{word}"'
  ],
  wordForm: [
    'Change "{word}" to {targetForm} form',
    'Convert "{word}" into its {targetForm} form',
    'What is the {targetForm} form of "{word}"?'
  ],
  collocation: [
    'Which word collocates with "{word}": {options}?',
    'What word commonly goes with "{word}"?',
    'Choose the correct collocation for "{word}"'
  ],
  sentenceCompletion: [
    'Complete: "{sentence}"',
    'Finish this sentence: "{sentence}"',
    'What word best completes: "{sentence}"?'
  ],
  errorCorrection: [
    'Find and correct the error: "{sentence}"',
    'What\'s wrong with this sentence: "{sentence}"?',
    'Correct the mistake in: "{sentence}"'
  ],
  phoneticMatch: [
    'Which word sounds like "{word}": {options}?',
    'Find the homophone of "{word}"',
    'What word has a similar pronunciation to "{word}"?'
  ],
  idiomCompletion: [
    'Complete the idiom: "{idiom}"',
    'Finish this saying: "{idiom}"',
    'What word completes the expression: "{idiom}"?'
  ],
  academicWord: [
    'This AWL word means "{definition}". Type it:',
    'Name this academic word: "{definition}"',
    'What\'s the academic term for "{definition}"?'
  ]
};

// Question difficulty settings
const difficultySettings = {
  1: { band: 5, points: 100, timeBonus: 10 },
  2: { band: 6, points: 150, timeBonus: 15 },
  3: { band: 7, points: 200, timeBonus: 20 },
  4: { band: 8, points: 300, timeBonus: 25 },
  5: { band: 8, points: 500, timeBonus: 30 }
};

// Generate extended question
export async function generateExtendedQuestion(
  wordData: WordData,
  targetAlienId: string,
  preferredTypes?: ExtendedQuestionType[]
): Promise<ExtendedQuestion> {
  // Select question type
  const types = preferredTypes || Object.keys(questionTemplates) as ExtendedQuestionType[];
  const selectedType = types[Math.floor(Math.random() * types.length)];
  
  // Get templates for selected type
  const templates = questionTemplates[selectedType];
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  // Generate question content based on type
  let prompt = '';
  let correctAnswer = '';
  let acceptableAnswers: string[] = [];
  let context = '';
  let explanation = '';
  let relatedWords: string[] = [];
  
  switch (selectedType) {
    case 'synonym':
      prompt = template.replace('{word}', wordData.word);
      correctAnswer = wordData.synonyms[0];
      acceptableAnswers = [...wordData.synonyms, wordData.word];
      explanation = `A synonym is a word with a similar meaning. The word "${wordData.word}" means "${wordData.definition}".`;
      relatedWords = wordData.synonyms;
      break;
      
    case 'definition':
      prompt = template.replace('{definition}', wordData.definition);
      correctAnswer = wordData.word;
      acceptableAnswers = [wordData.word];
      explanation = `The definition of "${wordData.word}" is "${wordData.definition}".`;
      relatedWords = wordData.synonyms;
      break;
      
    case 'fillBlank':
      prompt = template.replace('{sentence}', wordData.sentence);
      correctAnswer = wordData.word;
      acceptableAnswers = [wordData.word];
      context = `The sentence context helps you understand the word's usage.`;
      explanation = `The word "${wordData.word}" fits naturally in the sentence: "${wordData.sentence.replace('_____', wordData.word)}"`;
      break;
      
    case 'antonym':
      // Generate or use antonym if available
      const antonym = wordData.antonym || wordData.synonyms[0]; // Fallback
      prompt = template.replace('{word}', wordData.word);
      correctAnswer = antonym;
      acceptableAnswers = [antonym];
      explanation = `An antonym is a word with the opposite meaning. The opposite of "${wordData.word}" is "${antonym}".`;
      break;
      
    case 'wordForm':
      // This would require word form data in WordData
      const targetForm = 'adjective'; // Example
      const wordForms = {
        noun: wordData.word,
        adjective: wordData.word + 'ic', // Simplified
        adverb: wordData.word + 'ally',
        verb: wordData.word + 'ize'
      };
      prompt = template
        .replace('{word}', wordData.word)
        .replace('{targetForm}', targetForm);
      correctAnswer = wordForms[targetForm as keyof typeof wordForms];
      acceptableAnswers = [correctAnswer];
      explanation = `Changing word forms allows you to use the same root word in different grammatical contexts.`;
      break;
      
    case 'collocation':
      const collocations = ['make', 'do', 'take', 'get'];
      const correctCollocation = 'make'; // Simplified
      prompt = template
        .replace('{word}', wordData.word)
        .replace('{options}', collocations.join(', '));
      correctAnswer = correctCollocation;
      acceptableAnswers = [correctCollocation];
      explanation = `Collocations are words that naturally go together. Native speakers automatically use these combinations.`;
      break;
      
    case 'idiomCompletion':
      const idiom = 'break the ice';
      const partialIdiom = 'break the ____';
      prompt = template.replace('{idiom}', partialIdiom);
      correctAnswer = 'ice';
      acceptableAnswers = ['ice'];
      explanation = `The idiom "break the ice" means to initiate conversation in a social setting and make people feel comfortable.`;
      break;
      
    case 'academicWord':
      prompt = template.replace('{definition}', wordData.definition);
      correctAnswer = wordData.word;
      acceptableAnswers = [wordData.word];
      explanation = `The Academic Word List (AWL) contains 570 word families that appear frequently in academic texts across disciplines.`;
      break;
      
    default:
      // Fallback to basic synonym
      prompt = `What word means "${wordData.definition}"?`;
      correctAnswer = wordData.word;
      acceptableAnswers = [wordData.word];
  }
  
  // Calculate difficulty based on word band and question type complexity
  const baseDifficulty = (wordData.band - 4) as 1 | 2 | 3 | 4 | 5;
  const typeComplexity: Record<ExtendedQuestionType, number> = {
    synonym: 1,
    definition: 1,
    fillBlank: 1,
    antonym: 2,
    collocation: 2,
    sentenceCompletion: 2,
    idiomCompletion: 2,
    academicWord: 2,
    wordForm: 3,
    phoneticMatch: 3,
    errorCorrection: 3
  };
  
  const difficulty = Math.min(5, Math.max(1, 
    baseDifficulty + typeComplexity[selectedType] - 1
  )) as 1 | 2 | 3 | 4 | 5;
  
  return {
    type: selectedType,
    prompt,
    correctAnswer: correctAnswer.toLowerCase(),
    acceptableAnswers: acceptableAnswers.map(a => a.toLowerCase()),
    targetAlienId,
    difficulty,
    band: wordData.band as 5 | 6 | 7 | 8,
    context,
    explanation,
    relatedWords
  };
}

// Get random tip with category filter
export async function getRandomIELTSTip(category?: IELTSTip['category']): Promise<IELTSTip> {
  return ieltsApi.getRandomTip(category);
}

// Get random fact with category filter
export async function getRandomDoYouKnowFact(
  category?: DoYouKnowFact['category']
): Promise<DoYouKnowFact> {
  return ieltsApi.getRandomFact(category);
}

// Get vocabulary set by band
export async function getVocabularySetByBand(band: 5 | 6 | 7 | 8): Promise<VocabularySet> {
  return ieltsApi.getVocabularySet(band);
}

// Get all API data
export async function getAllAPIData(): Promise<{
  tips: IELTSTip[];
  facts: DoYouKnowFact[];
  vocabularySets: VocabularySet[];
}> {
  const data = await ieltsApi.fetchAllData();
  return {
    tips: data.tips,
    facts: data.facts,
    vocabularySets: data.vocabularySets
  };
}

// Get questions by difficulty
export async function getQuestionsByDifficulty(
  difficulty: 1 | 2 | 3 | 4 | 5,
  count: number = 5
): Promise<ExtendedQuestion[]> {
  // In a real app, this would fetch from an API
  // For now, we'll generate placeholder questions
  const questions: ExtendedQuestion[] = [];
  
  for (let i = 0; i < count; i++) {
    // Generate a placeholder question
    questions.push({
      type: 'synonym',
      prompt: 'Sample question for difficulty ' + difficulty,
      correctAnswer: 'sample',
      acceptableAnswers: ['sample', 'example'],
      targetAlienId: `placeholder-${i}`,
      difficulty,
      band: (difficulty + 4) as 5 | 6 | 7 | 8
    });
  }
  
  return questions;
}

// Get tips by band target
export async function getTipsByBandTarget(band: 5 | 6 | 7 | 8): Promise<IELTSTip[]> {
  const data = await ieltsApi.fetchAllData();
  return data.tips.filter(tip => tip.bandTarget === band);
}

// Get facts by difficulty
export async function getFactsByDifficulty(
  difficulty: 'easy' | 'medium' | 'hard'
): Promise<DoYouKnowFact[]> {
  const data = await ieltsApi.fetchAllData();
  return data.facts.filter(fact => fact.difficulty === difficulty);
}

// Search tips by keyword
export async function searchTips(keyword: string): Promise<IELTSTip[]> {
  const data = await ieltsApi.fetchAllData();
  const lowerKeyword = keyword.toLowerCase();
  return data.tips.filter(tip =>
    tip.title.toLowerCase().includes(lowerKeyword) ||
    tip.content.toLowerCase().includes(lowerKeyword) ||
    tip.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
  );
}

// Search facts by keyword
export async function searchFacts(keyword: string): Promise<DoYouKnowFact[]> {
  const data = await ieltsApi.fetchAllData();
  const lowerKeyword = keyword.toLowerCase();
  return data.facts.filter(fact =>
    fact.title.toLowerCase().includes(lowerKeyword) ||
    fact.fact.toLowerCase().includes(lowerKeyword) ||
    (fact.example && fact.example.toLowerCase().includes(lowerKeyword))
  );
}

// Clear cache (useful for testing or when data updates)
export function clearIELTSApiCache(): void {
  ieltsApi['cache'] = null;
  ieltsApi['lastFetch'] = 0;
}

// Export all functions
export default {
  generateExtendedQuestion,
  getRandomIELTSTip,
  getRandomDoYouKnowFact,
  getVocabularySetByBand,
  getAllAPIData,
  getQuestionsByDifficulty,
  getTipsByBandTarget,
  getFactsByDifficulty,
  searchTips,
  searchFacts,
  clearIELTSApiCache
};
