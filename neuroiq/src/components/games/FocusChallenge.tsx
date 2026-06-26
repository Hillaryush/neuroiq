import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sound } from '../../services/soundService'
import GameLayout from '../GameLayout'
import { TIER_COLORS, TIER_LABELS, getTierFromScore, type DifficultyTier } from '../../utils/questionEngine'

interface Target { id: number; x: number; y: number; isTarget: boolean; color: string; size: number }
interface Props { onFinish: (s: number) => void; onExit: () => void }

// Higher tiers: faster spawn rate, more distractors, smaller/shorter-lived targets
const SPAWN_RATE_BY_TIER: Record<DifficultyTier, number>  = { easy: 950, medium: 750, hard: 480, expert: 320 }
const TARGET_RATIO_BY_TIER: Record<DifficultyTier, number> = { easy: 0.55, medium: 0.45, hard: 0.32, expert: 0.22 }
const TARGET_LIFE_BY_TIER: Record<DifficultyTier, number>  = { easy: 2400, medium: 2000, hard: 1400, expert: 1000 }
const THRESHOLDS = { medium: 200, hard: 600, expert: 1200 }

export default function FocusChallenge({ onFinish, onExit }: Props) {
  const [tier, setTier]       = useState<DifficultyTier>('easy')
  const [targets, setTargets] = useState<Target[]>([])
  const [timeLeft, setTime]   = useState(50)
  const [maxTime, setMax]     = useState(50)
  const [misses, setMisses]   = useState(0)
  const [hits, setHits]       = useState(0)
  const [score, setScore]     = useState(0)
  const [feedback, setFeedback] = useState<{ id: number; ok: boolean } | null>(null)
  const idRef    = useRef(0)
  const tierRef  = useRef<DifficultyTier>('easy')
  const scoreRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function spawnTarget() {
    const currentTier = tierRef.current
    const id = idRef.current++
    const x = 5 + Math.random() * 85
    const y = 10 + Math.random() * 75
    const isTarget = Math.random() < TARGET_RATIO_BY_TIER[currentTier]
    const distractorColors = ['#ff6b6b44', '#ffd16644', '#f472b644', '#a78bfa44']
    const color = isTarget ? '#00d4aa' : distractorColors[Math.floor(Math.random() * distractorColors.length)]
    const size = currentTier === 'expert' ? 30 : currentTier === 'hard' ? 34 : currentTier === 'medium' ? 38 : 42
    const life = TARGET_LIFE_BY_TIER[currentTier]
    const t: Target = { id, x, y, isTarget, color, size }
    setTargets(prev => [...prev.slice(-10), t])
    setTimeout(() => setTargets(prev => prev.filter(t2 => t2.id !== id)), life)
  }

  function restartSpawning(newTier: DifficultyTier) {
    if (spawnRef.current) clearInterval(spawnRef.current)
    spawnRef.current = setInterval(spawnTarget, SPAWN_RATE_BY_TIER[newTier])
  }

  useEffect(() => {
    timerRef.current = setInterval(() => setTime(p => {
      if (p <= 1) { clearInterval(timerRef.current!); onFinish(scoreRef.current); return 0 }
      return p - 1
    }), 1000)
    restartSpawning('easy')
    return () => {
      clearInterval(timerRef.current!)
      if (spawnRef.current) clearInterval(spawnRef.current)
    }
  }, []) // eslint-disable-line

  const click = useCallback((t: Target) => {
    setFeedback({ id: t.id, ok: t.isTarget })
    if (t.isTarget) {
      const tierMult = tier === 'expert' ? 3 : tier === 'hard' ? 2 : tier === 'medium' ? 1.3 : 1
      const pts = Math.round((30 + Math.floor(score / 100)) * tierMult)
      sound.targetHit()
      const newScore = score + pts
      setScore(newScore); scoreRef.current = newScore
      setHits(h => h + 1)

      const newTier = getTierFromScore(newScore, THRESHOLDS)
      if (newTier !== tier) {
        setTier(newTier); tierRef.current = newTier
        setTime(tm => Math.min(tm + 15, 100))
        setMax(m => Math.max(m, timeLeft + 15))
        restartSpawning(newTier)
        sound.levelUp()
      }
    } else {
      sound.targetMiss(); setMisses(m => m + 1)
    }
    setTargets(prev => prev.filter(t2 => t2.id !== t.id))
    setTimeout(() => setFeedback(null), 300)
  }, [score, tier, timeLeft])

  const tierColor = TIER_COLORS[tier]

  return (
    <GameLayout title="Focus Challenge 🎯" score={score} timerProgress={timeLeft / maxTime} timeLeft={timeLeft} onExit={onExit}>
      <div className="flex justify-between items-center text-xs mb-2 px-1" style={{ color: 'var(--muted)' }}>
        <span>✅ <strong style={{ color: '#00d4aa' }}>{hits}</strong></span>
        <span className="text-center flex-1" style={{ color: 'var(--muted)' }}>
          Click <strong style={{ color: 'white' }}>green circles</strong> only
        </span>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: tierColor + '22', color: tierColor }}>
          {TIER_LABELS[tier]}
        </span>
      </div>
      <div className="flex justify-end text-xs mb-1" style={{ color: 'var(--muted)' }}>
        ❌ Misses: <strong style={{ color: '#ff6b6b' }}>{misses}</strong>
      </div>

      <div className="relative rounded-2xl overflow-hidden" style={{ height: 320, background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <AnimatePresence>
          {targets.map(t => (
            <motion.button key={t.id}
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
              onClick={() => click(t)}
              className="absolute rounded-full border-2 cursor-pointer"
              style={{
                left: `${t.x}%`, top: `${t.y}%`,
                width: t.isTarget ? t.size : t.size - 8, height: t.isTarget ? t.size : t.size - 8,
                transform: 'translate(-50%,-50%)',
                background: t.color,
                borderColor: t.isTarget ? '#00d4aa' : 'transparent',
                boxShadow: t.isTarget ? '0 0 15px #00d4aa88' : 'none',
              }} />
          ))}
        </AnimatePresence>
        <AnimatePresence>
          {feedback && (
            <motion.div key={feedback.id} initial={{ opacity: 1, scale: 1 }} animate={{ opacity: 0, scale: 1.5 }} exit={{ opacity: 0 }}
              className="absolute top-4 right-4 font-bold text-lg pointer-events-none"
              style={{ color: feedback.ok ? '#00d4aa' : '#ff6b6b' }}>
              {feedback.ok ? '+pts' : 'Miss!'}
            </motion.div>
          )}
        </AnimatePresence>
        {targets.length === 0 && <div className="absolute inset-0 flex items-center justify-center text-sm" style={{ color: 'var(--dim)' }}>Get ready...</div>}
      </div>
    </GameLayout>
  )
}
