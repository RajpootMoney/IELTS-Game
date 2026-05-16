interface HubBackgroundProps {
  children: React.ReactNode;
  tint?: 'purple' | 'cyan' | 'green' | 'default';
}

const tints = {
  default: 'from-purple-900/20 via-transparent to-cyan-900/20',
  purple: 'from-purple-900/30 via-transparent to-pink-900/10',
  cyan: 'from-cyan-900/25 via-transparent to-blue-900/15',
  green: 'from-green-900/20 via-transparent to-cyan-900/15',
};

export default function HubBackground({ children, tint = 'default' }: HubBackgroundProps) {
  return (
    <div className="relative min-h-[100dvh] flex flex-col overflow-x-hidden">
      <div className="absolute inset-0">
        <div className={`absolute inset-0 bg-gradient-to-b ${tints[tint]}`} />
        <div className="absolute inset-0 grid-bg opacity-25" />
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse-glow"
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23) % 100}%`,
              animationDelay: `${(i % 5) * 0.4}s`,
              opacity: 0.15 + (i % 4) * 0.1,
            }}
          />
        ))}
      </div>
      <div className="relative z-10 flex flex-col min-h-[100dvh]">{children}</div>
      <div className="absolute inset-0 pointer-events-none scanlines" />
    </div>
  );
}
