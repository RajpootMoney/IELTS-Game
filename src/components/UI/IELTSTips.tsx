import { useState, useEffect } from 'react';
import { IELTSTip } from '../../types/question.types';
import { getRandomIELTSTip, searchTips, getTipsByBandTarget } from '../../data/extendedQuestionGenerator';
import { audioEngine } from '../../utils/audioUtils';

export default function IELTSTips() {
  const [currentTip, setCurrentTip] = useState<IELTSTip | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<IELTSTip[]>([]);
  const [selectedBand, setSelectedBand] = useState<5 | 6 | 7 | 8 | null>(null);
  const [category, setCategory] = useState<IELTSTip['category'] | null>(null);

  // Load initial tip
  useEffect(() => {
    loadRandomTip();
  }, []);

  const loadRandomTip = async () => {
    setLoading(true);
    try {
      const tip = await getRandomIELTSTip(category || undefined);
      setCurrentTip(tip);
      audioEngine.play('buttonClick');
    } catch (error) {
      console.error('Error loading tip:', error);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await searchTips(searchQuery);
      setSearchResults(results);
      audioEngine.play('buttonClick');
    } catch (error) {
      console.error('Error searching tips:', error);
    }
    setLoading(false);
  };

  const handleBandFilter = async (band: 5 | 6 | 7 | 8) => {
    setSelectedBand(band);
    setLoading(true);
    try {
      const tips = await getTipsByBandTarget(band);
      if (tips.length > 0) {
        setCurrentTip(tips[Math.floor(Math.random() * tips.length)]);
      }
      audioEngine.play('buttonClick');
    } catch (error) {
      console.error('Error filtering tips:', error);
    }
    setLoading(false);
  };

  const getCategoryIcon = (cat: IELTSTip['category']) => {
    switch (cat) {
      case 'listening': return '🎧';
      case 'reading': return '📖';
      case 'writing': return '✍️';
      case 'speaking': return '🗣️';
      case 'general': return '💡';
      default: return '💡';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-pixel text-2xl md:text-3xl text-neon-cyan neon-text mb-2">
          IELTS TIPS & TRICKS
        </h2>
        <p className="font-mono text-sm text-gray-400">
          Expert strategies to boost your band score
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-game-bg/80 backdrop-blur-sm border border-neon-cyan/30 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tips..."
                className="flex-1 bg-black/50 border border-neon-cyan/50 rounded px-3 py-2 font-mono text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-neon-cyan/20 border border-neon-cyan text-neon-cyan font-pixel text-xs rounded hover:bg-neon-cyan/30 transition-colors"
              >
                SEARCH
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2">
            {(['listening', 'reading', 'writing', 'speaking', 'general'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(category === cat ? null : cat);
                  if (category !== cat) loadRandomTip();
                }}
                className={`px-3 py-2 rounded font-pixel text-xs transition-all ${
                  category === cat
                    ? 'bg-neon-pink text-white'
                    : 'bg-black/50 text-gray-400 hover:text-white border border-gray-600'
                }`}
                title={cat.charAt(0).toUpperCase() + cat.slice(1)}
              >
                {getCategoryIcon(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Band Filter */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-neon-cyan/20">
          <span className="font-mono text-xs text-gray-500 py-2">TARGET BAND:</span>
          {[5, 6, 7, 8].map((band) => (
            <button
              key={band}
              onClick={() => handleBandFilter(band as 5 | 6 | 7 | 8)}
              className={`px-3 py-1 rounded font-pixel text-xs transition-all ${
                selectedBand === band
                  ? 'bg-neon-green text-black'
                  : 'bg-black/50 text-gray-400 hover:text-white border border-gray-600'
              }`}
            >
              Band {band}
            </button>
          ))}
        </div>
      </div>

      {/* Tip Display */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-mono text-sm text-gray-400">Loading tip...</p>
        </div>
      ) : currentTip ? (
        <div className="bg-game-bg/90 backdrop-blur-sm border-2 border-neon-cyan/50 rounded-lg p-6 md:p-8 shadow-[0_0_30px_rgba(0,255,255,0.2)]">
          {/* Tip Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-6 border-b border-neon-cyan/20">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getCategoryIcon(currentTip.category)}</span>
              <div>
                <span className="font-pixel text-xs text-neon-cyan uppercase tracking-wider">
                  {currentTip.category}
                </span>
                <h3 className="font-pixel text-lg md:text-xl text-white mt-1">
                  {currentTip.title}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`font-pixel text-xs px-3 py-1 rounded ${getDifficultyColor(currentTip.difficulty)}`}>
                {currentTip.difficulty.toUpperCase()}
              </span>
              <span className="font-pixel text-xs text-neon-green bg-neon-green/10 px-3 py-1 rounded">
                Band {currentTip.bandTarget}
              </span>
            </div>
          </div>

          {/* Tip Content */}
          <div className="space-y-4">
            <p className="font-mono text-base md:text-lg text-gray-200 leading-relaxed">
              {currentTip.content}
            </p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-4">
              {currentTip.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-xs text-neon-cyan/70 bg-neon-cyan/10 px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center mt-8 pt-6 border-t border-neon-cyan/20">
            <button
              onClick={loadRandomTip}
              className="px-8 py-3 bg-neon-cyan/20 border border-neon-cyan text-neon-cyan font-pixel text-sm rounded hover:bg-neon-cyan/30 transition-all hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]"
            >
              NEXT TIP →
            </button>
          </div>
        </div>
      ) : null}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mt-8">
          <h3 className="font-pixel text-lg text-neon-cyan mb-4">
            SEARCH RESULTS ({searchResults.length})
          </h3>
          <div className="grid gap-4">
            {searchResults.slice(0, 5).map((tip) => (
              <div
                key={tip.id}
                onClick={() => {
                  setCurrentTip(tip);
                  setSearchResults([]);
                  audioEngine.play('buttonClick');
                }}
                className="bg-black/40 border border-neon-cyan/30 rounded p-4 cursor-pointer hover:border-neon-cyan/60 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getCategoryIcon(tip.category)}</span>
                  <div>
                    <h4 className="font-pixel text-sm text-white">{tip.title}</h4>
                    <p className="font-mono text-xs text-gray-400 truncate">{tip.content}</p>
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
