import { useState, useEffect } from 'react';
import { DoYouKnowFact } from '../../types/question.types';
import { getRandomDoYouKnowFact, searchFacts, getFactsByDifficulty } from '../../data/extendedQuestionGenerator';
import { audioEngine } from '../../utils/audioUtils';

export default function DoYouKnow() {
  const [currentFact, setCurrentFact] = useState<DoYouKnowFact | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DoYouKnowFact[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const [category, setCategory] = useState<DoYouKnowFact['category'] | null>(null);
  const [showExample, setShowExample] = useState(false);

  // Load initial fact
  useEffect(() => {
    loadRandomFact();
  }, []);

  const loadRandomFact = async () => {
    setLoading(true);
    setShowExample(false);
    try {
      const fact = await getRandomDoYouKnowFact(category || undefined);
      setCurrentFact(fact);
      audioEngine.play('buttonClick');
    } catch (error) {
      console.error('Error loading fact:', error);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await searchFacts(searchQuery);
      setSearchResults(results);
      audioEngine.play('buttonClick');
    } catch (error) {
      console.error('Error searching facts:', error);
    }
    setLoading(false);
  };

  const handleDifficultyFilter = async (difficulty: 'easy' | 'medium' | 'hard') => {
    setSelectedDifficulty(difficulty);
    setLoading(true);
    try {
      const facts = await getFactsByDifficulty(difficulty);
      if (facts.length > 0) {
        setCurrentFact(facts[Math.floor(Math.random() * facts.length)]);
      }
      audioEngine.play('buttonClick');
    } catch (error) {
      console.error('Error filtering facts:', error);
    }
    setLoading(false);
  };

  const getCategoryIcon = (cat: DoYouKnowFact['category']) => {
    switch (cat) {
      case 'vocabulary': return '📚';
      case 'grammar': return '📝';
      case 'exam': return '📋';
      case 'strategy': return '🎯';
      case 'common_mistake': return '⚠️';
      default: return '💡';
    }
  };

  const getCategoryLabel = (cat: DoYouKnowFact['category']) => {
    switch (cat) {
      case 'vocabulary': return 'Vocabulary';
      case 'grammar': return 'Grammar';
      case 'exam': return 'Exam Info';
      case 'strategy': return 'Strategy';
      case 'common_mistake': return 'Common Mistake';
      default: return 'General';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-400/10';
      case 'medium': return 'bg-yellow-400/10';
      case 'hard': return 'bg-red-400/10';
      default: return 'bg-gray-400/10';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-2">
          <span className="text-4xl">🧠</span>
          <h2 className="font-pixel text-2xl md:text-3xl text-neon-yellow neon-text">
            DO YOU KNOW?
          </h2>
        </div>
        <p className="font-mono text-sm text-gray-400">
          Fascinating IELTS facts and insights
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-game-bg/80 backdrop-blur-sm border border-neon-yellow/30 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search facts..."
                className="flex-1 bg-black/50 border border-neon-yellow/50 rounded px-3 py-2 font-mono text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-yellow"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-neon-yellow/20 border border-neon-yellow text-neon-yellow font-pixel text-xs rounded hover:bg-neon-yellow/30 transition-colors"
              >
                SEARCH
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2">
            {(['vocabulary', 'grammar', 'exam', 'strategy', 'common_mistake'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(category === cat ? null : cat);
                  if (category !== cat) loadRandomFact();
                }}
                className={`px-3 py-2 rounded font-pixel text-xs transition-all ${
                  category === cat
                    ? 'bg-neon-pink text-white'
                    : 'bg-black/50 text-gray-400 hover:text-white border border-gray-600'
                }`}
                title={getCategoryLabel(cat)}
              >
                {getCategoryIcon(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-neon-yellow/20">
          <span className="font-mono text-xs text-gray-500 py-2">DIFFICULTY:</span>
          {(['easy', 'medium', 'hard'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => handleDifficultyFilter(diff)}
              className={`px-3 py-1 rounded font-pixel text-xs transition-all ${
                selectedDifficulty === diff
                  ? 'bg-neon-green text-black'
                  : 'bg-black/50 text-gray-400 hover:text-white border border-gray-600'
              }`}
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Fact Display */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-2 border-neon-yellow border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-mono text-sm text-gray-400">Loading fact...</p>
        </div>
      ) : currentFact ? (
        <div className="bg-game-bg/90 backdrop-blur-sm border-2 border-neon-yellow/50 rounded-lg p-6 md:p-8 shadow-[0_0_30px_rgba(255,255,0,0.2)]">
          {/* Fact Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-6 border-b border-neon-yellow/20">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{getCategoryIcon(currentFact.category)}</span>
              <div>
                <span className="font-pixel text-xs text-neon-yellow uppercase tracking-wider">
                  {getCategoryLabel(currentFact.category)}
                </span>
                <h3 className="font-pixel text-lg md:text-xl text-white mt-1">
                  {currentFact.title}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`font-pixel text-xs px-3 py-1 rounded ${getDifficultyColor(currentFact.difficulty)} ${getDifficultyBg(currentFact.difficulty)}`}>
                {currentFact.difficulty.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Fact Content */}
          <div className="space-y-6">
            <p className="font-mono text-base md:text-lg text-gray-200 leading-relaxed">
              {currentFact.fact}
            </p>
            
            {/* Example */}
            {currentFact.example && (
              <div className="bg-black/30 border-l-4 border-neon-yellow rounded p-4">
                <p className="font-mono text-sm text-neon-yellow mb-2">Example:</p>
                <p className="font-mono text-sm text-gray-300 italic">
                  "{currentFact.example}"
                </p>
              </div>
            )}
            
            {/* Related Words */}
            {currentFact.relatedWords && currentFact.relatedWords.length > 0 && (
              <div className="pt-4">
                <p className="font-mono text-xs text-gray-500 mb-2">RELATED WORDS:</p>
                <div className="flex flex-wrap gap-2">
                  {currentFact.relatedWords.map((word) => (
                    <span
                      key={word}
                      className="font-mono text-xs text-neon-cyan bg-neon-cyan/10 px-2 py-1 rounded"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-neon-yellow/20">
            <button
              onClick={() => setShowExample(!showExample)}
              className={`px-6 py-3 border font-pixel text-xs rounded transition-all ${
                showExample
                  ? 'bg-neon-yellow text-black border-neon-yellow'
                  : 'bg-transparent text-neon-yellow border-neon-yellow hover:bg-neon-yellow/10'
              }`}
            >
              {showExample ? 'HIDE EXAMPLE' : 'SHOW EXAMPLE'}
            </button>
            <button
              onClick={loadRandomFact}
              className="px-8 py-3 bg-neon-yellow/20 border border-neon-yellow text-neon-yellow font-pixel text-xs rounded hover:bg-neon-yellow/30 transition-all hover:shadow-[0_0_20px_rgba(255,255,0,0.4)]"
            >
              NEXT FACT →
            </button>
          </div>
        </div>
      ) : null}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mt-8">
          <h3 className="font-pixel text-lg text-neon-yellow mb-4">
            SEARCH RESULTS ({searchResults.length})
          </h3>
          <div className="grid gap-4">
            {searchResults.slice(0, 5).map((fact) => (
              <div
                key={fact.id}
                onClick={() => {
                  setCurrentFact(fact);
                  setSearchResults([]);
                  audioEngine.play('buttonClick');
                }}
                className="bg-black/40 border border-neon-yellow/30 rounded p-4 cursor-pointer hover:border-neon-yellow/60 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getCategoryIcon(fact.category)}</span>
                  <div>
                    <h4 className="font-pixel text-sm text-white">{fact.title}</h4>
                    <p className="font-mono text-xs text-gray-400 truncate">{fact.fact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
