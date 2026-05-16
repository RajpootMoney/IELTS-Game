import { GameModeInfo } from '../types/mode.types';

export const GAME_MODES: GameModeInfo[] = [
  {
    id: 'classic',
    title: 'Classic Q&A',
    icon: '📝',
    description: 'Synonyms, definitions & fill-in-the-blank. Type the answer to zap aliens.',
    accent: 'cyan',
  },
  {
    id: 'shooter',
    title: 'Word Shooter',
    icon: '🎯',
    description: 'Read the clue and type the word shown on the correct alien.',
    accent: 'pink',
  },
  {
    id: 'speedrun',
    title: 'Speed Run',
    icon: '⚡',
    description: '90 seconds on the clock. Score as much as you can before time runs out.',
    accent: 'yellow',
  },
  {
    id: 'grammar',
    title: 'Grammar Fix',
    icon: '✏️',
    description: 'Rewrite flawed sentences. Wrong answers cost a life and show the fix + tip.',
    accent: 'green',
  },
];

export const SPEED_RUN_SECONDS = 90;

export function getModeInfo(mode: GameModeInfo['id']): GameModeInfo {
  return GAME_MODES.find((m) => m.id === mode) ?? GAME_MODES[0];
}
