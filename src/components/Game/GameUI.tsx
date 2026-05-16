interface GameUIProps {
  score: number;
  lives: number;
  wave: number;
  combo: number;
  comboMultiplier: number;
}

export default function GameUI({ score, lives, wave, combo, comboMultiplier }: GameUIProps) {
  return (
    <>
      {/* Top bar - Score and stats */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-4 z-20">
        {/* Score */}
        <div className="flex flex-col">
          <span className="font-mono text-xs text-gray-400">SCORE</span>
          <span className="font-pixel text-xl md:text-2xl text-neon-cyan neon-text">
            {score.toLocaleString()}
          </span>
        </div>
        
        {/* Center - Wave */}
        <div className="flex flex-col items-center">
          <span className="font-mono text-xs text-gray-400">WAVE</span>
          <span className="font-pixel text-xl md:text-2xl text-neon-yellow neon-text">
            {wave}
          </span>
        </div>
        
        {/* Lives */}
        <div className="flex flex-col items-end">
          <span className="font-mono text-xs text-gray-400">LIVES</span>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className={`font-pixel text-xl md:text-2xl ${
                  i < lives 
                    ? 'text-neon-pink neon-text' 
                    : 'text-gray-600'
                }`}
              >
                ♥
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Combo display */}
      {combo > 0 && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex flex-col items-center">
            <span className="font-pixel text-3xl md:text-4xl text-neon-green neon-text animate-pulse-glow">
              {combo}x
            </span>
            <span className="font-mono text-xs text-neon-green">
              COMBO (x{comboMultiplier.toFixed(1)})
            </span>
          </div>
        </div>
      )}
    </>
  );
}
