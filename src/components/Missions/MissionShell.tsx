import HubBackground from '../Hub/HubBackground';
import { audioEngine } from '../../utils/audioUtils';

interface MissionShellProps {
  title: string;
  zone: string;
  step?: string;
  tint?: 'purple' | 'cyan' | 'green' | 'default';
  onExit: () => void;
  children: React.ReactNode;
}

export default function MissionShell({
  title,
  zone,
  step,
  tint = 'default',
  onExit,
  children,
}: MissionShellProps) {
  return (
    <HubBackground tint={tint}>
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <button
          type="button"
          onClick={() => {
            audioEngine.play('buttonClick');
            onExit();
          }}
          className="font-pixel text-xs text-gray-400 hover:text-white"
        >
          ← HUB
        </button>
        <div className="text-center">
          <p className="font-pixel text-[10px] text-gray-500">{zone}</p>
          <h1 className="font-pixel text-sm md:text-base text-white">{title}</h1>
          {step && <p className="font-mono text-xs text-neon-cyan mt-1">{step}</p>}
        </div>
        <div className="w-12" aria-hidden />
      </header>
      <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-2xl mx-auto w-full">{children}</main>
    </HubBackground>
  );
}
