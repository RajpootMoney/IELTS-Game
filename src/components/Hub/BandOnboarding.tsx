import { useState, useCallback } from 'react';
import { TargetBand } from '../../types/progress.types';
import { audioEngine } from '../../utils/audioUtils';
import HubBackground from './HubBackground';

interface BandOnboardingProps {
  onComplete: (band: TargetBand) => void;
}

const BANDS: { band: TargetBand; label: string; desc: string }[] = [
  { band: 5, label: 'Band 5–5.5', desc: 'Foundation — basic grammar & everyday topics' },
  { band: 6, label: 'Band 6–6.5', desc: 'Competent — ready for most university requirements' },
  { band: 7, label: 'Band 7–7.5', desc: 'Good — academic vocabulary & complex structures' },
  { band: 8, label: 'Band 8+', desc: 'Expert — near-native precision under pressure' },
];

export default function BandOnboarding({ onComplete }: BandOnboardingProps) {
  const [selected, setSelected] = useState<TargetBand>(6);

  const handleStart = useCallback(() => {
    audioEngine.resume();
    audioEngine.play('buttonClick');
    onComplete(selected);
  }, [onComplete, selected]);

  return (
    <HubBackground tint="purple">
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-lg mx-auto">
        <h1 className="font-pixel text-2xl md:text-3xl text-center mb-2">
          <span className="text-neon-cyan neon-text">BAND</span>{' '}
          <span className="text-white">QUEST</span>
        </h1>
        <p className="font-mono text-sm text-gray-400 text-center mb-8">
          What score are you preparing for? Missions adapt to your target band.
        </p>

        <div className="w-full space-y-3 mb-8">
          {BANDS.map(({ band, label, desc }) => (
            <button
              key={band}
              type="button"
              onClick={() => {
                audioEngine.play('buttonClick');
                setSelected(band);
              }}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selected === band
                  ? 'bg-neon-cyan text-black border-neon-cyan'
                  : 'border-gray-600 text-gray-300 hover:border-neon-cyan/50'
              }`}
            >
              <span className="font-pixel text-sm block">{label}</span>
              <span className={`text-xs mt-1 block ${selected === band ? 'text-black/70' : 'text-gray-500'}`}>
                {desc}
              </span>
            </button>
          ))}
        </div>

        <button type="button" onClick={handleStart} className="game-button w-full py-4 text-sm">
          ENTER MISSION MAP →
        </button>
      </div>
    </HubBackground>
  );
}
