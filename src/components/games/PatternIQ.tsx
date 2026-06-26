import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScore } from '../../hooks/useScore'
import { sound } from '../../services/soundService'
import GameLayout from '../GameLayout'
import { PATTERN_BANK, type PatternQ } from '../../data/patternQuestions'
import { pickQuestion, getTierFromScore, TIER_COLORS, TIER_LABELS, type DifficultyTier } from '../../utils/questionEngine'

interface Props { onFinish: (score: number) => void; onExit: () => void }

const THRESHOLDS = { medium: 100, hard: 280, expert: 550 }
const TIER_TIME: Record<DifficultyTier, number> = { easy: 25, medium: 30, hard: 80, expert: 115 }

export default function PatternIQ({ onFinish, onExit }: Props) {
  const { score, add } = useScore()
  const [tier, setTier]         = useState<DifficultyTier>('easy')
  const [pattern, setPattern]   = useState<PatternQ>(() => pickQuestion('pattern', PATTERN_BANK, 'easy'))
  const [selected, setSelected] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [answered, setAnswered] = useState(false)
  const [timeLeft, setTime]     = useState(TIER_TIME.easy)
  const [maxTime, setMax]       = useState(TIER_TIME.easy)

  useEffect(() => {
    const t = setInterval(() => setTime(p => {
      if (p <= 1) { clearInterval(t); onFinish(score); return 0 }
      return p - 1
    }), 1000)
    return () => clearInterval(t)
  }, []) // eslint-disable-line

  const nextPattern = useCallback((currentScore: number) => {
    const newTier = getTierFromScore(currentScore, THRESHOLDS)
    setTier(newTier)
    setPattern(pickQuestion('pattern', PATTERN_BANK, newTier))
    setTime(TIER_TIME[newTier])
    setMax(TIER_TIME[newTier])
    setAnswered(false)
  }, [])

  const check = useCallback((val: string) => {
    if (answered) return
    setAnswered(true)
    setSelected(val)
    const correct = val === pattern.answer
    if (correct) {
      const tierMult = tier === 'expert' ? 4 : tier === 'hard' ? 2.5 : tier === 'medium' ? 1.5 : 1
      const pts = Math.round((timeLeft * 8 + 50) * tierMult)
      sound.patternSolve(); add(pts)
      setFeedback('correct')
    } else {
      setFeedback('wrong')
    }
    setTimeout(() => {
      nextPattern(score + (correct ? 1 : 0))
      setSelected(null)
      setFeedback(null)
    }, correct ? 900 : 1200)
  }, [answered, pattern.answer, timeLeft, add, tier, score, nextPattern])

  const tierColor = TIER_COLORS[tier]

  return (
    <GameLayout title="Pattern IQ 🔷" score={score} timerProgress={timeLeft / maxTime} timeLeft={timeLeft} onExit={onExit}>
      <div className="flex items-center justify-between mb-3">
        <div className="rounded-xl px-4 py-2 flex-1 mr-2" style={{ background: '#7c6cff11', color: 'var(--muted)' }}>
          <span className="text-sm"><strong style={{ color: 'white' }}>Hint:</strong> {pattern.hint}</span>
        </div>
        <span className="text-xs font-bold px-2 py-1 rounded-full shrink-0" style={{ background: tierColor + '22', color: tierColor }}>
          {TIER_LABELS[tier]}
        </span>
      </div>

      <div className="grid gap-2 mx-auto mb-6" style={{ gridTemplateColumns: 'repeat(3,1fr)', maxWidth: 300 }}>
        {pattern.grid.map((cell, i) => (
          <div key={i} className="aspect-square flex items-center justify-center rounded-xl border-2"
            style={{
              background: cell === '❓' ? '#ffffff08' : 'var(--surface)',
              borderColor: cell === '❓' ? 'var(--dim)' : 'var(--border)',
              borderStyle: cell === '❓' ? 'dashed' : 'solid',
              fontSize: cell.length > 2 ? 14 : 'clamp(18px,3.5vw,26px)',
            }}>
            {cell}
          </div>
        ))}
      </div>

      <div className="text-center text-sm mb-3" style={{ color: 'var(--muted)' }}>Choose the missing piece:</div>

      <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
        {pattern.options.map((opt) => (
          <motion.button key={opt} whileHover={!answered ? { scale: 1.06 } : {}} whileTap={!answered ? { scale: 0.95 } : {}}
            disabled={answered} onClick={() => check(opt)}
            className="aspect-square flex items-center justify-center rounded-xl border-2"
            style={{
              fontSize: opt.length > 2 ? 12 : 'clamp(14px,2.5vw,20px)',
              background: selected === opt && feedback === 'correct' ? '#00d4aa22'
                : opt === pattern.answer && feedback === 'wrong' ? '#00d4aa22' : 'var(--surface)',
              borderColor: selected === opt && feedback === 'correct' ? '#00d4aa'
                : opt === pattern.answer && feedback === 'wrong' ? '#00d4aa'
                : selected === opt && feedback === 'wrong' ? '#ff6b6b' : 'var(--border)',
            }}>
            {opt}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div key={feedback} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-center mt-4 text-lg font-bold" style={{ color: feedback === 'correct' ? '#00d4aa' : '#ff6b6b' }}>
            {feedback === 'correct' ? '✅ Brilliant!' : `❌ Not quite! Answer: ${pattern.answer}`}
          </motion.div>
        )}
      </AnimatePresence>
    </GameLayout>
  )
}
