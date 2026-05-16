import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Shield, Zap, AlertTriangle, ArrowRight } from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import { audioEngine } from '../../utils/audioUtils'
import grammarQuestions from '../../data/grammarQuestions.json'
import grammarTips from '../../data/grammarTips.json'

interface GrammarInvasionModeProps {
  onExit: () => void
}

export default function GrammarInvasionMode({ onExit }: GrammarInvasionModeProps) {
  const { score, lives, streaks, incrementScore, decrementLife, incrementStreak, resetStreak, resetGame } = useGameStore()
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [input, setInput] = useState('')
  const [isExploding, setIsExploding] = useState(false)
  const [showTip, setShowTip] = useState(false)
  const [isSlowMo, setIsSlowMo] = useState(false)
  const [shieldActive, setShieldActive] = useState(false)
  
  const currentQuestion = grammarQuestions[currentIndex]
  const currentTip = currentQuestion ? grammarTips[currentQuestion.errorType as keyof typeof grammarTips] : null
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    resetGame()
  }, [resetGame])

  useEffect(() => {
    if (inputRef.current && !showTip) {
      inputRef.current.focus()
    }
  }, [currentIndex, showTip])

  // Handle asteroid hitting the bottom (time out)
  const handleTimeout = () => {
    if (shieldActive) {
      setShieldActive(false)
      nextQuestion()
    } else {
      handleMistake()
    }
  }

  const handleMistake = () => {
    audioEngine.play('wrong')
    audioEngine.play('lifeLost')
    decrementLife()
    resetStreak()
    setShowTip(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentQuestion) return

    // Clean up input for comparison
    const cleanInput = input.trim().toLowerCase().replace(/[.,!?'"]/g, '')
    const cleanCorrect = currentQuestion.correct.trim().toLowerCase().replace(/[.,!?'"]/g, '')

    if (cleanInput === cleanCorrect) {
      // Correct!
      audioEngine.play('shoot')
      setTimeout(() => audioEngine.play('explosion'), 100)
      audioEngine.play('correctHigh')
      
      setIsExploding(true)
      incrementScore(100 + streaks * 10)
      incrementStreak()
      
      setTimeout(() => {
        setIsExploding(false)
        nextQuestion()
      }, 600)
    } else {
      // Wrong
      setInput('') // clear input to try again, or show tip
      if (shieldActive) {
        setShieldActive(false)
      } else {
        handleMistake()
      }
    }
  }

  const nextQuestion = () => {
    setInput('')
    setShowTip(false)
    setIsSlowMo(false)
    if (currentIndex < grammarQuestions.length - 1) {
      setCurrentIndex(c => c + 1)
    } else {
      // Loop or end game
      setCurrentIndex(0)
    }
  }

  if (lives <= 0) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white p-4">
        <h2 className="text-4xl font-bold text-rose-500 mb-4">GAME OVER</h2>
        <p className="text-xl mb-8">Final Score: {score}</p>
        <button 
          onClick={onExit}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-full font-bold transition-all shadow-[0_0_15px_rgba(8,145,178,0.5)]"
        >
          Return to Base
        </button>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gray-950 overflow-hidden flex flex-col">
      {/* HUD */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-10">
        <div className="flex gap-4">
          <div className="flex items-center gap-1 bg-gray-900/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-800">
            {[...Array(3)].map((_, i) => (
              <Heart 
                key={i} 
                size={20} 
                className={i < lives ? "text-rose-500 fill-rose-500" : "text-gray-700"} 
              />
            ))}
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-gray-800 font-mono text-cyan-400">
            {score.toString().padStart(6, '0')}
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          {streaks > 2 && (
            <div className="text-orange-400 font-black italic flex items-center gap-1 animate-pulse">
              <Zap size={16} className="fill-orange-400" /> {streaks}x COMBO!
            </div>
          )}
          
          <div className="flex gap-2">
            <button 
              onClick={() => {
                audioEngine.play('buttonClick')
                setIsSlowMo(true)
              }}
              disabled={isSlowMo || score < 500}
              className={`p-2 rounded-full border ${isSlowMo ? 'border-cyan-400 bg-cyan-900/50 text-cyan-400' : score >= 500 ? 'border-gray-700 hover:border-cyan-400 text-gray-400' : 'border-gray-800 text-gray-800 opacity-50'}`}
              title="Slo-Mo (Cost: 500)"
            >
              <Zap size={18} />
            </button>
            <button 
              onClick={() => {
                audioEngine.play('buttonClick')
                setShieldActive(true)
              }}
              disabled={shieldActive || score < 800}
              className={`p-2 rounded-full border ${shieldActive ? 'border-purple-400 bg-purple-900/50 text-purple-400' : score >= 800 ? 'border-gray-700 hover:border-purple-400 text-gray-400' : 'border-gray-800 text-gray-800 opacity-50'}`}
              title="Grammar Shield (Cost: 800)"
            >
              <Shield size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 relative flex flex-col justify-end pb-24 items-center">
        {/* The 'Ship' / Base */}
        <div className="absolute bottom-8 w-full max-w-2xl px-4 z-20">
          {shieldActive && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -top-16 left-1/2 -translate-x-1/2 w-full max-w-lg h-32 bg-purple-500/20 rounded-t-full border-t-2 border-purple-400 blur-sm"
            />
          )}
          
          <form onSubmit={handleSubmit} className="relative z-10 w-full flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type the corrected sentence..."
              disabled={showTip}
              className="w-full bg-gray-900/80 border-2 border-cyan-500/50 rounded-xl px-4 py-3 text-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            />
            <button 
              type="submit"
              disabled={!input.trim() || showTip}
              className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:hover:bg-cyan-600 px-6 rounded-xl flex items-center justify-center transition-colors"
            >
              <ArrowRight size={24} className="text-white" />
            </button>
          </form>
        </div>

        {/* Floating Asteroid / Sentence */}
        <AnimatePresence>
          {!showTip && currentQuestion && !isExploding && (
            <motion.div
              key={currentQuestion.id}
              initial={{ y: -100, opacity: 0, scale: 0.8 }}
              animate={{ y: window.innerHeight - 250, opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
              transition={{ 
                y: { duration: isSlowMo ? 15 : 10, ease: "linear" },
                opacity: { duration: 0.3 },
                scale: { duration: 0.5 }
              }}
              onAnimationComplete={() => {
                handleTimeout()
              }}
              className="absolute top-0 px-6 py-4 bg-gray-800/80 border border-rose-500/50 rounded-2xl shadow-[0_0_20px_rgba(244,63,94,0.3)] backdrop-blur-md max-w-md text-center"
            >
              <div className="absolute -top-3 -right-3 bg-gray-900 border border-rose-500 text-rose-500 text-xs font-black px-2 py-1 rounded-full flex items-center gap-1">
                <AlertTriangle size={12} /> ERR
              </div>
              <p className="text-xl md:text-2xl font-medium text-white">
                {currentQuestion.incorrect}
              </p>
            </motion.div>
          )}

          {/* Explosion Effect */}
          {isExploding && (
            <motion.div
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-400 rounded-full blur-xl z-0"
            />
          )}
        </AnimatePresence>

        {/* Tip Modal */}
        <AnimatePresence>
          {showTip && currentTip && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-sm"
            >
              <div className="bg-gray-900 border-2 border-rose-500/50 rounded-2xl p-6 max-w-lg w-full shadow-[0_0_30px_rgba(244,63,94,0.2)]">
                <div className="flex items-center gap-3 text-rose-500 mb-4 border-b border-gray-800 pb-4">
                  <AlertTriangle size={28} />
                  <h3 className="text-2xl font-bold">Signal Lost!</h3>
                </div>
                
                <div className="mb-6 space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm uppercase tracking-wide mb-1">Target Sentence</p>
                    <p className="text-lg text-rose-400 line-through">{currentQuestion?.incorrect}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm uppercase tracking-wide mb-1">Corrected</p>
                    <p className="text-lg text-emerald-400 font-medium">{currentQuestion?.correct}</p>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 mb-6">
                  <h4 className="text-cyan-400 font-bold mb-2 flex items-center gap-2">
                    <Zap size={16} /> {currentTip.title}
                  </h4>
                  <p className="text-gray-300 leading-relaxed">{currentTip.tip}</p>
                </div>

                <button 
                  onClick={nextQuestion}
                  className="w-full py-3 bg-white text-gray-950 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Continue Mission
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Exit Button */}
      <button 
        onClick={onExit}
        className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-50"
      >
        Abort
      </button>
    </div>
  )
}
