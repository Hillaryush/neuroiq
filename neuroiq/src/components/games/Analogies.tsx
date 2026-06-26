import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScore } from '../../hooks/useScore'
import { sound } from '../../services/soundService'
import GameLayout from '../GameLayout'
import { ANALOGIES_BANK, type AnalogyQ } from '../../data/analogiesQuestions'
import { pickQuestion, getTierFromScore, TIER_COLORS, TIER_LABELS, type DifficultyTier } from '../../utils/questionEngine'

interface Props { onFinish: (s: number) => void; onExit: () => void }

const THRESHOLDS = { medium: 80, hard: 220, expert: 450 }
const TIER_TIME: Record<DifficultyTier, number> = { easy: 20, medium: 25, hard: 70, expert: 105 }

export default function Analogies({ onFinish, onExit }: Props) {
  const { score, add } = useScore()
  const [tier, setTier]     = useState<DifficultyTier>('easy')
  const [analogy, setAnal]  = useState<AnalogyQ>(() => pickQuestion('analogies', ANALOGIES_BANK, 'easy'))
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

  const nextAnalogy = useCallback((currentScore: number) => {
    const newTier = getTierFromScore(currentScore, THRESHOLDS)
    setTier(newTier)
    setAnal(pickQuestion('analogies', ANALOGIES_BANK, newTier))
    setTime(TIER_TIME[newTier])
    setMax(TIER_TIME[newTier])
  }, [])

  const choose = useCallback((opt: string) => {
    if (selected) return
    setSel(opt)
    if (opt === analogy.answer) {
      const tierMult = tier === 'expert' ? 4 : tier === 'hard' ? 2.5 : tier === 'medium' ? 1.5 : 1
      sound.correct(); add(Math.round((timeLeft * 6 + 35) * tierMult)); setFB('correct')
    } else { sound.wrong(); setFB('wrong') }
    setTimeout(() => {
      nextAnalogy(score + (opt === analogy.answer ? 1 : 0))
      setSel(null); setFB(null)
    }, 1000)
  }, [selected, analogy.answer, timeLeft, add, tier, score, nextAnalogy])

  const tierColor = TIER_COLORS[tier]

  return (
    <GameLayout title="Analogies 🧠" score={score} timerProgress={timeLeft / maxTime} timeLeft={timeLeft} onExit={onExit}>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm" style={{ color: 'var(--muted)' }}>Complete the <strong style={{ color: 'white' }}>analogy</strong></div>
        <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: tierColor + '22', color: tierColor }}>
          {TIER_LABELS[tier]}
        </span>
      </div>
      <motion.div key={analogy.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center mb-8">
        <div className="font-display font-bold px-6 py-5 rounded-2xl"
          style={{ fontSize: 'clamp(16px,3vw,24px)', background: 'var(--surface)', border: '2px solid var(--border)', color: 'white' }}>
          {analogy.q}
        </div>
      </motion.div>
      <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
        {analogy.options.map(opt => (
          <motion.button key={opt} whileHover={!selected ? { scale: 1.04 } : {}} whileTap={!selected ? { scale: 0.96 } : {}}
            disabled={!!selected} onClick={() => choose(opt)}
            className="py-5 rounded-2xl font-bold text-lg border-2"
            style={{
              background: opt === analogy.answer && feedback ? '#00d4aa22' : selected === opt && feedback === 'wrong' ? '#ff6b6b22' : 'var(--surface)',
              borderColor: opt === analogy.answer && feedback ? '#00d4aa' : selected === opt && feedback === 'wrong' ? '#ff6b6b' : 'var(--border)',
              color: 'white', cursor: selected ? 'default' : 'pointer',
            }}>
            {opt}
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {feedback && (
          <motion.div key={feedback} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center mt-4 font-bold text-sm" style={{ color: feedback === 'correct' ? '#00d4aa' : '#ff6b6b' }}>
            {feedback === 'correct' ? `✅ Correct! ${analogy.explanation}` : `❌ Answer: ${analogy.answer} — ${analogy.explanation}`}
          </motion.div>
        )}
      </AnimatePresence>
    </GameLayout>
  )
}
