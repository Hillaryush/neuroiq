import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { GameId } from '../types'

interface GameContextValue {
  activeGame: GameId | null
  startGame: (id: GameId) => void
  exitGame: () => void
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [activeGame, setActiveGame] = useState<GameId | null>(null)

  const startGame = useCallback((id: GameId) => setActiveGame(id), [])
  const exitGame  = useCallback(() => setActiveGame(null), [])

  return (
    <GameContext.Provider value={{ activeGame, startGame, exitGame }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside GameProvider')
  return ctx
}
