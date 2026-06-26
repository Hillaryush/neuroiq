import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useScore } from '../../hooks/useScore'
import { sound } from '../../services/soundService'
import GameLayout from '../GameLayout'
import { ALGO_PUZZLE_BANK, type AlgoPuzzleQ } from '../../data/algoPuzzleQuestions'
import { pickQuestion, getTierFromScore, TIER_COLORS, TIER_LABELS, type DifficultyTier } from '../../utils/questionEngine'

interface Props { onFinish: (s: number) => void; onExit: () => void }

const THRESHOLDS = { medium: 100, hard: 300, expert: 600 }
const TIER_TIME: Record<DifficultyTier, number> = { easy: 35, medium: 45, hard: 95, expert: 120 }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  // Guard against accidental already-correct shuffle
  return a
}

export default function AlgorithmPuzzle({ onFinish, onExit }: Props) {
  const { score, add } = useScore()
  const [tier, setTier]       = useState<DifficultyTier>('easy')
  const [puzzle, setPuzzle]   = useState<AlgoPuzzleQ>(() => pickQuestion('algorithmpuzzle', ALGO_PUZZLE_BANK, 'easy'))
  const [order, setOrder]     = useState<string[]>(() => shuffle(puzzle.steps))
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [timeLeft, setTime]   = useState(TIER_TIME.easy)
  const [maxTime, setMax]     = useState(TIER_TIME.easy)

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
    const p = pickQuestion('algorithmpuzzle', ALGO_PUZZLE_BANK, newTier)
    setPuzzle(p)
    setOrder(shuffle(p.steps))
    setTime(TIER_TIME[newTier])
    setMax(TIER_TIME[newTier])
    setChecked(false)
    setCorrect(false)
  }, [])

  const moveUp   = (i: number) => { if (i === 0 || checked) return; sound.stepMoved(); const o = [...order]; [o[i-1],o[i]] = [o[i],o[i-1]]; setOrder(o) }
  const moveDown = (i: number) => { if (i === order.length - 1 || checked) return; sound.stepMoved(); const o = [...order]; [o[i],o[i+1]] = [o[i+1],o[i]]; setOrder(o) }

  const check = useCallback(() => {
    const ok = order.every((s, i) => s === puzzle.steps[i])
    setChecked(true)
    setCorrect(ok)
    if (ok) {
      const tierMult = tier === 'expert' ? 4.5 : tier === 'hard' ? 2.6 : tier === 'medium' ? 1.5 : 1
      sound.algoCorrect()
      add(Math.round((timeLeft * 10 + 80) * tierMult))
    }
    setTimeout(() => nextPuzzle(score + (ok ? 1 : 0)), 1300)
  }, [order, puzzle.steps, timeLeft, add, tier, score, nextPuzzle])

  const tierColor = TIER_COLORS[tier]

  return (
    <GameLayout title="Algorithm Puzzle ⚙️" score={score} timerProgress={timeLeft / maxTime} timeLeft={timeLeft} onExit={onExit}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm" style={{ color: 'var(--muted)' }}>
          Arrange steps in <strong style={{ color: 'white' }}>correct order</strong>
        </div>
        <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: tierColor + '22', color: tierColor }}>
          {TIER_LABELS[tier]}
        </span>
      </div>
      <div className="text-center font-bold mb-4" style={{ color: '#7c6cff', fontSize: 'clamp(13px,2.2vw,16px)' }}>
        {puzzle.title}
      </div>
      <div className="space-y-2 mb-5">
        {order.map((step, i) => (
          <motion.div key={step} layout className="flex items-center gap-2">
            <span className="font-display font-bold w-6 text-center text-sm shrink-0" style={{ color: 'var(--muted)' }}>{i + 1}</span>
            <div className="flex-1 px-3 py-2.5 rounded-xl font-medium border"
              style={{
                fontSize: 'clamp(11px,1.8vw,13px)',
                background: checked ? (correct ? '#00d4aa11' : order[i] === puzzle.steps[i] ? '#00d4aa11' : '#ff6b6b11') : 'var(--surface)',
                borderColor: checked ? (correct ? '#00d4aa' : order[i] === puzzle.steps[i] ? '#00d4aa' : '#ff6b6b') : 'var(--border)',
                color: 'white',
              }}>
              {step}
            </div>
            <div className="flex flex-col gap-0.5 shrink-0">
              <button onClick={() => moveUp(i)} className="px-2 py-0.5 rounded text-xs" style={{ background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border)' }}>▲</button>
              <button onClick={() => moveDown(i)} className="px-2 py-0.5 rounded text-xs" style={{ background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border)' }}>▼</button>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={check} disabled={checked}
        className="w-full py-3 rounded-2xl font-bold text-white"
        style={{ background: 'linear-gradient(135deg,#7c6cff,#5544ee)', border: 'none', opacity: checked ? 0.6 : 1 }}>
        ✅ Check Order
      </motion.button>
      {checked && (
        <div className="text-center mt-3 font-bold" style={{ color: correct ? '#00d4aa' : '#ff6b6b' }}>
          {correct ? '✅ Perfect!' : '❌ Not quite right, try again!'}
        </div>
      )}
    </GameLayout>
  )
}
