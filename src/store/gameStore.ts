import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GameState {
  score: number
  lives: number
  streaks: number
  highestStreak: number
  grammarQuestionsCompleted: string[]
  quickFireQuestionsCompleted: string[]
  unlockedLevels: number
  soundEnabled: boolean
  parallaxEnabled: boolean
  incrementScore: (points: number) => void
  decrementLife: () => void
  resetLives: () => void
  resetGame: () => void
  incrementStreak: () => void
  resetStreak: () => void
  markGrammarCompleted: (id: string) => void
  markQuickFireCompleted: (id: string) => void
  unlockNextLevel: () => void
  toggleSound: () => void
  toggleParallax: () => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      score: 0,
      lives: 3,
      streaks: 0,
      highestStreak: 0,
      grammarQuestionsCompleted: [],
      quickFireQuestionsCompleted: [],
      unlockedLevels: 1,
      soundEnabled: true,
      parallaxEnabled: true,

      incrementScore: (points) => set((state) => ({ score: state.score + points })),
      
      decrementLife: () => set((state) => ({ 
        lives: Math.max(0, state.lives - 1),
        streaks: 0 // Reset streak on mistake
      })),
      
      resetLives: () => set({ lives: 3 }),
      
      resetGame: () => set({ lives: 3, score: 0, streaks: 0 }),
      
      incrementStreak: () => set((state) => {
        const newStreak = state.streaks + 1
        return {
          streaks: newStreak,
          highestStreak: Math.max(state.highestStreak, newStreak)
        }
      }),
      
      resetStreak: () => set({ streaks: 0 }),
      
      markGrammarCompleted: (id) => set((state) => ({
        grammarQuestionsCompleted: [...new Set([...state.grammarQuestionsCompleted, id])]
      })),
      
      markQuickFireCompleted: (id) => set((state) => ({
        quickFireQuestionsCompleted: [...new Set([...state.quickFireQuestionsCompleted, id])]
      })),
      
      unlockNextLevel: () => set((state) => ({
        unlockedLevels: state.unlockedLevels + 1
      })),
      
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      
      toggleParallax: () => set((state) => ({ parallaxEnabled: !state.parallaxEnabled }))
    }),
    {
      name: 'antigravity-ielts-storage',
      // only persist specific fields if needed, but persisting all is fine for now
    }
  )
)
