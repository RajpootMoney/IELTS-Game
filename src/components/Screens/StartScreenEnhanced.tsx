import { useState, useCallback } from 'react';
import { audioEngine } from '../../utils/audioUtils';
import IELTSTips from '../UI/IELTSTips';
import DoYouKnow from '../UI/DoYouKnow';

interface StartScreenProps {
  onStartGame: () => void;
}

export default function StartScreenEnhanced({ onStartGame }: StartScreenProps) {
  const [activeTab, setActiveTab] = useState<'menu' | 'tips' | 'facts' | 'how-to'>('menu');
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const handleStartClick = useCallback(() => {
    audioEngine.resume();
    audioEngine.play('buttonClick');
    onStartGame();
  }, [onStartGame]);

  const handleTabChange = useCallback((tab: 'menu' | 'tips' | 'facts' | 'how-to') => {
    audioEngine.play('buttonClick');
    setActiveTab(tab);
  }, []);

  const handleHowToPlay = useCallback(() => {
    audioEngine.play('buttonClick');
    setShowHowToPlay(true);
  }, []);

  const closeHowToPlay = useCallback(() => {
    audioEngine.play('buttonClick');
    setShowHowToPlay(false);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-cyan-900/20" />
        <div className="absolute inset-0 grid-bg opacity-30" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <div className="text-center pt-8 pb-4 px-4">
          <h1 className="font-pixel text-4xl md:text-6xl lg:text-7xl mb-4 animate-float">
            <span className="text-neon-pink neon-text">IELTS</span>
            <span className="text-white mx-2">WORD</span>
            <span className="text-neon-cyan neon-text">INVADERS</span>
          </h1>
          <p className="text-neon-green font-mono text-sm md:text-base mt-4 animate-pulse-glow">
            Master IELTS vocabulary while defending Earth!
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center gap-2 px-4 mb-6">
          {[
            { id: 'menu', label: 'MAIN MENU', icon: '🎮' },
            { id: 'tips', label: 'IELTS TIPS', icon: '💡' },
            { id: 'facts', label: 'DO YOU KNOW?', icon: '🧠' },
            { id: 'how-to', label: 'HOW TO PLAY', icon: '📖' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as typeof activeTab)}
              className={`px-3 md:px-4 py-2 rounded font-pixel text-xs md:text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-neon-cyan text-black'
                  : 'bg-black/50 text-gray-400 hover:text-white border border-gray-600'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-4 pb-20">
          {activeTab === 'menu' && (
            <div className="max-w-md mx-auto space-y-6">
              {/* Main Menu Buttons */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleStartClick}
                  className="game-button text-lg min-w-[250px] animate-pulse-glow py-6"
                >
                  START GAME
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleTabChange('tips')}
                    className="px-4 py-4 font-pixel text-xs text-neon-cyan border border-neon-cyan rounded hover:bg-neon-cyan/10 transition-all"
                  >
                    💡 IELTS TIPS
                  </button>

                  <button
                    onClick={() => handleTabChange('facts')}
                    className="px-4 py-4 font-pixel text-xs text-neon-yellow border border-neon-yellow rounded hover:bg-neon-yellow/10 transition-all"
                  >
                    🧠 DO YOU KNOW?
                  </button>
                </div>

                <button
                  onClick={handleHowToPlay}
                  className="px-6 py-3 font-pixel text-xs text-neon-green border border-neon-green rounded hover:bg-neon-green/10 transition-all"
                >
                  📖 HOW TO PLAY
                </button>
              </div>

              {/* Stats preview */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-700">
                <div className="text-center">
                  <div className="font-pixel text-2xl text-neon-pink">50+</div>
                  <div className="font-mono text-xs text-gray-400">Words</div>
                </div>
                <div className="text-center">
                  <div className="font-pixel text-2xl text-neon-cyan">12</div>
                  <div className="font-mono text-xs text-gray-400">Question Types</div>
                </div>
                <div className="text-center">
                  <div className="font-pixel text-2xl text-neon-green">100+</div>
                  <div className="font-mono text-xs text-gray-400">IELTS Tips</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tips' && <IELTSTips />}

          {activeTab === 'facts' && <DoYouKnow />}

          {activeTab === 'how-to' && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-game-bg/90 backdrop-blur-sm border-2 border-neon-green/50 rounded-lg p-6 md:p-8">
                <h3 className="font-pixel text-xl text-neon-green mb-6">HOW TO PLAY</h3>
                
                <div className="space-y-6 font-mono text-sm text-gray-300">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-neon-pink/20 border border-neon-pink rounded flex items-center justify-center font-pixel text-neon-pink">
                      1
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">Aliens Are Attacking!</p>
                      <p>Aliens are descending from the top of the screen. Each alien displays an IELTS vocabulary word, definition, or challenge.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-neon-cyan/20 border border-neon-cyan rounded flex items-center justify-center font-pixel text-neon-cyan">
                      2
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">Read the Question</p>
                      <p>At the bottom of the screen, you'll see a question prompt. It could be asking for a synonym, definition, or to fill in the blank.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-neon-green/20 border border-neon-green rounded flex items-center justify-center font-pixel text-neon-green">
                      3
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">Type Your Answer</p>
                      <p>Type the correct answer and press ENTER to fire your laser. If correct, the alien explodes and you score points!</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-neon-yellow/20 border border-neon-yellow rounded flex items-center justify-center font-pixel text-neon-yellow">
                      4
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">Build Your Combo</p>
                      <p>Each consecutive correct answer increases your combo multiplier. Higher combos = more points!</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-neon-red/20 border border-neon-red rounded flex items-center justify-center font-pixel text-neon-red">
                      ⚠️
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">Watch Out!</p>
                      <p>If aliens reach the bottom, you lose a life. You have 3 lives. When all lives are gone, game over!</p>
                    </div>
                  </div>
                </div>

                {/* Scoring Info */}
                <div className="mt-8 pt-6 border-t border-neon-green/20">
                  <h4 className="font-pixel text-sm text-neon-green mb-4">SCORING</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
                    <div className="bg-black/30 p-3 rounded">
                      <div className="text-neon-pink font-bold">Base Score</div>
                      <div className="text-gray-400">100 points</div>
                    </div>
                    <div className="bg-black/30 p-3 rounded">
                      <div className="text-neon-cyan font-bold">Combo Bonus</div>
                      <div className="text-gray-400">+0.5x per combo</div>
                    </div>
                    <div className="bg-black/30 p-3 rounded">
                      <div className="text-neon-yellow font-bold">Wave Bonus</div>
                      <div className="text-gray-400">Increases each wave</div>
                    </div>
                    <div className="bg-black/30 p-3 rounded">
                      <div className="text-neon-green font-bold">Perfect Bonus</div>
                      <div className="text-gray-400">Clear wave without misses</div>
                    </div>
                  </div>
                </div>

                {/* Question Types */}
                <div className="mt-8 pt-6 border-t border-neon-green/20">
                  <h4 className="font-pixel text-sm text-neon-green mb-4">QUESTION TYPES</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs">
                    {[
                      { type: 'Synonym', color: 'text-neon-pink', desc: 'Find similar words' },
                      { type: 'Definition', color: 'text-neon-cyan', desc: 'Match word to meaning' },
                      { type: 'Fill Blank', color: 'text-neon-green', desc: 'Complete the sentence' },
                      { type: 'Antonym', color: 'text-neon-yellow', desc: 'Find opposite words' },
                      { type: 'Word Form', color: 'text-neon-purple', desc: 'Change word form' },
                      { type: 'Collocation', color: 'text-neon-orange', desc: 'Words that go together' }
                    ].map((item) => (
                      <div key={item.type} className="bg-black/30 p-3 rounded border border-gray-700">
                        <div className={`font-bold ${item.color}`}>{item.type}</div>
                        <div className="text-gray-500">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Close Button */}
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setActiveTab('menu')}
                    className="px-8 py-3 bg-neon-green/20 border border-neon-green text-neon-green font-pixel text-sm rounded hover:bg-neon-green/30 transition-all"
                  >
                    ← BACK TO MENU
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* How to Play Modal */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-game-bg border-2 border-neon-green/50 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-pixel text-xl text-neon-green">HOW TO PLAY</h3>
              <button
                onClick={closeHowToPlay}
                className="text-gray-400 hover:text-white font-pixel"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4 font-mono text-sm text-gray-300">
              <p>Welcome to IELTS Word Invaders! Here's how to play:</p>
              
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Aliens are descending from the top - each has a vocabulary challenge</li>
                <li>Read the question prompt at the bottom of the screen</li>
                <li>Type your answer and press ENTER to fire your laser</li>
                <li>Correct answers destroy aliens and give you points</li>
                <li>Build combo multipliers for consecutive correct answers</li>
                <li>Don't let aliens reach the bottom or you'll lose lives</li>
              </ol>

              <p className="text-neon-green mt-4">Good luck and have fun learning! 🚀</p>
            </div>

            <button
              onClick={closeHowToPlay}
              className="w-full mt-6 py-3 bg-neon-green/20 border border-neon-green text-neon-green font-pixel text-sm rounded hover:bg-neon-green/30 transition-all"
            >
              GOT IT!
            </button>
          </div>
        </div>
      )}

      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none scanlines" />
    </div>
  );
}
