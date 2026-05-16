import { IELTSTip, DoYouKnowFact, VocabularySet, APIData } from '../types/question.types';

// This service simulates API calls and provides rich IELTS content
// In a production environment, these would be real API calls to IELTS databases

class IELTSApiService {
  private cache: APIData | null = null;
  private cacheExpiry: number = 5 * 60 * 1000; // 5 minutes
  private lastFetch: number = 0;

  // Simulated API delay
  private async simulateDelay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Check if cache is valid
  private isCacheValid(): boolean {
    return this.cache !== null && (Date.now() - this.lastFetch) < this.cacheExpiry;
  }

  // Fetch all data from "API"
  public async fetchAllData(): Promise<APIData> {
    if (this.isCacheValid()) {
      return this.cache!;
    }

    await this.simulateDelay(800);

    const data: APIData = {
      tips: this.generateIELTSTips(),
      facts: this.generateDoYouKnowFacts(),
      vocabularySets: this.generateVocabularySets(),
      lastUpdated: new Date().toISOString()
    };

    this.cache = data;
    this.lastFetch = Date.now();

    return data;
  }

  // Get random tip
  public async getRandomTip(category?: string): Promise<IELTSTip> {
    const data = await this.fetchAllData();
    let tips = data.tips;
    
    if (category) {
      tips = tips.filter(t => t.category === category);
    }
    
    return tips[Math.floor(Math.random() * tips.length)];
  }

  // Get random fact
  public async getRandomFact(category?: string): Promise<DoYouKnowFact> {
    const data = await this.fetchAllData();
    let facts = data.facts;
    
    if (category) {
      facts = facts.filter(f => f.category === category);
    }
    
    return facts[Math.floor(Math.random() * facts.length)];
  }

  // Get vocabulary set
  public async getVocabularySet(band: 5 | 6 | 7 | 8): Promise<VocabularySet> {
    const data = await this.fetchAllData();
    const sets = data.vocabularySets.filter(s => s.band === band);
    return sets[Math.floor(Math.random() * sets.length)];
  }

  // Generate IELTS tips database
  private generateIELTSTips(): IELTSTip[] {
    return [
      {
        id: 'tip-1',
        category: 'listening',
        title: 'Predict the Answer',
        content: 'Before the audio plays, read the questions and predict what type of word is needed (noun, verb, number, etc.). This helps you focus on specific information.',
        difficulty: 'beginner',
        bandTarget: 6,
        tags: ['prediction', 'focus', 'strategy']
      },
      {
        id: 'tip-2',
        category: 'reading',
        title: 'Skim and Scan',
        content: 'First, skim the passage to get the general idea. Then scan for specific keywords from the questions. Don\'t read every word carefully - it wastes time!',
        difficulty: 'intermediate',
        bandTarget: 7,
        tags: ['time-management', 'speed', 'technique']
      },
      {
        id: 'tip-3',
        category: 'writing',
        title: 'Plan Before You Write',
        content: 'Spend 5-10 minutes planning your essay structure. Write down your main ideas and supporting points. A well-planned essay scores higher even with simpler vocabulary.',
        difficulty: 'intermediate',
        bandTarget: 7,
        tags: ['planning', 'structure', 'task-2']
      },
      {
        id: 'tip-4',
        category: 'speaking',
        title: 'Use Discourse Markers',
        content: 'Use words like "however," "moreover," "on the other hand" to connect your ideas. This shows fluency and coherence, which are key scoring criteria.',
        difficulty: 'advanced',
        bandTarget: 8,
        tags: ['fluency', 'coherence', 'connectors']
      },
      {
        id: 'tip-5',
        category: 'general',
        title: 'Learn Word Families',
        content: 'Instead of learning single words, learn word families. For example: economy (n), economic (adj), economically (adv), economize (v). This expands your vocabulary quickly.',
        difficulty: 'intermediate',
        bandTarget: 7,
        tags: ['word-families', 'efficiency', 'expansion']
      },
      {
        id: 'tip-6',
        category: 'listening',
        title: 'Watch for Signpost Words',
        content: 'Words like "firstly," "however," "in conclusion" signal important information or changes in direction. They often precede answers to questions.',
        difficulty: 'intermediate',
        bandTarget: 7,
        tags: ['signpost', 'signals', 'strategy']
      },
      {
        id: 'tip-7',
        category: 'general',
        title: 'Practice Under Timed Conditions',
        content: 'Always practice with a timer. IELTS is as much a test of time management as it is of English. Regular timed practice reduces exam-day stress.',
        difficulty: 'beginner',
        bandTarget: 6,
        tags: ['time-management', 'practice', 'stress-reduction']
      },
      {
        id: 'tip-8',
        category: 'writing',
        title: 'Paraphrase, Don\'t Copy',
        content: 'In Task 1, never copy sentences from the question. Paraphrase using synonyms and different sentence structures. This demonstrates your vocabulary range.',
        difficulty: 'advanced',
        bandTarget: 8,
        tags: ['paraphrasing', 'vocabulary', 'task-1']
      }
    ];
  }

  // Generate Do You Know facts
  private generateDoYouKnowFacts(): DoYouKnowFact[] {
    return [
      {
        id: 'fact-1',
        category: 'vocabulary',
        title: 'Academic Word List (AWL)',
        fact: 'The AWL contains 570 word families that appear frequently in academic texts. Learning just these words can help you understand up to 10% of any academic text!',
        example: 'Words like "analyze," "concept," "establish," and "theory" are all on the AWL.',
        relatedWords: ['academic', 'frequent', 'vocabulary', 'essential'],
        difficulty: 'easy'
      },
      {
        id: 'fact-2',
        category: 'exam',
        title: 'Band Score Calculation',
        fact: 'Your overall IELTS band score is the average of your four test scores (Listening, Reading, Writing, Speaking), rounded to the nearest 0.5.',
        example: 'If you get 6.5 in Listening, 7.0 in Reading, 6.0 in Writing, and 6.5 in Speaking, your overall score is (6.5+7.0+6.0+6.5)÷4 = 6.5.',
        difficulty: 'easy'
      },
      {
        id: 'fact-3',
        category: 'common_mistake',
        title: 'False Friends',
        fact: 'False friends are words in two languages that look similar but have different meanings. They can trick you in IELTS!',
        example: '"Actually" in English means "in fact," but in many languages, a similar-looking word means "currently" or "nowadays."',
        relatedWords: ['actually', 'eventual', 'sensible', 'realize'],
        difficulty: 'medium'
      },
      {
        id: 'fact-4',
        category: 'strategy',
        title: 'The 80/20 Rule for Vocabulary',
        fact: 'Just 100 words make up about 50% of all written English. Learning the most frequent words first gives you the biggest improvement.',
        example: 'Words like "the," "be," "to," "of," and "and" are the most frequent. For academic English, focus on the AWL.',
        relatedWords: ['frequency', 'efficient', 'high-impact', 'core'],
        difficulty: 'easy'
      },
      {
        id: 'fact-5',
        category: 'vocabulary',
        title: 'Word Forms Matter',
        fact: 'Knowing one word is good, but knowing all its forms (noun, verb, adjective, adverb) gives you 4x the vocabulary power!',
        example: 'economy (n) → economic (adj) → economically (adv) → economize (v). IELTS tests your ability to use correct forms.',
        relatedWords: ['flexibility', 'transformation', 'derivation', 'family'],
        difficulty: 'medium'
      },
      {
        id: 'fact-6',
        category: 'common_mistake',
        title: 'Countable vs. Uncountable Nouns',
        fact: 'Many IELTS errors happen with countable/uncountable nouns. Words like "information," "advice," and "research" are uncountable!',
        example: 'Incorrect: "I need some informations." Correct: "I need some information." Also: "many researches" → "much research."',
        relatedWords: ['countable', 'uncountable', 'quantifier', 'grammar'],
        difficulty: 'medium'
      },
      {
        id: 'fact-7',
        category: 'exam',
        title: 'Task Response vs. Task Achievement',
        fact: 'Writing Task 1 is marked on "Task Achievement" (getting all data points), but Task 2 is marked on "Task Response" (answering the question fully).',
        example: 'Task 1: If the graph shows 5 years, you must mention all 5. Task 2: If asked "Do you agree?" you must clearly state your position.',
        difficulty: 'hard'
      },
      {
        id: 'fact-8',
        category: 'strategy',
        title: 'Coherence and Cohesion Markers',
        fact: 'Using linking words (however, therefore, furthermore) can boost your Coherence and Cohesion score, but overusing them or using them incorrectly hurts your score.',
        example: 'Good: "The graph shows an increase. However, this trend reversed in 2010." Bad: "The graph shows an increase. However, it decreased." (Illogical contrast)',
        relatedWords: ['linking', 'transition', 'connector', 'cohesion'],
        difficulty: 'hard'
      }
    ];
  }

  // Generate vocabulary sets
  private generateVocabularySets(): VocabularySet[] {
    return [
      {
        id: 'set-1',
        name: 'Academic Writing Essentials',
        description: 'High-frequency words for IELTS Writing Task 2',
        words: [],
        band: 7,
        category: 'academic',
        difficulty: 4
      },
      {
        id: 'set-2',
        name: 'Graph Description Verbs',
        description: 'Essential verbs for describing trends and changes in Task 1',
        words: [],
        band: 6,
        category: 'writing-task-1',
        difficulty: 3
      },
      {
        id: 'set-3',
        name: 'Speaking Part 3 Connectors',
        description: 'Advanced connectors for expressing complex ideas in Speaking',
        words: [],
        band: 8,
        category: 'speaking',
        difficulty: 5
      },
      {
        id: 'set-4',
        name: 'Environment Vocabulary',
        description: 'Common IELTS topic: environment and sustainability',
        words: [],
        band: 7,
        category: 'topic-based',
        difficulty: 4
      },
      {
        id: 'set-5',
        name: 'Education and Learning',
        description: 'Vocabulary for education-related essay topics',
        words: [],
        band: 6,
        category: 'topic-based',
        difficulty: 3
      }
    ];
  }
}

// Create singleton instance
export const ieltsApi = new IELTSApiService();

export default ieltsApi;
