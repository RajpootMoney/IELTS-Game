import { WordData, Question, QuestionType, Alien } from '../types/game.types';

export function generateQuestion(
  wordData: WordData, 
  targetAlienId: string
): Question {
  const types: QuestionType[] = ['synonym', 'definition', 'fillBlank'];
  const selectedType = types[Math.floor(Math.random() * types.length)];
  
  let prompt = '';
  let correctAnswer = '';
  let acceptableAnswers: string[] = [];
  
  switch (selectedType) {
    case 'synonym':
      prompt = `Type a synonym of "${wordData.word}"`;
      correctAnswer = wordData.synonyms[0];
      acceptableAnswers = [...wordData.synonyms, wordData.word];
      break;
      
    case 'definition':
      prompt = `Type the word for: "${wordData.definition}"`;
      correctAnswer = wordData.word;
      acceptableAnswers = [wordData.word];
      break;
      
    case 'fillBlank':
      const sentence = wordData.sentence;
      const blankedSentence = sentence.replace('_____', '______');
      prompt = `Fill in the blank: "${blankedSentence}"`;
      correctAnswer = wordData.word;
      acceptableAnswers = [wordData.word];
      break;
  }
  
  return {
    type: selectedType,
    prompt,
    correctAnswer: correctAnswer.toLowerCase(),
    targetAlienId,
    acceptableAnswers: acceptableAnswers.map(a => a.toLowerCase())
  };
}

export function createAlien(
  wordData: WordData,
  row: number,
  col: number,
  id: string,
  canvasWidth: number
): Alien {
  const alienWidth = 50;
  const alienHeight = 35;
  const spacingX = 70;
  const spacingY = 50;
  const startX = (canvasWidth - (8 * spacingX)) / 2 + 20;
  const startY = 80;
  
  // Alternate colors for visual variety
  const colors = ['#FF00FF', '#00FFFF', '#00FF00', '#FFFF00', '#FF00FF'];
  
  // Determine what to display on the alien
  const questionTypes: QuestionType[] = ['synonym', 'definition', 'fillBlank'];
  const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
  
  let displayText = '';
  switch (questionType) {
    case 'synonym':
      displayText = wordData.word;
      break;
    case 'definition':
      // Truncate long definitions
      displayText = wordData.definition.length > 30 
        ? wordData.definition.substring(0, 27) + '...'
        : wordData.definition;
      break;
    case 'fillBlank':
      displayText = wordData.word;
      break;
  }
  
  return {
    id,
    x: startX + col * spacingX,
    y: startY + row * spacingY,
    width: alienWidth,
    height: alienHeight,
    word: displayText,
    wordData,
    questionType,
    isAlive: true,
    bobOffset: Math.random() * Math.PI * 2,
    color: colors[row % colors.length]
  };
}

export function checkAnswer(
  answer: string,
  question: Question
): boolean {
  const normalizedAnswer = answer.toLowerCase().trim();
  
  // Check exact match with acceptable answers
  if (question.acceptableAnswers.includes(normalizedAnswer)) {
    return true;
  }
  
  // Check if answer is close to the correct answer (for typos)
  const similarity = calculateSimilarity(normalizedAnswer, question.correctAnswer);
  if (similarity > 0.8) {
    return true;
  }
  
  return false;
}

function calculateSimilarity(str1: string, str2: string): number {
  if (str1 === str2) return 1.0;
  if (str1.length === 0 || str2.length === 0) return 0.0;
  
  // Simple Levenshtein distance
  const matrix: number[][] = [];
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  
  const distance = matrix[str2.length][str1.length];
  const maxLength = Math.max(str1.length, str2.length);
  return 1 - distance / maxLength;
}

export default {
  generateQuestion,
  createAlien,
  checkAnswer
};
