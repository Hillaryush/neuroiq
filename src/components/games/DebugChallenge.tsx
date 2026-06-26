import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScore } from '../../hooks/useScore'
import { sound } from '../../services/soundService'
import GameLayout from '../GameLayout'
import { DEBUG_BANK, type BugQ } from '../../data/debugQuestions'
import { pickQuestion, getTierFromScore, TIER_COLORS, TIER_LABELS, type DifficultyTier } from '../../utils/questionEngine'

interface Props { onFinish: (s: number) => void; onExit: () => void }

const THRESHOLDS = { medium: 100, hard: 300, expert: 600 }
const TIER_TIME: Record<DifficultyTier, number> = { easy: 30, medium: 40, hard: 90, expert: 120 }

export default function DebugChallenge({ onFinish, onExit }: Props) {
  const { score, add } = useScore()
  const [tier, setTier]     = useState<DifficultyTier>('easy')
  const [bug, setBug]       = useState<BugQ>(() => pickQuestion('debugchallenge', DEBUG_BANK, 'easy'))
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

  const nextBug = useCallback((currentScore: number) => {
    const newTier = getTierFromScore(currentScore, THRESHOLDS)
    setTier(newTier)
    setBug(pickQuestion('debugchallenge', DEBUG_BANK, newTier))
    setTime(TIER_TIME[newTier])
    setMax(TIER_TIME[newTier])
  }, [])

  const choose = useCallback((opt: string) => {
    if (selected) return
    setSel(opt)
    if (opt === bug.answer) {
      const tierMult = tier === 'expert' ? 5 : tier === 'hard' ? 2.8 : tier === 'medium' ? 1.6 : 1
      sound.bugFound(); add(Math.round((timeLeft * 8 + 50) * tierMult)); setFB('correct')
    } else { sound.wrong(); setFB('wrong') }
    setTimeout(() => {
      nextBug(score + (opt === bug.answer ? 1 : 0))
      setSel(null); setFB(null)
    }, 1300)
  }, [selected, bug.answer, timeLeft, add, tier, score, nextBug])

  const tierColor = TIER_COLORS[tier]
  const isExpert = tier === 'expert'

  return (
    <GameLayout title="Debug Challenge 🐛" score={score} timerProgress={timeLeft / maxTime} timeLeft={timeLeft} onExit={onExit}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm" style={{ color: 'var(--muted)' }}>
          Find the <strong style={{ color: '#ff6b6b' }}>bug</strong> {isExpert ? '· LeetCode Hard level' : 'in this code'}
        </div>
        <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: tierColor + '22', color: tierColor }}>
          {TIER_LABELS[tier]}
        </span>
      </div>
      <div className="rounded-2xl p-4 mb-5 font-mono overflow-x-auto"
        style={{ background: '#0d0d14', border: '1px solid #2a2a3a', color: '#e2e8f0', lineHeight: 1.8, fontSize: 'clamp(11px,1.8vw,13px)' }}>
        {bug.code.split('\n').map((line, i) => (
          <div key={i} className="flex gap-3 whitespace-pre"
            style={{ background: i === bug.bugLine ? '#ff6b6b11' : 'transparent',
              borderLeft: i === bug.bugLine ? '3px solid #ff6b6b' : '3px solid transparent', paddingLeft: 8 }}>
            <span style={{ color: '#44445a', userSelect: 'none', minWidth: 16 }}>{i + 1}</span>
            <span style={{ color: i === bug.bugLine ? '#fca5a5' : line.startsWith('//') ? '#6b7280' : '#e2e8f0' }}>{line}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-2">
        {bug.options.map(opt => (
          <motion.button key={opt} whileHover={!selected ? { x: 4 } : {}} whileTap={!selected ? { scale: 0.98 } : {}}
            disabled={!!selected} onClick={() => choose(opt)}
            className="py-3 px-4 rounded-xl text-sm font-semibold text-left border"
            style={{
              background: opt === bug.answer && feedback ? '#00d4aa22' : selected === opt && feedback === 'wrong' ? '#ff6b6b22' : 'var(--surface)',
              borderColor: opt === bug.answer && feedback ? '#00d4aa' : selected === opt && feedback === 'wrong' ? '#ff6b6b' : 'var(--border)',
              color: 'white',
            }}>
            🔍 {opt}
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {feedback && (
          <motion.div key={feedback} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center mt-3 text-sm font-bold" style={{ color: feedback === 'correct' ? '#00d4aa' : '#ff6b6b' }}>
            {feedback === 'correct' ? `✅ Found it! ${bug.explanation}` : `❌ Bug: ${bug.answer} — ${bug.explanation}`}
          </motion.div>
        )}
      </AnimatePresence>
    </GameLayout>
  )
}
