import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScore } from '../../hooks/useScore'
import { sound } from '../../services/soundService'
import GameLayout from '../GameLayout'
import { ODD_ONE_OUT_BANK, type OddOneOutQ } from '../../data/oddOneOutQuestions'
import { pickQuestion, getTierFromScore, TIER_COLORS, TIER_LABELS, type DifficultyTier } from '../../utils/questionEngine'

interface Props { onFinish: (s: number) => void; onExit: () => void }

const THRESHOLDS = { medium: 80, hard: 250, expert: 500 }
const TIER_TIME: Record<DifficultyTier, number> = { easy: 25, medium: 30, hard: 75, expert: 110 }

export default function OddOneOut({ onFinish, onExit }: Props) {
  const { score, add } = useScore()
  const [tier, setTier]     = useState<DifficultyTier>('easy')
  const [round, setRound]   = useState<OddOneOutQ>(() => pickQuestion('oddoneout', ODD_ONE_OUT_BANK, 'easy'))
  const [selected, setSel]  = useState<string | null>(null)
  const [feedback, setFB]   = useState<'correct' | 'wrong' | null>(null)
  const [showHint, setHint] = useState(false)
  const [timeLeft, setTime] = useState(TIER_TIME.easy)
  const [maxTime, setMax]   = useState(TIER_TIME.easy)

  useEffect(() => {
    const t = setInterval(() => setTime(p => {
      if (p <= 1) { clearInterval(t); onFinish(score); return 0 }
      return p - 1
    }), 1000)
    return () => clearInterval(t)
  }, []) // eslint-disable-line

  const nextRound = useCallback((currentScore: number) => {
    const newTier = getTierFromScore(currentScore, THRESHOLDS)
    setTier(newTier)
    setRound(pickQuestion('oddoneout', ODD_ONE_OUT_BANK, newTier))
    setTime(TIER_TIME[newTier])
    setMax(TIER_TIME[newTier])
    setHint(false)
  }, [])

  const choose = useCallback((item: string) => {
    if (selected) return
    setSel(item)
    if (item === round.odd) {
      const tierMult = tier === 'expert' ? 4 : tier === 'hard' ? 2.5 : tier === 'medium' ? 1.5 : 1
      const pts = Math.round((timeLeft * 6 + 40 - (showHint ? 10 : 0)) * tierMult)
      sound.correct(); add(pts); setFB('correct')
    } else { sound.wrong(); setFB('wrong') }
    setTimeout(() => {
      nextRound(score + (item === round.odd ? 1 : 0))
      setSel(null); setFB(null)
    }, 900)
  }, [selected, round.odd, timeLeft, add, showHint, score, tier, nextRound])

  const tierColor = TIER_COLORS[tier]

  return (
    <GameLayout title="Odd One Out 🔍" score={score} timerProgress={timeLeft / maxTime} timeLeft={timeLeft} onExit={onExit}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm" style={{ color: 'var(--muted)' }}>
          Which one <strong style={{ color: 'white' }}>doesn&apos;t belong</strong>?
        </div>
        <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: tierColor + '22', color: tierColor }}>
          {TIER_LABELS[tier]}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-4">
        {round.items.map(item => (
          <motion.button key={item} whileHover={!selected ? { scale: 1.04 } : {}} whileTap={!selected ? { scale: 0.96 } : {}}
            disabled={!!selected} onClick={() => choose(item)}
            className="py-5 rounded-2xl font-bold text-base border-2 transition-all"
            style={{
              background: selected === item && feedback === 'correct' ? '#00d4aa22'
                : item === round.odd && feedback === 'wrong' ? '#00d4aa22'
                : selected === item && feedback === 'wrong' ? '#ff6b6b22' : 'var(--surface)',
              borderColor: selected === item && feedback === 'correct' ? '#00d4aa'
                : item === round.odd && feedback === 'wrong' ? '#00d4aa'
                : selected === item && feedback === 'wrong' ? '#ff6b6b' : 'var(--border)',
              color: 'white', cursor: selected ? 'default' : 'pointer',
            }}>
            {item}
          </motion.button>
        ))}
      </div>

      <div className="flex justify-center mb-3">
        <button onClick={() => { if (!showHint) { setHint(true); add(-10) } }}
          disabled={showHint}
          className="text-xs px-3 py-1.5 rounded-full"
          style={{ background: '#ffffff0a', border: '1px solid var(--border)', color: showHint ? 'var(--dim)' : 'var(--muted)', cursor: showHint ? 'default' : 'pointer' }}>
          {showHint ? `💡 ${round.hint}` : '💡 Hint (-10 pts)'}
        </button>
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div key={feedback} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center font-bold" style={{ color: feedback === 'correct' ? '#00d4aa' : '#ff6b6b' }}>
            {feedback === 'correct' ? `✅ Correct! The odd one: ${round.odd}` : `❌ Answer: ${round.odd} — ${round.hint}`}
          </motion.div>
        )}
      </AnimatePresence>
    </GameLayout>
  )
}
