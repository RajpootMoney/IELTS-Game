import { useState, useCallback } from 'react'
import StartScreen from './components/Screens/StartScreenEnhanced'
import GameScreen from './components/Game/GameScreen'
import GameOverScreen from './components/Screens/GameOverScreen'
import { WordData } from './types/game.types'

export type GameStatus = 'start' | 'playing' | 'gameOver'

interface GameStats {
  score: number
  wordsCorrect: number
  accuracy: number
  highestCombo: number
  wrongWords: WordData[]
}

function App() {
  const [gameStatus, setGameStatus] = useState<GameStatus>('start')
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    wordsCorrect: 0,
    accuracy: 0,
    highestCombo: 0,
    wrongWords: []
  })

  const handleStartGame = useCallback(() => {
    setGameStatus('playing')
  }, [])

  const handleGameOver = useCallback((stats: GameStats) => {
    setGameStats(stats)
    setGameStatus('gameOver')
  }, [])

  const handlePlayAgain = useCallback(() => {
    setGameStatus('playing')
  }, [])

  const handleMainMenu = useCallback(() => {
    setGameStatus('start')
  }, [])

  return (
    <div className="min-h-screen bg-game-bg text-white overflow-hidden">
      {gameStatus === 'start' && <StartScreen onStartGame={handleStartGame} />}
      {gameStatus === 'playing' && <GameScreen onGameOver={handleGameOver} />}
      {gameStatus === 'gameOver' && (
        <GameOverScreen
          stats={gameStats}
          onPlayAgain={handlePlayAgain}
          onMainMenu={handleMainMenu}
        />
      )}
    </div>
  )
}

export default App
