export type GameMode = 'classic' | 'shooter' | 'speedrun' | 'grammar';

export interface GameModeInfo {
  id: GameMode;
  title: string;
  icon: string;
  description: string;
  accent: 'cyan' | 'pink' | 'yellow' | 'green';
}
