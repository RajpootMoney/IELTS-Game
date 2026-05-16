import { WordData } from '../types/game.types';

export const wordBank: WordData[] = [
  // Band 5 Words
  {
    word: "abandon",
    definition: "to leave behind, desert",
    synonyms: ["leave", "desert", "forsake"],
    sentence: "The captain refused to _____ the sinking ship.",
    band: 5
  },
  {
    word: "alleviate",
    definition: "to make suffering or a problem less severe",
    synonyms: ["ease", "relieve", "reduce"],
    sentence: "This medicine should _____ the pain significantly.",
    band: 5
  },
  {
    word: "ambiguous",
    definition: "having more than one possible meaning",
    synonyms: ["unclear", "vague", "uncertain"],
    sentence: "His response was deliberately _____ and confusing.",
    band: 5
  },
  {
    word: "apparent",
    definition: "clearly visible or understood",
    synonyms: ["obvious", "clear", "evident"],
    sentence: "It became _____ that she was not interested.",
    band: 5
  },
  {
    word: "appropriate",
    definition: "suitable or proper in the circumstances",
    synonyms: ["suitable", "proper", "fitting"],
    sentence: "Please wear _____ clothing for the interview.",
    band: 5
  },
  {
    word: "approximately",
    definition: "close to the actual, but not exact",
    synonyms: ["about", "roughly", "around"],
    sentence: "The project will cost _____ $50,000.",
    band: 5
  },
  {
    word: "circumstance",
    definition: "a condition that affects what happens",
    synonyms: ["situation", "condition", "context"],
    sentence: "Given the current _____, we must postpone.",
    band: 5
  },
  {
    word: "compensate",
    definition: "to give something to make up for a loss",
    synonyms: ["repay", "reimburse", "offset"],
    sentence: "The company will _____ you for your time.",
    band: 5
  },
  {
    word: "complement",
    definition: "to add to something in a way that improves it",
    synonyms: ["enhance", "accompany", "complete"],
    sentence: "The wine will _____ the meal perfectly.",
    band: 5
  },
  // Band 6 Words
  {
    word: "mitigate",
    definition: "to make less severe, serious, or painful",
    synonyms: ["alleviate", "reduce", "lessen"],
    sentence: "We need to _____ the environmental impact.",
    band: 6
  },
  {
    word: "collaborate",
    definition: "to work together on a project",
    synonyms: ["cooperate", "partner", "team up"],
    sentence: "The two companies decided to _____ on research.",
    band: 6
  },
  {
    word: "controversial",
    definition: "causing public disagreement",
    synonyms: ["contentious", "debatable", "disputed"],
    sentence: "The new policy is highly _____ among citizens.",
    band: 6
  },
  {
    word: "corresponding",
    definition: "matching or related to something",
    synonyms: ["matching", "equivalent", "comparable"],
    sentence: "The pressure increase had a _____ temperature rise.",
    band: 6
  },
  {
    word: "demonstrate",
    definition: "to show or prove something clearly",
    synonyms: ["show", "prove", "display"],
    sentence: "The study will _____ the effectiveness of the treatment.",
    band: 6
  },
  {
    word: "discriminate",
    definition: "to treat unfairly based on prejudice",
    synonyms: ["distinguish", "differentiate", "segregate"],
    sentence: "It is illegal to _____ based on race or gender.",
    band: 6
  },
  {
    word: "eliminate",
    definition: "to completely remove or get rid of",
    synonyms: ["remove", "eradicate", "abolish"],
    sentence: "We need to _____ all possible errors in the data.",
    band: 6
  },
  {
    word: "emphasize",
    definition: "to give special importance or prominence",
    synonyms: ["stress", "highlight", "underline"],
    sentence: "The report did not _____ the risks involved.",
    band: 6
  },
  {
    word: "fluctuate",
    definition: "to rise and fall irregularly in number or amount",
    synonyms: ["vary", "change", "oscillate"],
    sentence: "Prices tend to _____ based on supply and demand.",
    band: 6
  },
  // Band 7 Words
  {
    word: "meticulous",
    definition: "showing great attention to detail",
    synonyms: ["careful", "precise", "thorough"],
    sentence: "Her _____ attention to detail ensured quality results.",
    band: 7
  },
  {
    word: "sophisticated",
    definition: "highly developed and complex",
    synonyms: ["advanced", "complex", "refined"],
    sentence: "The equipment is far too _____ for our needs.",
    band: 7
  },
  {
    word: "ambiguous",
    definition: "open to more than one interpretation",
    synonyms: ["unclear", "vague", "equivocal"],
    sentence: "The contract's wording was deliberately _____.",
    band: 7
  },
  {
    word: "arbitrary",
    definition: "based on random choice rather than reason",
    synonyms: ["random", "whimsical", "subjective"],
    sentence: "The selection process seemed entirely _____.",
    band: 7
  },
  {
    word: "coherent",
    definition: "logical and consistent; forming a unified whole",
    synonyms: ["logical", "consistent", "articulate"],
    sentence: "She presented a _____ argument for the proposal.",
    band: 7
  },
  {
    word: "comprehensive",
    definition: "complete and including all necessary elements",
    synonyms: ["thorough", "extensive", "complete"],
    sentence: "The report provides a _____ analysis of the issue.",
    band: 7
  },
  {
    word: "consequential",
    definition: "important; significant; following as a result",
    synonyms: ["significant", "important", "substantial"],
    sentence: "The discovery had _____ implications for science.",
    band: 7
  },
  {
    word: "divergent",
    definition: "tending to be different or develop in different directions",
    synonyms: ["different", "varying", "disparate"],
    sentence: "Their opinions on the matter were completely _____.",
    band: 7
  },
  {
    word: "ubiquitous",
    definition: "present, appearing, or found everywhere",
    synonyms: ["omnipresent", "pervasive", "universal"],
    sentence: "Smartphones have become _____ in modern society.",
    band: 7
  },
  {
    word: "ephemeral",
    definition: "lasting for a very short time",
    synonyms: ["transient", "fleeting", "momentary"],
    sentence: "Fame in the digital age can be _____.",
    band: 7
  }
];

export function getWordsByBand(band: 5 | 6 | 7): WordData[] {
  return wordBank.filter(word => word.band === band);
}

export function getRandomWords(count: number, minBand: 5, maxBand: 7): WordData[] {
  const filtered = wordBank.filter(word => word.band >= minBand && word.band <= maxBand);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getWordByText(text: string): WordData | undefined {
  return wordBank.find(word => 
    word.word.toLowerCase() === text.toLowerCase() ||
    word.definition.toLowerCase() === text.toLowerCase()
  );
}

export default wordBank;
