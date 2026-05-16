import { useState, useCallback } from 'react'
import BandOnboarding from './components/Hub/BandOnboarding'
import MissionMap from './components/Hub/MissionMap'
import VocabSector from './components/Hub/VocabSector'
import DailyMixFlow from './components/Missions/DailyMixFlow'
import ListeningMission from './components/Missions/ListeningMission'
import ReadingMission from './components/Missions/ReadingMission'
import WritingForge from './components/Missions/WritingForge'
import SpeakingMission from './components/Missions/SpeakingMission'
import GameScreen from './components/Game/GameScreen'
import GameOverScreen from './components/Screens/GameOverScreen'
import { WordData } from './types/game.types'
import { GameMode } from './types/mode.types'
import { SkillZone } from './types/hub.types'
import { TargetBand, WeakTag } from './types/progress.types'
import { useProgress } from './hooks/useProgress'
import { MISSIONS } from './data/zones'

type Screen =
  | 'onboarding'
  | 'hub'
  | 'vocab'
  | 'listening'
  | 'reading'
  | 'writing'
  | 'speaking'
  | 'dailyMix'
  | 'arcade'
  | 'gameOver'

interface GameStats {
  score: number
  wordsCorrect: number
  accuracy: number
  highestCombo: number
  wrongWords: WordData[]
}

function App() {
  const { progress, chooseBand, recordMission, finishDailyMix, refresh } = useProgress()
  const [screen, setScreen] = useState<Screen>(() =>
    progress.onboardingComplete ? 'hub' : 'onboarding'
  )
  const [gameMode, setGameMode] = useState<GameMode>('classic')
  const [playSession, setPlaySession] = useState(0)
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    wordsCorrect: 0,
    accuracy: 0,
    highestCombo: 0,
    wrongWords: [],
  })

  const goHub = useCallback(() => {
    refresh()
    setScreen('hub')
  }, [refresh])

  const handleOnboarding = useCallback(
    (band: TargetBand) => {
      chooseBand(band)
      setScreen('hub')
    },
    [chooseBand]
  )

  const handleZone = useCallback((zone: SkillZone) => {
    if (zone === 'vocab') setScreen('vocab')
    else if (zone === 'listening') setScreen('listening')
    else if (zone === 'reading') setScreen('reading')
    else if (zone === 'writing') setScreen('writing')
    else if (zone === 'speaking') setScreen('speaking')
  }, [])

  const handleMissionComplete = useCallback(
    (missionId: string, correct: boolean, weakTags: WeakTag[], xp: number) => {
      recordMission({
        missionId,
        correct,
        weakTags,
        xpEarned: xp,
      })
      goHub()
    },
    [recordMission, goHub]
  )

  const handleStartArcade = useCallback((mode: GameMode) => {
    setGameMode(mode)
    setPlaySession((s) => s + 1)
    setScreen('arcade')
  }, [])

  const handleGameOver = useCallback((stats: GameStats) => {
    setGameStats(stats)
    setScreen('gameOver')
  }, [])

  const handlePlayAgain = useCallback(() => {
    setPlaySession((s) => s + 1)
    setScreen('arcade')
  }, [])

  const listeningMission = MISSIONS.find((m) => m.id === 'listening-signal-hunt')!
  const readingMission = MISSIONS.find((m) => m.id === 'reading-scanline')!
  const writingMission = MISSIONS.find((m) => m.id === 'writing-forge')!
  const speakingMission = MISSIONS.find((m) => m.id === 'speaking-booth')!

  return (
    <div className="min-h-screen bg-game-bg text-white overflow-hidden">
      {screen === 'onboarding' && <BandOnboarding onComplete={handleOnboarding} />}

      {screen === 'hub' && (
        <MissionMap
          progress={progress}
          onSelectZone={handleZone}
          onDailyMix={() => setScreen('dailyMix')}
          onChangeBand={() => setScreen('onboarding')}
        />
      )}

      {screen === 'vocab' && (
        <VocabSector onStartArcade={handleStartArcade} onBack={goHub} />
      )}

      {screen === 'dailyMix' && (
        <DailyMixFlow
          progress={progress}
          onFinish={(results, xp) => {
            finishDailyMix(results, xp)
            goHub()
          }}
          onExit={goHub}
        />
      )}

      {screen === 'listening' && (
        <ListeningMission
          targetBand={progress.targetBand}
          onExit={goHub}
          onComplete={(correct, weakTags) =>
            handleMissionComplete(
              listeningMission.id,
              correct,
              weakTags,
              listeningMission.xpReward
            )
          }
        />
      )}

      {screen === 'reading' && (
        <ReadingMission
          targetBand={progress.targetBand}
          onExit={goHub}
          onComplete={(correct, weakTags) =>
            handleMissionComplete(
              readingMission.id,
              correct,
              weakTags,
              readingMission.xpReward
            )
          }
        />
      )}

      {screen === 'writing' && (
        <WritingForge
          targetBand={progress.targetBand}
          onExit={goHub}
          onComplete={(correct, total, weakTags) =>
            handleMissionComplete(
              writingMission.id,
              correct >= Math.ceil(total / 2),
              weakTags,
              writingMission.xpReward
            )
          }
        />
      )}

      {screen === 'speaking' && (
        <SpeakingMission
          targetBand={progress.targetBand}
          onExit={goHub}
          onComplete={(rating, weakTags) =>
            handleMissionComplete(
              speakingMission.id,
              rating !== 'weak',
              weakTags,
              speakingMission.xpReward
            )
          }
        />
      )}

      {screen === 'arcade' && (
        <GameScreen key={playSession} gameMode={gameMode} onGameOver={handleGameOver} />
      )}

      {screen === 'gameOver' && (
        <GameOverScreen
          stats={gameStats}
          onPlayAgain={handlePlayAgain}
          onMainMenu={goHub}
        />
      )}
    </div>
  )
}

export default App
