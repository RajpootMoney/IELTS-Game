export interface GrammarChallenge {
  id: string;
  flawed: string;
  correct: string;
  tip: string;
  errorLabel: string;
  band: 5 | 6 | 7;
}

export const grammarChallenges: GrammarChallenge[] = [
  {
    id: 'g1',
    flawed: 'She don\'t like studying English.',
    correct: 'She doesn\'t like studying English.',
    tip: 'With he/she/it in the present simple negative, use "doesn\'t" + base verb (not "don\'t").',
    errorLabel: 'Subject–verb agreement',
    band: 5,
  },
  {
    id: 'g2',
    flawed: 'The informations in the report are accurate.',
    correct: 'The information in the report is accurate.',
    tip: '"Information" is uncountable: no plural -s, and it takes a singular verb (is).',
    errorLabel: 'Uncountable nouns',
    band: 6,
  },
  {
    id: 'g3',
    flawed: 'He have been living here since five years.',
    correct: 'He has been living here for five years.',
    tip: 'Use "has" with he/she/it; use "for" + a period of time (not "since" + duration).',
    errorLabel: 'Present perfect + prepositions',
    band: 7,
  },
  {
    id: 'g4',
    flawed: 'Despite of the rain, we went outside.',
    correct: 'Despite the rain, we went outside.',
    tip: '"Despite" and "in spite of" are correct; never say "despite of".',
    errorLabel: 'Prepositions',
    band: 6,
  },
  {
    id: 'g5',
    flawed: 'The students was very happy about their results.',
    correct: 'The students were very happy about their results.',
    tip: 'Plural subject "students" needs the plural verb "were".',
    errorLabel: 'Subject–verb agreement',
    band: 5,
  },
  {
    id: 'g6',
    flawed: 'I am agree with your opinion on climate change.',
    correct: 'I agree with your opinion on climate change.',
    tip: '"Agree" is a verb in English — do not use "am" before it.',
    errorLabel: 'Verb form',
    band: 5,
  },
  {
    id: 'g7',
    flawed: 'The graph shows a increase in sales last year.',
    correct: 'The graph shows an increase in sales last year.',
    tip: 'Use "an" before vowel sounds; "increase" starts with a vowel sound.',
    errorLabel: 'Articles',
    band: 6,
  },
  {
    id: 'g8',
    flawed: 'More people are learning English more and more.',
    correct: 'More and more people are learning English.',
    tip: 'Place "more and more" before the noun phrase it modifies.',
    errorLabel: 'Word order',
    band: 6,
  },
  {
    id: 'g9',
    flawed: 'If I would have more time, I would travel more.',
    correct: 'If I had more time, I would travel more.',
    tip: 'Second conditional: If + past simple, would + base verb (not "would have").',
    errorLabel: 'Conditionals',
    band: 7,
  },
  {
    id: 'g10',
    flawed: 'The government have announced new policies.',
    correct: 'The government has announced new policies.',
    tip: 'Collective nouns like "government" often take singular verbs in formal/academic English.',
    errorLabel: 'Collective nouns',
    band: 7,
  },
  {
    id: 'g11',
    flawed: 'She suggested me to take the IELTS course.',
    correct: 'She suggested that I take the IELTS course.',
    tip: 'Use "suggest + that + clause" or "suggest + gerund"; not "suggest someone to do".',
    errorLabel: 'Verb patterns',
    band: 7,
  },
  {
    id: 'g12',
    flawed: 'There is many reasons for this trend.',
    correct: 'There are many reasons for this trend.',
    tip: '"Many reasons" is plural, so use "There are" (not "There is").',
    errorLabel: 'There is/are',
    band: 5,
  },
  {
    id: 'g13',
    flawed: 'The number of students have increased significantly.',
    correct: 'The number of students has increased significantly.',
    tip: 'The subject is "The number" (singular), so use "has" — not "have".',
    errorLabel: 'Subject–verb agreement',
    band: 7,
  },
  {
    id: 'g14',
    flawed: 'He did a mistake in the writing task.',
    correct: 'He made a mistake in the writing task.',
    tip: 'We "make" mistakes and decisions; we "do" homework and tasks.',
    errorLabel: 'Collocations',
    band: 6,
  },
  {
    id: 'g15',
    flawed: 'The pollution is effecting the local wildlife.',
    correct: 'The pollution is affecting the local wildlife.',
    tip: '"Affect" (verb) = influence; "effect" (noun) = result. Don\'t confuse them.',
    errorLabel: 'Affect vs effect',
    band: 7,
  },
  {
    id: 'g16',
    flawed: 'I look forward to meet you at the conference.',
    correct: 'I look forward to meeting you at the conference.',
    tip: 'After "look forward to", use a gerund (-ing), not the infinitive.',
    errorLabel: 'Gerunds after prepositions',
    band: 6,
  },
  {
    id: 'g17',
    flawed: 'The children plays in the park every evening.',
    correct: 'The children play in the park every evening.',
    tip: 'Plural "children" needs the base form "play" (no -s) in present simple.',
    errorLabel: 'Subject–verb agreement',
    band: 5,
  },
  {
    id: 'g18',
    flawed: 'He is more taller than his brother.',
    correct: 'He is taller than his brother.',
    tip: 'Do not use "more" with -er comparatives; "taller" is already comparative.',
    errorLabel: 'Comparatives',
    band: 5,
  },
];

export function pickGrammarChallenges(count: number, wave: number): GrammarChallenge[] {
  const minBand = wave <= 2 ? 5 : wave <= 4 ? 6 : 7;
  const pool = grammarChallenges.filter((c) => c.band <= minBand + 1);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const result: GrammarChallenge[] = [];
  for (let i = 0; i < count; i++) {
    result.push(shuffled[i % shuffled.length]);
  }
  return result;
}
