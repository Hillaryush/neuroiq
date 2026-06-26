import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { sound } from '../../services/soundService'
import GameLayout from '../GameLayout'
import { SEQUENCE_COLORS, SEQUENCE_COLOR_NAMES } from '../../utils/constants'
import { TIER_COLORS, TIER_LABELS, getTierFromScore, type DifficultyTier } from '../../utils/questionEngine'

type Phase = 'watch' | 'input' | 'result'
interface Props { onFinish: (s: number) => void; onExit: () => void }

// Higher tiers = faster playback speed + more colors available (6 colors max in palette)
const SPEED_BY_TIER: Record<DifficultyTier, number>  = { easy: 800, medium: 650, hard: 450, expert: 320 }
const COLORS_BY_TIER: Record<DifficultyTier, number> = { easy: 4, medium: 5, hard: 6, expert: 6 }
const THRESHOLDS = { medium: 150, hard: 450, expert: 900 }

export default function SequenceGame({ onFinish, onExit }: Props) {
  const [tier, setTier]       = useState<DifficultyTier>('easy')
  const [sequence, setSequence] = useState<number[]>([])
  const [playerInput, setPlayerInput] = useState<number[]>([])
  const [phase, setPhase]     = useState<Phase>('watch')
  const [litIndex, setLitIndex] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')
  const [score, setScore]     = useState(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const level = sequence.length
  const numColors = COLORS_BY_TIER[tier]
  const speed = SPEED_BY_TIER[tier]

  const clearTO = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }

  const playSequence = useCallback((seq: number[]) => {
    setPhase('watch'); setPlayerInput([])
    setFeedback('Watch carefully...')
    let i = 0
    const interval = setInterval(() => {
      if (i > 0) setLitIndex(null)
      if (i >= seq.length) {
        clearInterval(interval)
        timeoutRef.current = setTimeout(() => {
          setPhase('input'); setFeedback('Your turn! Repeat the sequence')
        }, 400)
        return
      }
      sound.seqLight(seq[i])
      setLitIndex(seq[i])
      i++
    }, speed)
    return () => clearInterval(interval)
  }, [speed])

  const nextRound = useCallback((currentScore: number) => {
    const newTier = getTierFromScore(currentScore, THRESHOLDS)
    if (newTier !== tier) { setTier(newTier); sound.levelUp() }
    const colorCount = COLORS_BY_TIER[newTier]
    const next = [...sequence, Math.floor(Math.random() * colorCount)]
    setSequence(next)
    playSequence(next)
  }, [sequence, tier, playSequence])

  useEffect(() => {
    const first = [Math.floor(Math.random() * numColors)]
    setSequence(first)
    playSequence(first)
    return clearTO
  }, []) // eslint-disable-line

  const pressButton = useCallback((idx: number) => {
    if (phase !== 'input') return
    sound.seqPress(idx)
    setLitIndex(idx)
    setTimeout(() => setLitIndex(null), 200)

    const newInput = [...playerInput, idx]
    setPlayerInput(newInput)
    const pos = newInput.length - 1

    if (newInput[pos] !== sequence[pos]) {
      setFeedback(`❌ Game Over — Level ${level} reached!`)
      setPhase('result')
      clearTO()
      timeoutRef.current = setTimeout(() => onFinish(score), 1500)
      return
    }

    if (newInput.length === sequence.length) {
      const tierMult = tier === 'expert' ? 3 : tier === 'hard' ? 2 : tier === 'medium' ? 1.3 : 1
      const pts = Math.round(level * 30 * tierMult)
      sound.seqSuccess()
      const newScore = score + pts
      setScore(newScore)
      setFeedback(`✅ Level ${level} complete! +${pts}`)
      setPhase('watch')
      clearTO()
      timeoutRef.current = setTimeout(() => nextRound(newScore), 1000)
    }
  }, [phase, playerInput, sequence, level, score, tier, nextRound, onFinish])

  const tierColor = TIER_COLORS[tier]

  return (
    <GameLayout title="Simon Says+" score={score} timerProgress={1} timeLeft={level} onExit={onExit} timerLabel="Level">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
          Sequence length: {level}
        </div>
        <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: tierColor + '22', color: tierColor }}>
          {TIER_LABELS[tier]}
        </span>
      </div>

      <div className="flex justify-center gap-1 mb-4">
        {Array.from({ length: Math.max(level, 1) }).map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full" style={{ background: SEQUENCE_COLORS[i % numColors] }} />
        ))}
      </div>

      <div className="flex justify-center gap-3 mb-6 flex-wrap">
        {SEQUENCE_COLORS.slice(0, numColors).map((color, i) => (
          <motion.button key={i}
            animate={litIndex === i ? { scale: 1.2, boxShadow: `0 0 28px ${color}` } : { scale: 1, boxShadow: 'none' }}
            transition={{ duration: 0.15 }}
            onClick={() => pressButton(i)}
            className="rounded-2xl border-2 font-bold"
            style={{ width: 'clamp(48px,10vw,64px)', height: 'clamp(48px,10vw,64px)',
              background: `${color}22`, borderColor: `${color}88`, color, fontSize: 'clamp(16px,3vw,20px)',
              cursor: phase === 'input' ? 'pointer' : 'default' }}
            title={SEQUENCE_COLOR_NAMES[i]}>
            {['①','②','③','④','⑤','⑥'][i]}
          </motion.button>
        ))}
      </div>

      <div className="text-center font-semibold text-base"
        style={{ color: feedback.startsWith('✅') ? '#00d4aa' : feedback.startsWith('❌') ? '#ff6b6b' : 'var(--muted)' }}>
        {feedback}
      </div>

      {phase === 'input' && (
        <div className="mt-4 flex justify-center gap-2 flex-wrap">
          {Array.from({ length: sequence.length }).map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full border"
              style={{ background: i < playerInput.length ? SEQUENCE_COLORS[playerInput[i]] : 'transparent', borderColor: 'var(--dim)' }} />
          ))}
        </div>
      )}
    </GameLayout>
  )
}
