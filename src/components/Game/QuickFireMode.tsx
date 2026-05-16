import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Zap, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import { audioEngine } from '../../utils/audioUtils'
import quickFireQuestions from '../../data/quickFireQuestions.json'

interface QuickFireModeProps {
  onExit: () => void
}

const TIME_LIMIT = 10000 // 10 seconds per question

export default function QuickFireMode({ onExit }: QuickFireModeProps) {
  const { score, lives, streaks, incrementScore, decrementLife, incrementStreak, resetStreak, resetGame } = useGameStore()
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  
  const currentQuestion = quickFireQuestions[currentIndex]

  useEffect(() => {
    resetGame()
  }, [resetGame])

  // Timer logic
  useEffect(() => {
    if (selectedAnswer !== null || lives <= 0 || !currentQuestion) return

    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 100) {
          clearInterval(interval)
          handleTimeOut()
          return 0
        }
        return t - 100
      })
    }, 100)

    return () => clearInterval(interval)
  }, [currentIndex, selectedAnswer, lives, currentQuestion])

  const handleTimeOut = () => {
    audioEngine.play('wrong')
    audioEngine.play('lifeLost')
    setSelectedAnswer('timeout')
    decrementLife()
    resetStreak()
    
    setTimeout(() => {
      nextQuestion()
    }, 1500)
  }

  const handleSelect = (answer: string) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(answer)
    const correct = answer === currentQuestion.correctAnswer

    if (correct) {
      audioEngine.play('correctHigh')
      const timeBonus = Math.floor(timeLeft / 100)
      incrementScore(50 + timeBonus + streaks * 5)
      incrementStreak()
    } else {
      audioEngine.play('wrong')
      decrementLife()
      resetStreak()
    }

    setTimeout(() => {
      nextQuestion()
    }, 1500)
  }

  const nextQuestion = () => {
    setSelectedAnswer(null)
    setTimeLeft(TIME_LIMIT)
    
    if (currentIndex < quickFireQuestions.length - 1) {
      setCurrentIndex(c => c + 1)
    } else {
      setCurrentIndex(0) // Loop for now
    }
  }

  if (lives <= 0) {
    return (
      <div className="min-h-[100dvh] bg-gray-950 flex flex-col items-center justify-center text-white p-4">
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
    <div className="relative min-h-[100dvh] bg-gray-950 overflow-y-auto overflow-x-hidden flex flex-col">
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
          <button 
            onClick={onExit}
            className="bg-gray-900/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-gray-800 font-bold text-gray-500 hover:text-white transition-colors"
          >
            Abort
          </button>
        </div>
        
        {streaks > 2 && (
          <div className="text-orange-400 font-black italic flex items-center gap-1 animate-pulse bg-gray-900/50 px-3 py-1.5 rounded-full">
            <Zap size={16} className="fill-orange-400" /> {streaks}x
          </div>
        )}
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 z-10 mt-16">
        
        {/* Timer Bar */}
        <div className="w-full max-w-md mb-8">
          <div className="flex justify-between text-gray-400 mb-2 text-sm font-bold">
            <span className="flex items-center gap-1"><Clock size={16} /> Time</span>
            <span>{(timeLeft / 1000).toFixed(1)}s</span>
          </div>
          <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full ${timeLeft > 3000 ? 'bg-cyan-400' : 'bg-rose-500 animate-pulse'}`}
              initial={{ width: "100%" }}
              animate={{ width: `${(timeLeft / TIME_LIMIT) * 100}%` }}
              transition={{ ease: "linear", duration: 0.1 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion?.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            className="w-full max-w-md"
          >
            <div className="bg-gray-800/80 border border-gray-700 backdrop-blur-md p-6 rounded-3xl shadow-xl mb-6 text-center">
              <span className="text-xs font-black uppercase text-cyan-500 tracking-wider mb-2 block">
                {currentQuestion?.type}
              </span>
              <h2 className="text-2xl text-white font-medium leading-snug">
                {currentQuestion?.question}
              </h2>
            </div>

            {/* Floating Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
              {currentQuestion?.options.map((option, index) => {
                const isSelected = selectedAnswer === option
                const isActuallyCorrect = option === currentQuestion.correctAnswer
                
                let btnStyle = "bg-gray-800/80 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-cyan-500/50"
                if (selectedAnswer !== null) {
                  if (isActuallyCorrect) {
                    btnStyle = "bg-emerald-900/50 border-emerald-500 text-emerald-400"
                  } else if (isSelected) {
                    btnStyle = "bg-rose-900/50 border-rose-500 text-rose-400"
                  } else {
                    btnStyle = "bg-gray-900/50 border-gray-800 text-gray-600 opacity-50"
                  }
                }

                return (
                  <motion.button
                    key={option}
                    disabled={selectedAnswer !== null}
                    onClick={() => handleSelect(option)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      // Floating effect when not selected
                      y: selectedAnswer === null ? [0, Math.random() * -10, 0] : 0,
                    }}
                    transition={{ 
                      delay: index * 0.1,
                      y: {
                        duration: 3 + Math.random() * 2,
                        repeat: selectedAnswer === null ? Infinity : 0,
                        ease: "easeInOut"
                      }
                    }}
                    className={`relative p-4 rounded-2xl border-2 text-lg font-medium transition-all duration-300 ${btnStyle} shadow-lg flex items-center justify-center min-h-[80px]`}
                  >
                    {option}
                    
                    {selectedAnswer !== null && isActuallyCorrect && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 bg-gray-900 rounded-full"
                      >
                        <CheckCircle2 size={24} className="text-emerald-500 fill-emerald-500/20" />
                      </motion.div>
                    )}
                    
                    {selectedAnswer !== null && isSelected && !isActuallyCorrect && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 bg-gray-900 rounded-full"
                      >
                        <XCircle size={24} className="text-rose-500 fill-rose-500/20" />
                      </motion.div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
