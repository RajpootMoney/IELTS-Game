import { useCallback } from 'react';
import { audioEngine } from '../../utils/audioUtils';
import { WordData } from '../../types/game.types';

interface GameStats {
  score: number;
  wordsCorrect: number;
  accuracy: number;
  highestCombo: number;
  wrongWords: WordData[];
}

interface GameOverScreenProps {
  stats: GameStats;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export default function GameOverScreen({ stats, onPlayAgain, onMainMenu }: GameOverScreenProps) {
  const handlePlayAgain = useCallback(() => {
    audioEngine.play('buttonClick');
    onPlayAgain();
  }, [onPlayAgain]);

  const handleMainMenu = useCallback(() => {
    audioEngine.play('buttonClick');
    onMainMenu();
  }, [onMainMenu]);

  const getRank = (score: number): string => {
    if (score >= 5000) return 'IELTS MASTER';
    if (score >= 3000) return 'VOCABULARY EXPERT';
    if (score >= 1500) return 'WORD WARRIOR';
    if (score >= 500) return 'LANGUAGE LEARNER';
    return 'BEGINNER';
  };

  const getRankColor = (score: number): string => {
    if (score >= 5000) return 'text-neon-pink';
    if (score >= 3000) return 'text-neon-cyan';
    if (score >= 1500) return 'text-neon-green';
    if (score >= 500) return 'text-neon-yellow';
    return 'text-gray-400';
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden p-4">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 via-purple-900/10 to-blue-900/10" />
        <div className="absolute inset-0 grid-bg opacity-20" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl w-full">
        {/* GAME OVER title */}
        <div className="mb-8">
          <h1 className="font-pixel text-4xl md:text-6xl mb-2 animate-pulse-glow">
            <span className="text-neon-red neon-text">GAME OVER</span>
          </h1>
          <p className={`font-pixel text-lg ${getRankColor(stats.score)}`}>
            {getRank(stats.score)}
          </p>
        </div>

        {/* Score display */}
        <div className="mb-8 p-6 border-2 border-neon-cyan/30 rounded-lg bg-black/40">
          <p className="font-mono text-gray-400 text-sm mb-2">FINAL SCORE</p>
          <p className="font-pixel text-4xl md:text-5xl text-neon-cyan neon-text">
            {stats.score.toLocaleString()}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-black/30 border border-neon-pink/30 rounded">
            <p className="font-mono text-xs text-gray-400">CORRECT</p>
            <p className="font-pixel text-xl text-neon-pink">{stats.wordsCorrect}</p>
          </div>
          <div className="p-4 bg-black/30 border border-neon-cyan/30 rounded">
            <p className="font-mono text-xs text-gray-400">ACCURACY</p>
            <p className="font-pixel text-xl text-neon-cyan">{stats.accuracy}%</p>
          </div>
          <div className="p-4 bg-black/30 border border-neon-green/30 rounded">
            <p className="font-mono text-xs text-gray-400">MAX COMBO</p>
            <p className="font-pixel text-xl text-neon-green">{stats.highestCombo}x</p>
          </div>
          <div className="p-4 bg-black/30 border border-neon-yellow/30 rounded">
            <p className="font-mono text-xs text-gray-400">TO REVIEW</p>
            <p className="font-pixel text-xl text-neon-yellow">{stats.wrongWords.length}</p>
          </div>
        </div>

        {/* Words to review */}
        {stats.wrongWords.length > 0 && (
          <div className="mb-8 p-4 bg-black/30 border border-neon-red/30 rounded max-h-32 overflow-y-auto">
            <p className="font-mono text-xs text-neon-red mb-2">WORDS TO REVIEW:</p>
            <div className="flex flex-wrap gap-2">
              {stats.wrongWords.map((word, index) => (
                <span
                  key={index}
                  className="font-mono text-xs text-gray-300 bg-black/50 px-2 py-1 rounded"
                  title={word.definition}
                >
                  {word.word}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handlePlayAgain}
            className="game-button text-lg px-12"
          >
            PLAY AGAIN
          </button>
          <button
            onClick={handleMainMenu}
            className="px-8 py-4 font-pixel text-sm border-2 border-gray-500 text-gray-400
                       hover:border-white hover:text-white transition-all duration-200"
          >
            MAIN MENU
          </button>
        </div>
      </div>

      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none scanlines" />
    </div>
  );
}
