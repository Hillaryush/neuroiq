import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { GAMES, GAME_CATEGORIES } from '../utils/constants'
import { useAppStore } from '../store/useAppStore'
import { buildResult } from '../services/scoreService'
import { sound } from '../services/soundService'
import HeroSection      from '../components/HeroSection'
import DailyChallenge   from '../components/DailyChallenge'
import AICoachPanel     from '../components/AICoachPanel'
import BrainReport      from '../components/BrainReport'
import GameCard         from '../components/GameCard'
import GameStartScreen  from '../components/GameStartScreen'
import GameResultScreen from '../components/GameResultScreen'
import MemoryGame       from '../components/games/MemoryGame'
import MathBlitz        from '../components/games/MathBlitz'
import SequenceGame     from '../components/games/SequenceGame'
import PatternIQ        from '../components/games/PatternIQ'
import WordChain        from '../components/games/WordChain'
import ColorMemory      from '../components/games/ColorMemory'
import NumberRecall     from '../components/games/NumberRecall'
import StroopTest       from '../components/games/StroopTest'
import OddOneOut        from '../components/games/OddOneOut'
import LogicSeries      from '../components/games/LogicSeries'
import Analogies        from '../components/games/Analogies'
import FocusChallenge   from '../components/games/FocusChallenge'
import DebugChallenge   from '../components/games/DebugChallenge'
import AlgorithmPuzzle  from '../components/games/AlgorithmPuzzle'
import type { GameId } from '../types'

type Screen = 'grid' | 'start' | 'playing' | 'result'

export default function GamesPage() {
  const { stats, user, recordResult } = useAppStore()
  const [screen, setScreen]  = useState<Screen>('grid')
  const [activeGame, setAct] = useState<GameId | null>(null)
  const [finalScore, setFin] = useState(0)
  const [activeCat, setCat]  = useState('All')

  function selectGame(id: GameId) { setAct(id); setScreen('start'); sound.click() }
  function startPlaying()         { setScreen('playing') }
  function handleFinish(s: number) {
    if (!activeGame) return
    setFin(s); recordResult(buildResult(activeGame, s)); setScreen('result')
  }
  function handleExit() { setAct(null); setScreen('grid') }
  const gp = { onFinish: handleFinish, onExit: handleExit }

  const categories   = ['All', ...GAME_CATEGORIES, '⭐ Favorites']
  const filtered     = activeCat === '⭐ Favorites'
    ? GAMES.filter(g => (stats.favorites || []).includes(g.id))
    : activeCat === 'All' ? GAMES : GAMES.filter(g => g.category === activeCat)
  const selectedMeta = activeGame ? GAMES.find(g => g.id === activeGame)! : null

  return (
    <AnimatePresence mode="wait">
      {screen === 'grid' && (
        <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <HeroSection stats={stats} user={user} onStart={() => selectGame('memory')} />
          <DailyChallenge />
          <AICoachPanel stats={stats} />
          <BrainReport />

          {/* Category filter — scrollable on mobile */}
          <div className="flex gap-1.5 mb-3 pb-1" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => { sound.click(); setCat(cat) }}
                className="rounded-full font-semibold whitespace-nowrap shrink-0"
                style={{ background: activeCat === cat ? '#7c6cff' : 'var(--surface)',
                  color: activeCat === cat ? 'white' : 'var(--muted)',
                  border: `1px solid ${activeCat === cat ? '#7c6cff' : 'var(--border)'}`,
                  padding: 'clamp(5px,1vw,8px) clamp(10px,2vw,14px)',
                  fontSize: 'clamp(10px,1.5vw,12px)', cursor: 'pointer' }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Games grid — responsive */}
          {filtered.length === 0
            ? (
              <div className="text-center py-12" style={{ color: 'var(--muted)' }}>
                <div className="text-4xl mb-3">⭐</div>
                <p>No favorites yet — star a game to pin it here!</p>
              </div>
            ) : (
              <div className="game-grid grid gap-3"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(160px, 100%), 1fr))' }}>
                {filtered.map(game => (
                  <GameCard key={game.id} game={game}
                    highScore={stats.highScores[game.id] || 0}
                    onClick={() => selectGame(game.id)} />
                ))}
              </div>
            )}
        </motion.div>
      )}

      {screen === 'start' && selectedMeta && (
        <motion.div key="start" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <GameStartScreen game={selectedMeta}
            highScore={stats.highScores[selectedMeta.id] || 0}
            playCount={stats.gamePlayCount?.[selectedMeta.id] || 0}
            onStart={startPlaying} onBack={handleExit} />
        </motion.div>
      )}

      {screen === 'playing' && activeGame && (
        <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {activeGame === 'memory'          && <MemoryGame      {...gp} />}
          {activeGame === 'math'            && <MathBlitz       {...gp} />}
          {activeGame === 'sequence'        && <SequenceGame    {...gp} />}
          {activeGame === 'pattern'         && <PatternIQ       {...gp} />}
          {activeGame === 'wordchain'       && <WordChain       {...gp} />}
          {activeGame === 'color'           && <ColorMemory     {...gp} />}
          {activeGame === 'numberrecall'    && <NumberRecall    {...gp} />}
          {activeGame === 'strooptest'      && <StroopTest      {...gp} />}
          {activeGame === 'oddoneout'       && <OddOneOut       {...gp} />}
          {activeGame === 'logicseries'     && <LogicSeries     {...gp} />}
          {activeGame === 'analogies'       && <Analogies       {...gp} />}
          {activeGame === 'focuschallenge'  && <FocusChallenge  {...gp} />}
          {activeGame === 'debugchallenge'  && <DebugChallenge  {...gp} />}
          {activeGame === 'algorithmpuzzle' && <AlgorithmPuzzle {...gp} />}
        </motion.div>
      )}

      {screen === 'result' && activeGame && (
        <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <GameResultScreen score={finalScore} gameId={activeGame}
            onPlayAgain={() => setScreen('playing')} onExit={handleExit} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
