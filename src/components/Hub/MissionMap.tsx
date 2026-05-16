import { useCallback } from 'react';
import { UserProgress } from '../../types/progress.types';
import { SkillZone } from '../../types/hub.types';
import { SKILL_ZONES, DAILY_MIX_XP } from '../../data/zones';
import { audioEngine } from '../../utils/audioUtils';
import HubBackground from './HubBackground';

interface MissionMapProps {
  progress: UserProgress;
  onSelectZone: (zone: SkillZone) => void;
  onDailyMix: () => void;
  onChangeBand: () => void;
}

const zoneBorder: Record<string, string> = {
  cyan: 'border-neon-cyan hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]',
  pink: 'border-neon-pink hover:shadow-[0_0_20px_rgba(255,0,255,0.3)]',
  green: 'border-neon-green hover:shadow-[0_0_20px_rgba(0,255,0,0.3)]',
  yellow: 'border-neon-yellow hover:shadow-[0_0_20px_rgba(255,255,0,0.3)]',
  purple: 'border-neon-purple hover:shadow-[0_0_20px_rgba(157,0,255,0.3)]',
};

export default function MissionMap({
  progress,
  onSelectZone,
  onDailyMix,
  onChangeBand,
}: MissionMapProps) {
  const handleZone = useCallback(
    (zone: SkillZone) => {
      audioEngine.play('buttonClick');
      onSelectZone(zone);
    },
    [onSelectZone]
  );

  return (
    <HubBackground>
      <div className="flex-1 overflow-y-auto">
        <header className="text-center pt-8 pb-4 px-4">
          <h1 className="font-pixel text-3xl md:text-4xl mb-1">
            <span className="text-neon-cyan neon-text">BAND</span>{' '}
            <span className="text-white">QUEST</span>
          </h1>
          <p className="font-mono text-xs text-gray-400">
            Target band <span className="text-neon-green">{progress.targetBand}</span>
            {' · '}
            <button type="button" onClick={onChangeBand} className="underline hover:text-white">
              change
            </button>
          </p>
          <div className="flex justify-center gap-6 mt-4 font-mono text-xs">
            <span className="text-neon-yellow">⚡ {progress.totalXp} XP</span>
            <span className="text-neon-pink">🔥 {progress.dailyStreak} day streak</span>
          </div>
        </header>

        <div className="px-4 max-w-lg mx-auto mb-6">
          <button
            type="button"
            onClick={() => {
              audioEngine.play('buttonClick');
              onDailyMix();
            }}
            disabled={progress.dailyMixCompletedToday}
            className={`w-full p-5 rounded-lg border-2 text-left transition-all ${
              progress.dailyMixCompletedToday
                ? 'border-gray-700 opacity-60 cursor-not-allowed'
                : 'border-neon-yellow bg-neon-yellow/10 hover:bg-neon-yellow/20 animate-pulse-glow'
            }`}
          >
            <span className="font-pixel text-sm text-neon-yellow block mb-1">
              {progress.dailyMixCompletedToday ? '✓ DAILY MIX DONE' : '⚡ TODAY\'S DAILY MIX'}
            </span>
            <span className="font-mono text-xs text-gray-400">
              Listening → Reading → Writing → Speaking · ~8 min · +{DAILY_MIX_XP} XP
            </span>
          </button>
        </div>

        <p className="font-pixel text-xs text-center text-gray-500 mb-4">SKILL ZONES</p>
        <div className="px-4 pb-8 max-w-lg mx-auto grid gap-3">
          {SKILL_ZONES.map((zone) => (
            <button
              key={zone.id}
              type="button"
              onClick={() => handleZone(zone.id)}
              className={`flex items-center gap-4 p-4 rounded-lg border-2 bg-black/40 transition-all text-left ${zoneBorder[zone.accent]}`}
            >
              <span className="text-3xl">{zone.icon}</span>
              <div className="flex-1 min-w-0">
                <span className="font-pixel text-sm text-white block">{zone.title}</span>
                <span className="font-mono text-xs text-gray-400">{zone.subtitle}</span>
              </div>
              <span className="font-pixel text-[10px] text-gray-500">→</span>
            </button>
          ))}
        </div>
      </div>
    </HubBackground>
  );
}
