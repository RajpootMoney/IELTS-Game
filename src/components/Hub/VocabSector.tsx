import { useState, useCallback } from 'react';
import { GameMode } from '../../types/mode.types';
import { GAME_MODES } from '../../data/gameModes';
import { audioEngine } from '../../utils/audioUtils';
import HubBackground from './HubBackground';

interface VocabSectorProps {
  onStartArcade: (mode: GameMode) => void;
  onBack: () => void;
}

const accentClasses = {
  cyan: 'border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10',
  pink: 'border-neon-pink text-neon-pink hover:bg-neon-pink/10',
  yellow: 'border-neon-yellow text-neon-yellow hover:bg-neon-yellow/10',
  green: 'border-neon-green text-neon-green hover:bg-neon-green/10',
} as const;

const selectedAccent = {
  cyan: 'bg-neon-cyan text-black border-neon-cyan',
  pink: 'bg-neon-pink text-black border-neon-pink',
  yellow: 'bg-neon-yellow text-black border-neon-yellow',
  green: 'bg-neon-green text-black border-neon-green',
} as const;

export default function VocabSector({ onStartArcade, onBack }: VocabSectorProps) {
  const [selectedMode, setSelectedMode] = useState<GameMode>('classic');

  const handleStart = useCallback(() => {
    audioEngine.resume();
    audioEngine.play('buttonClick');
    onStartArcade(selectedMode);
  }, [onStartArcade, selectedMode]);

  return (
    <HubBackground tint="purple">
      <header className="p-4 border-b border-gray-800">
        <button
          type="button"
          onClick={() => {
            audioEngine.play('buttonClick');
            onBack();
          }}
          className="font-pixel text-xs text-gray-400 hover:text-white"
        >
          ← MISSION MAP
        </button>
        <h1 className="font-pixel text-lg text-center mt-2 text-neon-purple">🚀 VOCAB SECTOR</h1>
        <p className="font-mono text-xs text-center text-gray-400">Arcade drills — word invaders</p>
      </header>

      <div className="flex-1 overflow-y-auto p-4 max-w-lg mx-auto w-full space-y-4">
        {GAME_MODES.map((mode) => (
          <button
            key={mode.id}
            type="button"
            onClick={() => {
              audioEngine.play('buttonClick');
              setSelectedMode(mode.id);
            }}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all font-mono ${
              selectedMode === mode.id ? selectedAccent[mode.accent] : accentClasses[mode.accent]
            }`}
          >
            <span className="font-pixel text-sm block mb-1">
              {mode.icon} {mode.title}
            </span>
            <span
              className={`text-xs ${selectedMode === mode.id ? 'text-black/80' : 'text-gray-400'}`}
            >
              {mode.description}
            </span>
          </button>
        ))}
        <button type="button" onClick={handleStart} className="game-button w-full py-4">
          LAUNCH — {GAME_MODES.find((m) => m.id === selectedMode)?.title.toUpperCase()}
        </button>
      </div>
    </HubBackground>
  );
}
