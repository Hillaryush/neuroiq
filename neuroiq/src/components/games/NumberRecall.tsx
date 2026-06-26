import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sound } from '../../services/soundService'
import GameLayout from '../GameLayout'
import { TIER_COLORS, TIER_LABELS, getTierFromScore, type DifficultyTier } from '../../utils/questionEngine'

type Phase = 'show' | 'hide' | 'input'
interface Props { onFinish: (s: number) => void; onExit: () => void }

// Digit counts scale aggressively: Easy=4-5, Expert=10-12 digits (true memory champion territory)
const DIGITS_BY_TIER: Record<DifficultyTier, number> = { easy: 4, medium: 6, hard: 9, expert: 12 }
const TIME_BY_TIER: Record<DifficultyTier, number>   = { easy: 45, medium: 55, hard: 95, expert: 120 }
const THRESHOLDS = { medium: 100, hard: 320, expert: 650 }

function genNumber(d: number) {
  return Array.from({ length: d }, () => Math.floor(Math.random() * 10)).join('')
}

export default function NumberRecall({ onFinish, onExit }: Props) {
  const [tier, setTier]     = useState<DifficultyTier>('easy')
  const [level, setLevel]   = useState(1)
  const [number, setNumber] = useState('')
  const [phase, setPhase]   = useState<Phase>('show')
  const [input, setInput]   = useState('')
  const [feedback, setFB]   = useState<'correct' | 'wrong' | null>(null)
  const [score, setScore]   = useState(0)
  const [timeLeft, setTime] = useState(TIME_BY_TIER.easy)
  const [maxTime, setMax]   = useState(TIME_BY_TIER.easy)

  const digits = DIGITS_BY_TIER[tier] + Math.min(level - 1, 3) // small extra growth within a tier

  const nextRound = useCallback(() => {
    const n = genNumber(digits)
    setNumber(n); setInput(''); setFB(null); setPhase('show')
    sound.numberShow()
    const showDuration = 1200 + digits * 220
    setTimeout(() => { sound.numberHide(); setPhase('hide') }, showDuration)
    setTimeout(() => setPhase('input'), showDuration + 250)
  }, [digits])

  useEffect(() => { nextRound() }, []) // eslint-disable-line

  useEffect(() => {
    const t = setInterval(() => setTime(p => {
      if (p <= 1) { clearInterval(t); onFinish(score); return 0 }
      return p - 1
    }), 1000)
    return () => clearInterval(t)
  }, []) // eslint-disable-line

  const submit = useCallback(() => {
    if (input === number) {
      sound.numberRight()
      const tierMult = tier === 'expert' ? 3.5 : tier === 'hard' ? 2.2 : tier === 'medium' ? 1.4 : 1
      const pts = Math.round((digits * 40 + 20) * tierMult)
      const newScore = score + pts
      setScore(newScore); setFB('correct')

      const newTier = getTierFromScore(newScore, THRESHOLDS)
      if (newTier !== tier) {
        setTier(newTier); setLevel(1)
        setTime(t => Math.min(t + 20, TIME_BY_TIER[newTier]))
        setMax(TIME_BY_TIER[newTier])
        sound.levelUp()
      } else {
        setLevel(l => Math.min(l + 1, 4))
      }
      setTimeout(nextRound, 600)
    } else {
      sound.numberWrong(); setFB('wrong')
      setTimeout(nextRound, 1200)
    }
  }, [input, number, digits, tier, score, nextRound])

  const tierColor = TIER_COLORS[tier]

  return (
    <GameLayout title="Number Recall 🔢" score={score} timerProgress={timeLeft / maxTime} timeLeft={timeLeft} onExit={onExit}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
          {digits} digits this round
        </div>
        <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: tierColor + '22', color: tierColor }}>
          {TIER_LABELS[tier]}
        </span>
      </div>
      <div className="flex flex-col items-center gap-6">
        <AnimatePresence mode="wait">
          {phase === 'show' && (
            <motion.div key="show" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
              className="font-display font-extrabold tracking-widest px-6 py-6 rounded-2xl text-center"
              style={{ fontSize: 'clamp(28px,6vw,44px)', background: '#7c6cff22', border: '2px solid #7c6cff44', color: '#7c6cff', letterSpacing: 6, wordBreak: 'break-all' }}>
              {number}
            </motion.div>
          )}
          {phase === 'hide' && (
            <motion.div key="hide" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.3 }}
              className="font-display font-extrabold px-6 py-6 rounded-2xl"
              style={{ fontSize: 'clamp(28px,6vw,44px)', background: 'var(--surface)', color: 'var(--dim)', letterSpacing: 6 }}>
              {'•'.repeat(digits)}
            </motion.div>
          )}
          {phase === 'input' && (
            <motion.div key="input" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xs">
              <p className="text-center text-sm mb-3" style={{ color: 'var(--muted)' }}>Type the number you saw:</p>
              <input value={input} onChange={e => setInput(e.target.value.replace(/\D/g, '').slice(0, digits))}
                onKeyDown={e => e.key === 'Enter' && submit()}
                className="w-full text-center font-display font-bold py-4 rounded-2xl"
                style={{ fontSize: 'clamp(20px,4vw,30px)', background: 'var(--surface)', border: '2px solid var(--border)', color: 'white', outline: 'none', letterSpacing: 4 }}
                autoFocus maxLength={digits} inputMode="numeric"
                onFocus={e => (e.target.style.borderColor = '#7c6cff')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              <motion.button whileTap={{ scale: 0.97 }} onClick={submit}
                className="w-full mt-3 py-3 rounded-2xl font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#7c6cff,#00d4aa)', border: 'none' }}>
                Submit →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {feedback && (
            <motion.div key={feedback} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-xl font-bold" style={{ color: feedback === 'correct' ? '#00d4aa' : '#ff6b6b' }}>
              {feedback === 'correct' ? '✅ Correct!' : `❌ It was: ${number}`}
            </motion.div>
          )}
        </AnimatePresence>
        {phase === 'show' && <p className="text-sm" style={{ color: 'var(--muted)' }}>Memorize this number!</p>}
      </div>
    </GameLayout>
  )
}
