import { useCallback } from 'react';
import { audioEngine } from '../../utils/audioUtils';

interface StartScreenProps {
  onStartGame: () => void;
}

export default function StartScreen({ onStartGame }: StartScreenProps) {
  const handleStartClick = useCallback(() => {
    audioEngine.resume();
    audioEngine.play('buttonClick');
    onStartGame();
  }, [onStartGame]);

  const handleHowToPlay = useCallback(() => {
    audioEngine.play('buttonClick');
    alert(`HOW TO PLAY:

1. Aliens are descending from the top of the screen
2. Each alien displays an IELTS vocabulary word or definition
3. Read the question prompt at the bottom
4. Type the correct answer (synonym, word, or fill-in-the-blank)
5. Press ENTER to submit

SCORING:
- Correct answer: 100 points + combo multiplier
- Combo increases by 0.5x for each consecutive correct answer
- Wrong answers reset your combo
- Let aliens reach the bottom = lose a life

Good luck!`);
  }, []);

  return (
    <div className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden">
      {/* Animated starfield background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-cyan-900/20" />
        <div className="absolute inset-0 grid-bg opacity-30" />
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse-glow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.5 + 0.2
            }}
          />
        ))}
      </div>
      
      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        {/* Title */}
        <div className="mb-12">
          <h1 className="font-pixel text-4xl md:text-6xl lg:text-7xl mb-4 animate-float">
            <span className="text-neon-pink neon-text">IELTS</span>
            <span className="text-white mx-2">WORD</span>
            <span className="text-neon-cyan neon-text">INVADERS</span>
          </h1>
          <p className="text-neon-green font-mono text-sm md:text-base mt-4 animate-pulse-glow">
            Master IELTS vocabulary while defending Earth!
          </p>
        </div>
        
        {/* Menu buttons */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleStartClick}
            className="game-button text-lg min-w-[250px] animate-pulse-glow"
          >
            START GAME
          </button>
          
          <button
            onClick={handleHowToPlay}
            className="px-8 py-3 font-pixel text-xs text-neon-yellow border border-neon-yellow 
                       hover:bg-neon-yellow hover:text-game-bg transition-all duration-200
                       hover:shadow-[0_0_20px_#FFFF00]"
          >
            HOW TO PLAY
          </button>
        </div>
        
        {/* Stats preview */}
        <div className="mt-12 flex justify-center gap-8 text-xs font-mono text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-neon-pink rounded-full"></span>
            <span>50+ Words</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-neon-cyan rounded-full"></span>
            <span>3 Difficulty Levels</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-neon-green rounded-full"></span>
            <span>Retro Arcade Style</span>
          </div>
        </div>
      </div>
      
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none scanlines" />
    </div>
  );
}
