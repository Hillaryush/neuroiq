import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScore } from '../../hooks/useScore'
import { sound } from '../../services/soundService'
import GameLayout from '../GameLayout'
import { LOGIC_SERIES_BANK, type LogicSeriesQ } from '../../data/logicSeriesQuestions'
import { pickQuestion, getTierFromScore, TIER_COLORS, TIER_LABELS, type DifficultyTier } from '../../utils/questionEngine'

interface Props { onFinish: (s: number) => void; onExit: () => void }

const THRESHOLDS = { medium: 80, hard: 250, expert: 500 }
const TIER_TIME: Record<DifficultyTier, number> = { easy: 25, medium: 30, hard: 80, expert: 115 }

export default function LogicSeries({ onFinish, onExit }: Props) {
  const { score, add } = useScore()
  const [tier, setTier]     = useState<DifficultyTier>('easy')
  const [puzzle, setPuzzle] = useState<LogicSeriesQ>(() => pickQuestion('logicseries', LOGIC_SERIES_BANK, 'easy'))
  const [selected, setSel]  = useState<string | null>(null)
  const [feedback, setFB]   = useState<'correct' | 'wrong' | null>(null)
  const [timeLeft, setTime] = useState(TIER_TIME.easy)
  const [maxTime, setMax]   = useState(TIER_TIME.easy)

  useEffect(() => {
    const t = setInterval(() => setTime(p => {
      if (p <= 1) { clearInterval(t); onFinish(score); return 0 }
      return p - 1
    }), 1000)
    return () => clearInterval(t)
  }, []) // eslint-disable-line

  const nextPuzzle = useCallback((currentScore: number) => {
    const newTier = getTierFromScore(currentScore, THRESHOLDS)
    setTier(newTier)
    setPuzzle(pickQuestion('logicseries', LOGIC_SERIES_BANK, newTier))
    setTime(TIER_TIME[newTier])
    setMax(TIER_TIME[newTier])
  }, [])

  const choose = useCallback((opt: string) => {
    if (selected) return
    setSel(opt)
    if (opt === puzzle.answer) {
      const tierMult = tier === 'expert' ? 4 : tier === 'hard' ? 2.5 : tier === 'medium' ? 1.5 : 1
      sound.logicSolve(); add(Math.round((timeLeft * 7 + 40) * tierMult)); setFB('correct')
    } else { sound.wrong(); setFB('wrong') }
    setTimeout(() => {
      nextPuzzle(score + (opt === puzzle.answer ? 1 : 0))
      setSel(null); setFB(null)
    }, 1000)
  }, [selected, puzzle.answer, timeLeft, add, tier, score, nextPuzzle])

  const tierColor = TIER_COLORS[tier]

  return (
    <GameLayout title="Logic Series 📐" score={score} timerProgress={timeLeft / maxTime} timeLeft={timeLeft} onExit={onExit}>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm" style={{ color: 'var(--muted)' }}>Find the <strong style={{ color: 'white' }}>next value</strong></div>
        <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: tierColor + '22', color: tierColor }}>
          {TIER_LABELS[tier]}
        </span>
      </div>
      <motion.div key={puzzle.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <div className="font-display font-extrabold px-6 py-5 rounded-2xl inline-block"
          style={{ fontSize: 'clamp(20px,4vw,32px)', background: '#7c6cff11', border: '2px solid #7c6cff33', color: 'white', letterSpacing: 2 }}>
          {puzzle.sequence}
        </div>
      </motion.div>
      <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
        {puzzle.options.map(opt => (
          <motion.button key={opt} whileHover={!selected ? { scale: 1.04 } : {}} whileTap={!selected ? { scale: 0.96 } : {}}
            disabled={!!selected} onClick={() => choose(opt)}
            className="py-5 rounded-2xl font-display font-bold text-2xl border-2"
            style={{
              background: opt === puzzle.answer && feedback ? '#00d4aa22' : selected === opt && feedback === 'wrong' ? '#ff6b6b22' : 'var(--surface)',
              borderColor: opt === puzzle.answer && feedback ? '#00d4aa' : selected === opt && feedback === 'wrong' ? '#ff6b6b' : 'var(--border)',
              color: 'white', cursor: selected ? 'default' : 'pointer',
            }}>
            {opt}
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {feedback && (
          <motion.div key={feedback} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-center mt-4 font-bold text-sm" style={{ color: feedback === 'correct' ? '#00d4aa' : '#ff6b6b' }}>
            {feedback === 'correct' ? `✅ ${puzzle.explanation}` : `❌ Answer: ${puzzle.answer} — ${puzzle.explanation}`}
          </motion.div>
        )}
      </AnimatePresence>
    </GameLayout>
  )
}
